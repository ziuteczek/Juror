import { useEffect, useState } from "react";
import { redirect, useSearchParams } from "react-router-dom";

import type { albumData } from "./types";
import getAlbumData from "./untils/get.album.data";
import photoToBase64 from "./untils/photo.to.base64";

export type { albumData };

export default function Judgement() {
	const [currPhotoIndex, setCurrPhotoIndex] = useState<number>(-1);
	const [currPhotoBase64, setCurrPhotoBase64] = useState<string>("");
	const [albumData, setAlbumData] = useState<albumData[]>([]);
	const [searchParams] = useSearchParams();

	const albumTitle = searchParams.get("album");

	useEffect(() => {
		if (!albumTitle) {
			return;
		}

		(async () => {
			const data = await getAlbumData(albumTitle);
			setAlbumData(data);
		})();
	}, [albumTitle]);

	useEffect(() => {
		if (albumData.length === 0 || currPhotoIndex !== -1) {
			return;
		}
		const newCurrPhoto = albumData.findIndex((photo) => !photo.rating);
		setCurrPhotoIndex(newCurrPhoto === -1 ? 0 : newCurrPhoto);
	}, [albumData, currPhotoIndex]);

	useEffect(() => {
		if (currPhotoIndex < 0 || !albumData[currPhotoIndex]) {
			return;
		}

		photoToBase64(albumData[currPhotoIndex].path).then((img) =>
			setCurrPhotoBase64(img),
		);
	}, [albumData, currPhotoIndex]);

	if (!albumTitle) {
		redirect("/");
		return <></>;
	}
	return <img src={currPhotoBase64} alt="" />;
}
