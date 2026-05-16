import { useCallback, useEffect, useState } from "react";

export default function useQueue(albumPhotos: photo[], starterIndex: number) {
	const [photos, setPhotos] = useState<photo[]>(albumPhotos);
	const [currIndex, setCurrIndex] = useState<number>(starterIndex);
	const [data, setData] = useState<{ [key: string]: string }>({});

	useEffect(() => {
		if (currIndex < 0) {
			setData({});
			return;
		}

		// TODO: Create some settings to set this shit up
		const nextPhotosToQueue = 3;
		const prevPhotosToQueue = 1;

		const firstPhotoIndexToQueue = currIndex - prevPhotosToQueue;
		const photosToQueueCount = nextPhotosToQueue + prevPhotosToQueue;

		const photosPromiseArr = Array(photosToQueueCount)
			.fill(null)
			.map(async (_, i) => {
				const photoIndex = firstPhotoIndexToQueue + i;
				const photoIndexStr = String(photoIndex);
				const photoAlreadyLoaded = data[photoIndexStr];

				if (photoAlreadyLoaded) {
					return Promise.resolve(photoAlreadyLoaded);
				}

				return window.ipcRenderer.photoToBase64(
					photos[photoIndex].filePath,
				);
			});

		(async () => {
			const photosArr = await Promise.all(photosPromiseArr);
			const newData = photosArr.reduce((acc, photo, i) => {
				acc[String(firstPhotoIndexToQueue + i)] = photo;
				return acc;
			}, data);
			setData(newData);
		})();
	}, [currIndex, photos, data]);

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
