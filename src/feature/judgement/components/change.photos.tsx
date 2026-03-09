import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
	const [prevPhotoPossible, setPrevPhotoPossible] = useState(false);

	const nextPhoto = () => {
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
		const isPrevPhotoPossible = albumData.some(
			(photo) =>
				photo.lastTimeDisplayed &&
				photo.lastTimeDisplayed.getTime() <
					(albumData[currPhoto.index].lastTimeDisplayed?.getTime() ??
						0),
		);
		// const isNextPhotoPossible = albumData.some(
		// 	(photo) =>
		// 		photo.rating &&
		// 		photo.lastTimeDisplayed &&
		// 		photo.lastTimeDisplayed.getTime() >
		// 			(albumData[currPhoto.index].lastTimeDisplayed?.getTime() ??
		// 				0),
		// );
		setPrevPhotoPossible(isPrevPhotoPossible);
		// setNextPhotoPossible(isNextPhotoPossible);
	}, [albumData, currPhoto]);
	return (
		<>
			<button onClick={prevPhoto} disabled={false}>
				Last
			</button>
			<button onClick={nextPhoto} disabled={false}>
				Next
			</button>
		</>
	);
}
