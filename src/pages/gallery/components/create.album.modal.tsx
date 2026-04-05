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
	const dialogRef = useRef<null | HTMLDialogElement>(null);

	const closeDialog = () => {
		setIsVisible(false);
	};

	useEffect(() => {
		const dialog = dialogRef.current;

		if (!dialog) {
			return;
		}

		if (isVisible && !dialog.open) {
			dialog.showModal();
		}

		if (!isVisible && dialog.open) {
			dialog.close();
		}
	}, [isVisible]);

	const createAlbum = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!albumTitle) {
			alert("Album title can't be empty");
			return;
		}

		const newAlbumPath = await window.ipcRenderer.createAlbum(
			albumTitle.trim(),
			maxRating,
		);

		setAlbumTitle("");
		closeDialog();

		if (!newAlbumPath) {
			alert("Failed to create album");
			return;
		}

		alert("Album created successfully");

		window.location.reload();
	};

	return (
		<dialog
			ref={dialogRef}
			onClose={closeDialog}
			onCancel={closeDialog}
			className="relative left-[50%] top-[50%] min-w-96 translate-x-[-50%] translate-y-[-50%] p-10 pt-14"
		>
			{/* exit btn */}
			<button
				type="button"
				onClick={closeDialog}
				className="absolute left-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center"
			>
				<img src={xIcon} alt="exit icon" className="h-full w-full" />
			</button>

			<form className="flex flex-col gap-2" onSubmit={createAlbum}>
				<h1 className="font-bold text-2xl">Create new album</h1>

				<label htmlFor="title" className="mt-3 text-xl">
					album title
				</label>
				<input
					type="text"
					name="title"
					id="title"
					autoFocus
					className="block w-full border px-2 py-1"
					value={albumTitle}
					onChange={(e) => setAlbumTitle(e.target.value)}
				/>

				<label htmlFor="max-rating">max rating</label>
				<div className="flex">
					<input
						type="range"
						id="max-rating"
						min={2}
						max={10}
						name="max-rating"
						value={maxRating}
						className="flex-1"
						onChange={(e) => setMaxRating(Number(e.target.value))}
					/>
					<span className="text-2xl font-bold">{maxRating}</span>
				</div>
				<button
					type="submit"
					className="bg-blue-500 text-white mt-3 text-2xl cursor-pointer"
				>
					create
				</button>
			</form>
		</dialog>
	);
}
