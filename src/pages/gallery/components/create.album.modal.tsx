import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../../components/modal";
import Button from "../../../components/button";
import { XIcon } from "../../../components/icons";

const MIN_RATING = 2;
const MAX_RATING = 10;
const DEFAULT_RATING = 6;

/**
 * Form for creating a new album. After creating, user is navigated to the new album.
 */
export default function CreateAlbumModal({ onClose }: { onClose: () => void }) {
	const [albumTitle, setAlbumTitle] = useState("");
	const [maxRating, setMaxRating] = useState(DEFAULT_RATING);
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const trimmedTitle = albumTitle.trim();

		if (!trimmedTitle) {
			setError("Album name can't be empty.");
			return;
		}

		setSubmitting(true);
		try {
			const newAlbumId = await window.ipcRenderer.createAlbum(
				trimmedTitle,
				maxRating,
			);

			if (!newAlbumId) {
				setError(
					"Couldn't create the album. An album with this name may already exist.",
				);
				return;
			}

			navigate(`/album?album=${newAlbumId}`);
		} catch (err) {
			console.error(err);
			setError("Couldn't create the album.");
		} finally {
			setSubmitting(false);
		}
	};

	const ratings = Array.from(
		{ length: MAX_RATING - MIN_RATING + 1 },
		(_, i) => MIN_RATING + i,
	);

	return (
		<Modal open onClose={onClose} labelledBy="create-album-title">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h2 id="create-album-title" className="text-lg font-semibold">
						New album
					</h2>
					<p className="mt-1 text-sm text-zinc-500">
						Pick a name and the rating scale for its photos.
					</p>
				</div>
				<Button
					variant="ghost"
					size="icon"
					onClick={onClose}
					aria-label="Close"
					className="-mr-2 -mt-1"
				>
					<XIcon />
				</Button>
			</div>

			<form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
				<div className="flex flex-col gap-1.5">
					<label htmlFor="album-title" className="text-sm font-medium">
						Name
					</label>
					<input
						type="text"
						id="album-title"
						autoFocus
						placeholder="e.g. Summer 2026"
						className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-accent focus:ring-3 focus:ring-accent-soft"
						value={albumTitle}
						onChange={(e) => {
							setAlbumTitle(e.target.value);
							setError("");
						}}
					/>
				</div>

				<fieldset className="flex flex-col gap-1.5">
					<legend className="mb-1.5 text-sm font-medium">
						Rating scale{" "}
						<span className="font-normal text-zinc-500">
							(1 – {maxRating})
						</span>
					</legend>
					<div className="grid grid-cols-9 gap-1 rounded-lg bg-zinc-100 p-1">
						{ratings.map((rating) => {
							const selected = rating === maxRating;
							return (
								<button
									key={rating}
									type="button"
									aria-pressed={selected}
									onClick={() => setMaxRating(rating)}
									className={`h-8 cursor-pointer rounded-md text-sm font-medium tabular-nums transition-colors ${
										selected
											? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200"
											: "text-zinc-500 hover:text-zinc-900"
									}`}
								>
									{rating}
								</button>
							);
						})}
					</div>
				</fieldset>

				{error && (
					<p role="alert" className="text-sm text-red-600">
						{error}
					</p>
				)}

				<div className="mt-1 flex justify-end gap-2">
					<Button onClick={onClose}>Cancel</Button>
					<Button type="submit" variant="primary" disabled={submitting}>
						Create album
					</Button>
				</div>
			</form>
		</Modal>
	);
}
