import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import FinishModal from "./components/finish.modal";
import JudgementImage from "./components/image";
import ChangePhotos from "./components/change.photos";
import ExitJudgement from "./components/exit";
import { currPhotoData } from "./types";
import { getArrangedPhotos } from "./utils";
import SelectRating from "./components/select.rating";

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
			setPhotos(getArrangedPhotos(data.photos));
			setMaxRating(data.maxRating);
		})();
	}, [albumId]);

	// If photo is not chosen, it selects next one
	useEffect(() => {
		if (currPhoto.index !== -1 || !albumId) {
			return;
		}

		const firstUnratedPhotoIndex = photos.findIndex(
			(photo) => !photo.lastRated,
		);

		if (firstUnratedPhotoIndex === -1) {
			return;
		}

		setCurrPhoto({ index: firstUnratedPhotoIndex, photoBase64: "" });
	}, [photos, currPhoto.index, setCurrPhoto, albumId]);

	if (!albumId) {
		naviate("/");
		return <></>;
	}

	if (!photos[currPhoto.index]) {
		return (
			<div>
				<p>Loading</p>
			</div>
		);
	}

	return (
		<div className="flex max-h-svh h-svh">
			<JudgementImage
				setCurrPhoto={setCurrPhoto}
				currPhoto={currPhoto}
				photos={photos}
			/>

			<div className="flex-1 flex flex-col p-2 justify-center items-center">
				<SelectRating
					photos={photos}
					setPhoto={setPhotos}
					currPhoto={currPhoto}
					maxRating={maxRating}
				/>
				<ChangePhotos
					photos={photos}
					currPhoto={currPhoto}
					// setPhotos={setPhotos}
					setCurrPhoto={setCurrPhoto}
				/>
				<ExitJudgement albumId={albumId} photos={photos} />
			</div>
			<FinishModal photos={photos} albumId={albumId} />
		</div>
	);
}
