import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { currPhotoData } from "../types";

export default function ChangePhotos({
	currPhoto,
	albumData,
	setCurrPhoto,
}: {
	currPhoto: currPhotoData;
	albumData: photo[];
	setCurrPhoto: Dispatch<SetStateAction<currPhotoData>>;
}) {
	const [nextPhotoPossible, setNextPhotoPossible] = useState(false);
	const [prevPhotoPossible, setPrevPhotoPossible] = useState(false);

	const nextPhoto = () => {
		if (!nextPhotoPossible) {
			return;
		}

		setCurrPhoto((oldPhoto) => ({
			index: oldPhoto.index + 1,
			photoBase64: "",
		}));
	};

	const prevPhoto = () => {
		if (!prevPhotoPossible) {
			return;
		}

		setCurrPhoto((oldPhoto) => ({
			index: oldPhoto.index - 1,
			photoBase64: "",
		}));
	};

	useEffect(() => {
		setNextPhotoPossible(albumData.length - 1 > currPhoto.index);
		setPrevPhotoPossible(currPhoto.index > 0);
	}, [albumData, currPhoto.index]);

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.code !== "Enter") {
				return;
			}

			nextPhoto();
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	});
	return (
		<div className="flex items-center justify-center">
			<div className="flex gap-3 font-bold text-white">
				<button
					onClick={prevPhoto}
					disabled={!prevPhotoPossible}
					className="px-4 py-2 text-lg uppercase bg-sky-600 hover:bg-sky-800 cursor-pointer transition-colors duration-300 disabled:bg-stone-500"
				>
					Last
				</button>
				<button
					onClick={nextPhoto}
					disabled={!nextPhotoPossible}
					className="px-4 py-2 text-lg uppercase bg-sky-600 hover:bg-sky-800 cursor-pointer transition-colors duration-300 disabled:bg-stone-500"
				>
					Next
				</button>
			</div>
		</div>
	);
}
