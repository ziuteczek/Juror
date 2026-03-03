import { Dispatch, SetStateAction, useEffect } from "react";
import type { albumData, currPhotoData } from "../types";
import photoToBase64 from "../untils/photo.to.base64";

export default function JudgementImage({
	currPhoto,
	albumData,
	setCurrPhoto,
}: {
	currPhoto: currPhotoData;
	albumData: albumData[];
	setCurrPhoto: Dispatch<SetStateAction<currPhotoData>>;
}) {
	// When new photo is picked for rating
	useEffect(() => {
		if (currPhoto.index < 0 || !albumData[currPhoto.index]) {
			return;
		}

		photoToBase64(albumData[currPhoto.index].path).then((img) =>
			setCurrPhoto((old) => ({ ...old, photoBase64: img })),
		);
	}, [albumData, currPhoto.index, setCurrPhoto]);

	return <img src={currPhoto.photoBase64} alt={"Photo to judge"} />;
}
