import { Dispatch, SetStateAction, useEffect } from "react";
import { albumData, currPhotoData } from "../types";

export default function ChangePhotos({
	currPhoto,
	albumData,
	setAlbumData,
	setCurrPhoto,
}: {
	currPhoto: currPhotoData;
	albumData: albumData[];
	setAlbumData: Dispatch<SetStateAction<albumData[]>>;
	setCurrPhoto: Dispatch<SetStateAction<currPhotoData>>;
}) {
	// const [nextPhotoPossible, setNextPhotoPossible] = useState(false);
	// const [prevPhotoPossible, setPrevPhotoPossible] = useState(false);

	const nextPhoto = () => {
		if (
			albumData.find(
				(photo) =>
					(photo.lastTimeDisplayed?.getTime() ?? 0) >
					(albumData[currPhoto.index].lastTimeDisplayed?.getTime() ??
						Infinity),
			)
		) {
			const photosDisplayedBeforeCurrPhoto = albumData
				.filter(
					(photo) =>
						(photo.lastTimeDisplayed?.getTime() ?? 0) >
						(albumData[
							currPhoto.index
						].lastTimeDisplayed?.getTime() as number),
				)
				.map((photo) => photo.lastTimeDisplayed?.getTime() as number);
			const nextPhotoLastTimeDisplayed = Math.min(
				...photosDisplayedBeforeCurrPhoto,
			);
			if (!isFinite(nextPhotoLastTimeDisplayed)) {
				return;
			}
			const nextPhotoIndex = albumData.findIndex(
				(photo) =>
					photo.lastTimeDisplayed?.getTime() ===
					nextPhotoLastTimeDisplayed,
			) as number;
			setCurrPhoto({ index: nextPhotoIndex, photoBase64: "" });
			return;
		}

		setAlbumData((prev) =>
			prev.map((photo, index) =>
				index === currPhoto.index
					? { ...photo, lastTimeDisplayed: new Date() }
					: { ...photo },
			),
		);

		setCurrPhoto({ index: -1, photoBase64: "" });
	};

	const prevPhoto = () => {
		const currentPhotoTime =
			albumData[currPhoto.index]?.lastTimeDisplayed?.getTime();

		const photosLastTimeDisplayed = albumData
			.filter(
				(photo) =>
					(photo.lastTimeDisplayed?.getTime() ?? Infinity) <
					(currentPhotoTime ?? Infinity),
			)
			.map((photo) => photo.lastTimeDisplayed?.getTime()) as number[];

		const prevPhotoLastTimeDisplayed = Math.max(...photosLastTimeDisplayed);
		if (!Number.isFinite(prevPhotoLastTimeDisplayed)) {
			return;
		}
		const prevPhotoIndex = albumData.findIndex(
			(photo) =>
				photo.lastTimeDisplayed?.getTime() ===
				prevPhotoLastTimeDisplayed,
		) as number;

		setCurrPhoto({ index: prevPhotoIndex, photoBase64: "" });
	};

	useEffect(() => {
		// const isPrevPhotoPossible = albumData.some(
		// 	(photo) =>
		// 		photo.lastTimeDisplayed &&
		// 		photo.lastTimeDisplayed.getTime() <
		// 			(albumData[currPhoto.index].lastTimeDisplayed?.getTime() ??
		// 				0),
		// );
		// const isNextPhotoPossible = albumData.some(
		// 	(photo) =>
		// 		photo.rating &&
		// 		photo.lastTimeDisplayed &&
		// 		photo.lastTimeDisplayed.getTime() >
		// 			(albumData[currPhoto.index].lastTimeDisplayed?.getTime() ??
		// 				0),
		// );
		// setPrevPhotoPossible(isPrevPhotoPossible);
		// setNextPhotoPossible(isNextPhotoPossible);
	}, [albumData, currPhoto]);
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
