import { useEffect, useState } from "react";
import Modal from "../../../components/modal";
import Button from "../../../components/button";
import RatingPicker from "../../../components/rating.picker";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	XIcon,
} from "../../../components/icons";

/**
 * Larger preview of a single photo that lets user change its rating.
 * Ratings are applied immediately through `onRate`. ←/→ switch to the previous/next photo.
 */
export default function PhotoRatingModal({
	photo,
	index,
	count,
	maxRating,
	onRate,
	onPrev,
	onNext,
	onClose,
}: {
	photo: photo;
	/** Position of the photo in the album (0-based) */
	index: number;
	count: number;
	maxRating: number;
	onRate: (rating: number | null) => void;
	onPrev: () => void;
	onNext: () => void;
	onClose: () => void;
}) {
	const [photoBase64, setPhotoBase64] = useState("");
	const hasPrev = index > 0;
	const hasNext = index < count - 1;

	useEffect(() => {
		let cancelled = false;
		setPhotoBase64("");

		window.ipcRenderer.photoToBase64(photo.filePath).then((img) => {
			if (!cancelled) setPhotoBase64(img);
		});

		return () => {
			cancelled = true;
		};
	}, [photo.filePath]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft" && hasPrev) {
				e.preventDefault();
				onPrev();
			} else if (e.key === "ArrowRight" && hasNext) {
				e.preventDefault();
				onNext();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [hasPrev, hasNext, onPrev, onNext]);

	return (
		<Modal open onClose={onClose} labelledBy="photo-title" width="max-w-4xl">
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					<h2
						id="photo-title"
						className="truncate text-lg font-semibold"
						title={photo.filePath}
					>
						{photo.fileName}
					</h2>
					<p className="text-sm text-zinc-500">
						Photo {index + 1} of {count}
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

			<div className="relative mt-4 h-[60vh] overflow-hidden rounded-lg bg-zinc-100">
				{photoBase64 ? (
					<img
						src={photoBase64}
						alt={photo.fileName}
						className="size-full object-contain"
					/>
				) : (
					<div className="grid size-full place-items-center">
						<span className="size-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
					</div>
				)}

				{hasPrev && (
					<Button
						size="icon"
						onClick={onPrev}
						aria-label="Previous photo"
						className="absolute left-3 top-1/2 -translate-y-1/2"
					>
						<ChevronLeftIcon />
					</Button>
				)}
				{hasNext && (
					<Button
						size="icon"
						onClick={onNext}
						aria-label="Next photo"
						className="absolute right-3 top-1/2 -translate-y-1/2"
					>
						<ChevronRightIcon />
					</Button>
				)}
			</div>

			<div className="mt-5 flex flex-wrap items-center justify-between gap-3">
				<RatingPicker
					value={photo.rating}
					max={maxRating}
					onChange={onRate}
					className="flex flex-wrap gap-2"
				/>
				<Button
					variant="ghost"
					size="sm"
					disabled={photo.rating === null}
					onClick={() => onRate(null)}
				>
					Clear rating
				</Button>
			</div>

			<p className="mt-4 text-xs text-zinc-500">
				Press 1–{maxRating >= 10 ? "0" : maxRating} to rate, Backspace to
				clear, ← → to switch photos. Changes are saved automatically.
			</p>
		</Modal>
	);
}
