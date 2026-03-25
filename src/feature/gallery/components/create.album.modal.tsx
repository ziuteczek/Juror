import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import xIcon from "../../../assets/x.icon.svg";
import createteNewAlbum from "../utils/create.new.album";
import openAlbumDirectory from "../utils/open.album.directory";

export default function CreateAlbumModal({
	isVisible,
	setIsVisible,
}: {
	isVisible: boolean;
	setIsVisible: Dispatch<SetStateAction<boolean>>;
}) {
	const [albumTitle, setAlbumTitle] = useState("");
	const dialogRef = useRef<null | HTMLDialogElement>(null);

	useEffect(() => {
		if (isVisible) {
			dialogRef.current?.showModal();
		} else {
			dialogRef.current?.close();
		}
	}, [isVisible]);

	const createAlbum = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const success = await createteNewAlbum(albumTitle);

		setAlbumTitle("");
		setIsVisible(false);

		if (!success) {
			alert("Failed to create album");
			return;
		}

		alert("Album created successfully");

		const successDirOpen = await openAlbumDirectory(albumTitle);
		if (!successDirOpen) {
			alert("Failed to open album directory");
		}
	};

	return (
		<dialog
			ref={dialogRef}
			className="relative left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
		>
			{/* exit btn */}
			<button
				onClick={() => setIsVisible(false)}
				className="max-w-20 max-h-20 size-full cursor-pointer absolut top-0 left-0"
			>
				<img src={xIcon} alt="exit icon" />
			</button>

			<form className="flex flex-col my-40 mx-25" onSubmit={createAlbum}>
				<h1 className="font-bold text-2xl">Create new album</h1>

				<label htmlFor="title" className="block mt-3 text-xl">
					album title
				</label>
				<input
					type="text"
					name="title"
					id="title"
					className="border block"
					value={albumTitle}
					onChange={(e) => setAlbumTitle(e.target.value)}
				/>
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
