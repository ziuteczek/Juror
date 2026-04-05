import { Dispatch, SetStateAction, useEffect } from "react";
import type { currPhotoData } from "../types";

export default function JudgementImage({
	currPhoto,
	albumData,
	setCurrPhoto,
}: {
	currPhoto: currPhotoData;
	albumData: photo[];
	setCurrPhoto: Dispatch<SetStateAction<currPhotoData>>;
}) {
	// When new photo is picked for rating
	useEffect(() => {
		if (currPhoto.index < 0 || !albumData[currPhoto.index]) {
			return;
		}

		window.ipcRenderer
			.photoToBase64(albumData[currPhoto.index].filePath)
			.then((img) =>
				setCurrPhoto((old) => ({ ...old, photoBase64: img })),
			);
	}, [albumData, currPhoto.index, setCurrPhoto]);

	return (
		<img
			src={currPhoto.photoBase64}
			alt={"Photo to judge"}
			className="object-contain max-h-svh max-w-[90svw]"
		/>
	);
}
