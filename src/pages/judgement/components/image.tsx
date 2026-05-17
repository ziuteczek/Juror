import { Dispatch, SetStateAction, useEffect } from "react";
import type { currPhotoData } from "../types";
import useQueue from "../hooks/queue";

export default function JudgementImage({
	currPhoto,
	photos,
	setCurrPhoto,
}: {
	currPhoto: currPhotoData;
	photos: photo[];
	setCurrPhoto: Dispatch<SetStateAction<currPhotoData>>;
}) {
	const { setCurrIndex } = useQueue({
		albumPhotos: photos,
		starterIndex: currPhoto.index,
	});

	useEffect(() => {
		setCurrIndex(currPhoto.index);
	}, [currPhoto.index, setCurrIndex]);

	useEffect(() => {
		if (currPhoto.index < 0 || !photos[currPhoto.index]) {
			return;
		}

		window.ipcRenderer
			.photoToBase64(photos[currPhoto.index].filePath)
			.then((img) =>
				setCurrPhoto((old) => ({ ...old, photoBase64: img })),
			);
	}, [photos, currPhoto.index, setCurrPhoto]);

	return (
		<img
			src={currPhoto.photoBase64}
			alt={"Photo to judge"}
			className="object-contain max-h-svh max-w-[90svw]"
		/>
	);
}
