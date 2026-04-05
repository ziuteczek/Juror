import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import FinishModal from "./components/finish.modal";
import JudgementImage from "./components/image";
import { devMode } from "../../env";
import SelectRating from "./components/select.rating";
import ChangePhotos from "./components/change.photos";
import ExitJudgement from "./components/exit";
import { currPhotoData } from "./types";

/**
 * It's judging album given in search params under the key "album".
 */
export default function Judgement() {
	const [albumData, setAlbumData] = useState<photo[]>([]);
	const [maxRating, setMaxRating] = useState(0);
	const [searchParams] = useSearchParams();
	const albumTitle = searchParams.get("album");
	const naviate = useNavigate();

	const [currPhoto, setCurrPhoto] = useState<currPhotoData>({
		index: -1,
		photoBase64: "",
	});

	//Initial album load
	useEffect(() => {
		if (!albumTitle) {
			return;
		}

		(async () => {
			const data = await window.ipcRenderer.getAlbum(albumTitle);
			setAlbumData(data.photos);
			setMaxRating(data.maxRating);
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
				.map((photo) => photo.lastTimeDisplayed?.getTime())
				.filter((time): time is number => time !== undefined),
		);

		const earliestSkippedPhotoIndex = albumData
			.filter((photo) => photo.lastTimeDisplayed)
			.findIndex(
				(photo) =>
					photo.lastTimeDisplayed?.getTime() ===
					earliestSkippedPhotoDateEpoch,
			);

		if (devMode) {
			console.log(unratedPhotoIndex);
			console.log(earliestSkippedPhotoIndex);
		}

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

		if (devMode) {
			console.log("They are no more photos left to rate");
		}
	}, [albumData, currPhoto.index]);

	if (!albumTitle) {
		naviate("/");
		return <></>;
	}

	if (!albumData[currPhoto.index]) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex max-h-svh h-svh">
			<JudgementImage
				setCurrPhoto={setCurrPhoto}
				currPhoto={currPhoto}
				albumData={albumData}
			/>

			<div className="flex-1 flex flex-col p-2 justify-center items-center">
				<SelectRating
					albumData={albumData}
					currPhoto={currPhoto}
					maxRating={maxRating}
					setAlbumData={setAlbumData}
				/>
				<ChangePhotos
					albumData={albumData}
					currPhoto={currPhoto}
					setAlbumData={setAlbumData}
					setCurrPhoto={setCurrPhoto}
				/>
				<ExitJudgement albumPath={albumTitle} />
				{/* <img src={settingsIcon} alt="" /> */}
			</div>
			<FinishModal albumData={albumData} />
		</div>
	);
}
