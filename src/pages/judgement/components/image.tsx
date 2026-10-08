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

	const filePath = photos[currPhoto.index]?.filePath;

	useEffect(() => {
		if (!filePath) {
			return;
		}

		// Ignore results of photos that are no longer current (e.g. user skipped quickly)
		let cancelled = false;

		window.ipcRenderer.photoToBase64(filePath).then((img) => {
			if (!cancelled) {
				setCurrPhoto((old) => ({ ...old, photoBase64: img }));
			}
		});

		return () => {
			cancelled = true;
		};
	}, [filePath, setCurrPhoto]);

	if (!currPhoto.photoBase64) {
		return (
			<div className="grid size-full place-items-center">
				<span className="size-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
			</div>
		);
	}

	return (
		<img
			src={currPhoto.photoBase64}
			alt="Photo to judge"
			className="size-full object-contain"
		/>
	);
}
