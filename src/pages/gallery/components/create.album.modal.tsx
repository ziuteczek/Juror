import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import xIcon from "../../../assets/x.icon.svg";

export default function CreateAlbumModal({
	isVisible,
	setIsVisible,
}: {
	isVisible: boolean;
	setIsVisible: Dispatch<SetStateAction<boolean>>;
}) {
	const [albumTitle, setAlbumTitle] = useState("");
	const [maxRating, setMaxRating] = useState(6);
	const dialogRef = useRef<HTMLDialogElement | null>(null);

	const closeDialog = () => {
		setIsVisible(false);
	};

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isVisible) {
			if (!dialog.open) dialog.showModal();
		} else {
			if (dialog.open) dialog.close();
		}
	}, [isVisible]);

	const createAlbum = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const trimmedTitle = albumTitle.trim();

		if (!trimmedTitle) {
			alert("Album title can't be empty");
			return;
		}

		try {
			const newAlbumPath = await window.ipcRenderer.createAlbum(
				trimmedTitle,
				maxRating,
			);

			if (!newAlbumPath) {
				alert("Failed to create album");
				return;
			}

			alert("Album created successfully");

			setAlbumTitle("");
			setMaxRating(6);
			closeDialog();

			// Avoid full reload if possible, but keeping your logic:
			window.location.reload();
		} catch (err) {
			console.error(err);
			alert("Something went wrong");
		}
	};

	return (
		<dialog
			ref={dialogRef}
			onClose={closeDialog}
			onCancel={(e) => {
				e.preventDefault(); // prevent ESC from bypassing React state
				closeDialog();
			}}
			className="relative left-[50%] top-[50%] min-w-96 translate-x-[-50%] translate-y-[-50%] p-10 pt-14"
		>
			{/* exit btn */}
			<button
				type="button"
				onClick={closeDialog}
				className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center"
			>
				<img src={xIcon} alt="exit icon" className="h-full w-full" />
			</button>

			<form className="flex flex-col gap-2" onSubmit={createAlbum}>
				<h1 className="text-2xl font-bold">Create new album</h1>

				<label htmlFor="title" className="mt-3 text-xl">
					Album title
				</label>
				<input
					type="text"
					id="title"
					autoFocus
					className="block w-full border px-2 py-1"
					value={albumTitle}
					onChange={(e) => setAlbumTitle(e.target.value)}
				/>

				<label htmlFor="max-rating">Max rating</label>
				<div className="flex items-center gap-2">
					<input
						type="range"
						id="max-rating"
						min={2}
						max={10}
						value={maxRating}
						className="flex-1"
						onChange={(e) => setMaxRating(Number(e.target.value))}
					/>
					<span className="text-2xl font-bold">{maxRating}</span>
				</div>

				<button
					type="submit"
					className="mt-3 cursor-pointer bg-blue-500 text-2xl text-white"
				>
					Create
				</button>
			</form>
		</dialog>
	);
}
