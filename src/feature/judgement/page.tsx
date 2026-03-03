import { Fragment, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import type { albumData, currPhotoData } from "./types";
import getAlbumData from "./untils/get.album.data";
import photoToBase64 from "./untils/photo.to.base64";
import FinishModal from "./components/finish.modal";

export type { albumData };

export default function Judgement() {
	const [albumData, setAlbumData] = useState<albumData[]>([]);
	const [searchParams] = useSearchParams();
	const albumTitle = searchParams.get("album");
	const naviate = useNavigate();

	const [currPhoto, setCurrPhoto] = useState<currPhotoData>({
		index: -1,
		photoBase64: "",
	});

	const ratePhoto = (rating: number | null) =>
		setAlbumData((prev) =>
			prev.map((photo, photoIndex) =>
				photoIndex === currPhoto.index
					? { ...photo, rating }
					: { ...photo },
			),
		);

	const nextPhoto = () => {
		if (albumData[currPhoto.index].rating) {
			setAlbumData((prev) =>
				prev.map((photo, index) =>
					index === currPhoto.index
						? { ...photo, lastTimeSkipped: new Date() }
						: { ...photo },
				),
			);
		}
		setCurrPhoto({ index: -1, photoBase64: "" });
	};

	//Initial album load
	useEffect(() => {
		if (!albumTitle) {
			return;
		}

		(async () => {
			const data = await getAlbumData(albumTitle);
			setAlbumData(data);
		})();
	}, [albumTitle]);

	// If photo is not chosen, it selects next one
	useEffect(() => {
		if (currPhoto.index >= 0 || albumData.length === 0) {
			return;
		}

		const unratedPhotoIndex = albumData.findIndex((photo) => !photo.rating);

		const earliestSkippedPhotoDateEpoch = Math.min(
			...albumData
				.filter((photo) => !photo.rating)
				.map((photo) => photo.lastTimeSkipped?.getTime())
				.filter((time): time is number => time !== undefined),
		);

		const earliestSkippedPhotoIndex = albumData
			.filter((photo) => photo.lastTimeSkipped)
			.findIndex(
				(photo) =>
					photo.lastTimeSkipped?.getTime() ===
					earliestSkippedPhotoDateEpoch,
			);

		console.log(unratedPhotoIndex);
		console.log(earliestSkippedPhotoIndex);
		if (unratedPhotoIndex !== -1) {
			setCurrPhoto({
				index: unratedPhotoIndex,
				photoBase64: "",
			});
			return;
		}

		if (earliestSkippedPhotoIndex !== -1) {
			setCurrPhoto({
				index: earliestSkippedPhotoIndex,
				photoBase64: "",
			});
			return;
		}

		//TODO: if there are no photos left
		if (import.meta.env.DEV) {
			console.log("They are no more photos left to rate");
		}
	}, [albumData, currPhoto.index]);

	// When new photo is picked for rating
	useEffect(() => {
		if (currPhoto.index < 0 || !albumData[currPhoto.index]) {
			return;
		}

		photoToBase64(albumData[currPhoto.index].path).then((img) =>
			setCurrPhoto((old) => ({ ...old, photoBase64: img })),
		);
	}, [albumData, currPhoto.index]);

	if (!albumTitle) {
		naviate("/");
		return <></>;
	}

	if (!albumData[currPhoto.index]) {
		return <div>Loading...</div>;
	}

	if (import.meta.env.DEV) {
		console.log(albumData);
	}

	return (
		<>
			{albumData.every((photo) => photo.rating) && (
				<FinishModal photosCount={albumData.length} />
			)}
			<button onClick={() => nextPhoto()}>Następny</button>
			<form>
				{new Array(Number(import.meta.env.VITE_MAX_RATING))
					.fill(undefined)
					.map((_, i) => (
						<Fragment key={i}>
							<label htmlFor={`${i + 1}`}>{i + 1}</label>
							<input
								type="radio"
								name="rating"
								id={`${i + 1}`}
								value={i + 1}
								checked={
									albumData[currPhoto.index].rating === i + 1
								}
								onChange={() => ratePhoto(i + 1)}
							/>
						</Fragment>
					))}
				<button type="reset">reset</button>
			</form>
			<button>Enter</button>
			<img src={currPhoto.photoBase64} alt="" />
		</>
	);
}
