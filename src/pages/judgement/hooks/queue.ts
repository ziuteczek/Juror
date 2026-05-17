import { useCallback, useEffect, useRef, useState } from "react";

export default function useQueue({
	albumPhotos,
	starterIndex,
}: {
	albumPhotos: photo[];
	starterIndex: number;
}) {
	const [photos, setPhotos] = useState<photo[]>(albumPhotos);
	const [currIndex, setCurrIndex] = useState<number>(starterIndex);
	const [data, setData] = useState<{ [key: string]: string }>({});

	const dataRef = useRef(data);
	dataRef.current = data;

	useEffect(() => {
		const data = dataRef.current;

		if (currIndex < 0) {
			setData({});
			return;
		}

		// TODO: Create some settings to set this shit up
		const nextPhotosToQueue = 3;
		const prevPhotosToQueue = 1;

		const firstPhotoIndexToQueue = currIndex - prevPhotosToQueue;
		const photosToQueueCount = nextPhotosToQueue + prevPhotosToQueue;
		const lastPhotoIndex = currIndex + photosToQueueCount;

		const photosToKeepArr = Object.keys(data)
			.map((photoIndexStr) => Number(photoIndexStr))
			.filter(
				(photoIndex) =>
					photoIndex >= firstPhotoIndexToQueue &&
					photoIndex <= lastPhotoIndex,
			)
			.map((photoIndex) => [String(photoIndex), data[photoIndex]]);

		const photosToKeep = Object.fromEntries(photosToKeepArr);

		setData(photosToKeep);

		Array(photosToQueueCount)
			.fill(null)
			.forEach(async (_, i) => {
				const photoIndex = firstPhotoIndexToQueue + i;
				const photoIndexStr = String(photoIndex);
				const photoAlreadyLoaded = data[photoIndexStr];

				if (!photos[photoIndex]?.filePath) {
					return;
				}

				if (photoAlreadyLoaded) {
					return;
				}

				const photoBase64Img = await window.ipcRenderer.photoToBase64(
					photos[photoIndex].filePath,
				);

				setData((prev) => ({
					...prev,
					[photoIndexStr]: photoBase64Img,
				}));

				return;
			});
	}, [currIndex, photos]);

	useEffect(() => {
		console.log(data);
	}, [data]);

	const getPhotoBase64 = useCallback(
		async (index: number) => {
			const indexStr = String(index);

			if (data[indexStr]) {
				return data[indexStr];
			}

			return window.ipcRenderer.photoToBase64(photos[index].filePath);
		},
		[data, photos],
	);

	return { setCurrIndex, getPhotoBase64, setPhotos };
}
