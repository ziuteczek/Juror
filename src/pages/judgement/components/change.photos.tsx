import { Dispatch, SetStateAction, useEffect } from "react";
import { currPhotoData } from "../types";
import Button from "../../../components/button";
import { ChevronLeftIcon, ChevronRightIcon } from "../../../components/icons";

export default function ChangePhotos({
	currPhoto,
	photos,
	setCurrPhoto,
}: {
	currPhoto: currPhotoData;
	photos: photo[];
	setCurrPhoto: Dispatch<SetStateAction<currPhotoData>>;
}) {
	const nextPhotoPossible = photos.length - 1 > currPhoto.index;
	const prevPhotoPossible = currPhoto.index > 0;

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
		const handleKeyPress = (e: KeyboardEvent) => {
			// Let modal buttons handle their own keys
			if (e.target instanceof Element && e.target.closest("dialog")) {
				return;
			}

			if (e.code === "Enter" || e.code === "ArrowRight") {
				// Prevents a focused button from also handling Enter (double skip)
				e.preventDefault();
				nextPhoto();
			} else if (e.code === "ArrowLeft") {
				e.preventDefault();
				prevPhoto();
			}
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	});

	return (
		<div className="grid grid-cols-2 gap-2">
			<Button onClick={prevPhoto} disabled={!prevPhotoPossible}>
				<ChevronLeftIcon />
				Previous
			</Button>
			<Button onClick={nextPhoto} disabled={!nextPhotoPossible}>
				Next
				<ChevronRightIcon />
			</Button>
		</div>
	);
}
