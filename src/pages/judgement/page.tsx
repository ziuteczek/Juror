import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import FinishModal from "./components/finish.modal";
import JudgementImage from "./components/image";
import SelectRating from "./components/select.rating";
import ChangePhotos from "./components/change.photos";
import ExitJudgement from "./components/exit";
import { currPhotoData } from "./types";

/**
 * It's judging album given in search params under the key "album".
 */
export default function Judgement() {
	const [photos, setPhotos] = useState<photo[]>([]);
	const [maxRating, setMaxRating] = useState(0);
	const [searchParams] = useSearchParams();
	const albumId = searchParams.get("album");
	const naviate = useNavigate();

	const [currPhoto, setCurrPhoto] = useState<currPhotoData>({
		index: -1,
		photoBase64: "",
	});

	//Initial album load
	useEffect(() => {
		if (!albumId) {
			return;
		}

		(async () => {
			const data = await window.ipcRenderer.getAlbum(albumId);
			setPhotos(data.photos);
			setMaxRating(data.maxRating);
		})();
	}, [albumId]);

	// If photo is not chosen, it selects next one
	useEffect(() => {
		if (currPhoto.index >= 0 || photos.length === 0) {
			return;
		}

		const unratedPhotoIndex = photos.findIndex((photo) => !photo.rating);

		const earliestSkippedPhotoDateEpoch = Math.min(
			...photos
				.filter((photo) => !photo.rating)
				.map((photo) => photo.lastDisplayed?.getTime())
				.filter((time): time is number => time !== undefined),
		);

		const earliestSkippedPhotoIndex = photos
			.filter((photo) => photo.lastDisplayed)
			.findIndex(
				(photo) =>
					photo.lastDisplayed?.getTime() ===
					earliestSkippedPhotoDateEpoch,
			);

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
	}, [photos, currPhoto.index]);

	if (!albumId) {
		naviate("/");
		return <></>;
	}

	if (!photos[currPhoto.index]) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex max-h-svh h-svh">
			<JudgementImage
				setCurrPhoto={setCurrPhoto}
				currPhoto={currPhoto}
				albumData={photos}
			/>

			<div className="flex-1 flex flex-col p-2 justify-center items-center">
				<SelectRating
					photos={photos}
					setPhoto={setPhotos}
					currPhoto={currPhoto}
					maxRating={maxRating}
				/>
				<ChangePhotos
					albumData={photos}
					currPhoto={currPhoto}
					setPhotos={setPhotos}
					setCurrPhoto={setCurrPhoto}
				/>
				<ExitJudgement albumId={albumId} photos={photos} />
			</div>
			<FinishModal photos={photos} albumId={albumId} />
		</div>
	);
}
