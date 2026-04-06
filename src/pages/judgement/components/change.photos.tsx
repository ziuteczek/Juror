import { Dispatch, SetStateAction, useEffect } from "react";
import { currPhotoData } from "../types";

export default function ChangePhotos({
	currPhoto,
	albumData,
	setPhotos,
	setCurrPhoto,
}: {
	currPhoto: currPhotoData;
	albumData: photo[];
	setPhotos: Dispatch<SetStateAction<photo[]>>;
	setCurrPhoto: Dispatch<SetStateAction<currPhotoData>>;
}) {
	// const [nextPhotoPossible, setNextPhotoPossible] = useState(false);
	// const [prevPhotoPossible, setPrevPhotoPossible] = useState(false);

	const nextPhoto = () => {
		if (
			albumData.find(
				(photo) =>
					(photo.lastDisplayed?.getTime() ?? 0) >
					(albumData[currPhoto.index].lastDisplayed?.getTime() ??
						Infinity),
			)
		) {
			const photosDisplayedBeforeCurrPhoto = albumData
				.filter(
					(photo) =>
						(photo.lastDisplayed?.getTime() ?? 0) >
						(albumData[
							currPhoto.index
						].lastDisplayed?.getTime() as number),
				)
				.map((photo) => photo.lastDisplayed?.getTime() as number);
			const nextPhotolastDisplayed = Math.min(
				...photosDisplayedBeforeCurrPhoto,
			);
			if (!isFinite(nextPhotolastDisplayed)) {
				return;
			}
			const nextPhotoIndex = albumData.findIndex(
				(photo) =>
					photo.lastDisplayed?.getTime() === nextPhotolastDisplayed,
			) as number;
			setCurrPhoto({ index: nextPhotoIndex, photoBase64: "" });
			return;
		}

		setPhotos((prev) =>
			prev.map((photo, index) =>
				index === currPhoto.index
					? { ...photo, lastDisplayed: new Date() }
					: { ...photo },
			),
		);

		setCurrPhoto({ index: -1, photoBase64: "" });
	};

	const prevPhoto = () => {
		const currentPhotoTime =
			albumData[currPhoto.index]?.lastDisplayed?.getTime();

		const photoslastDisplayed = albumData
			.filter(
				(photo) =>
					(photo.lastDisplayed?.getTime() ?? Infinity) <
					(currentPhotoTime ?? Infinity),
			)
			.map((photo) => photo.lastDisplayed?.getTime()) as number[];

		const prevPhotolastDisplayed = Math.max(...photoslastDisplayed);
		if (!Number.isFinite(prevPhotolastDisplayed)) {
			return;
		}
		const prevPhotoIndex = albumData.findIndex(
			(photo) =>
				photo.lastDisplayed?.getTime() === prevPhotolastDisplayed,
		) as number;

		setCurrPhoto({ index: prevPhotoIndex, photoBase64: "" });
	};

	useEffect(() => {
		// const isPrevPhotoPossible = albumData.some(
		// 	(photo) =>
		// 		photo.lastDisplayed &&
		// 		photo.lastDisplayed.getTime() <
		// 			(albumData[currPhoto.index].lastDisplayed?.getTime() ??
		// 				0),
		// );
		// const isNextPhotoPossible = albumData.some(
		// 	(photo) =>
		// 		photo.rating &&
		// 		photo.lastDisplayed &&
		// 		photo.lastDisplayed.getTime() >
		// 			(albumData[currPhoto.index].lastDisplayed?.getTime() ??
		// 				0),
		// );
		// setPrevPhotoPossible(isPrevPhotoPossible);
		// setNextPhotoPossible(isNextPhotoPossible);
	}, [albumData, currPhoto]);

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
					disabled={false}
					className="px-4 py-2 text-lg uppercase bg-sky-600 hover:bg-sky-800 cursor-pointer transition-colors duration-300"
				>
					Last
				</button>
				<button
					onClick={nextPhoto}
					disabled={false}
					className="px-4 py-2 text-lg uppercase bg-sky-600 hover:bg-sky-800 cursor-pointer transition-colors duration-300"
				>
					Next
				</button>
			</div>
		</div>
	);
}
