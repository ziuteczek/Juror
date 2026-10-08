import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../../components/modal";
import Button from "../../../components/button";
import { buttonClass } from "../../../components/button.styles";
import { CheckIcon, DownloadIcon } from "../../../components/icons";

/**
 * Shown once every photo has a rating. Ratings are saved whenever they change while all photos are rated.
 */
export default function FinishModal({
	albumId,
	albumName,
	photos,
}: {
	albumId: string;
	albumName: string;
	photos: photo[];
}) {
	const end = photos.length > 0 && photos.every((photo) => !!photo.rating);
	const [dismissed, setDismissed] = useState(false);

	useEffect(() => {
		if (end) {
			window.ipcRenderer.updatePhotosRating(albumId, photos);
		} else {
			// Show the modal again next time every photo gets rated
			setDismissed(false);
		}
	}, [end, albumId, photos]);

	return (
		<Modal
			open={end && !dismissed}
			onClose={() => setDismissed(true)}
			labelledBy="finish-title"
			width="max-w-sm"
			className="text-center"
		>
			<div className="mx-auto grid size-12 place-items-center rounded-full bg-accent-soft text-accent">
				<CheckIcon className="size-6" />
			</div>
			<h2 id="finish-title" className="mt-4 text-lg font-semibold">
				All photos rated
			</h2>
			<p className="mt-1 text-sm text-zinc-500">
				You rated all {photos.length} photos in{" "}
				<span className="font-medium text-zinc-700">{albumName}</span>.
				Your ratings are saved.
			</p>

			<div className="mt-6 flex flex-col gap-2">
				<Button
					variant="primary"
					onClick={() =>
						window.ipcRenderer.exportAlbumRatings(albumName, photos)
					}
				>
					<DownloadIcon />
					Export ratings
				</Button>
				<Link to={`/album?album=${albumId}`} className={buttonClass()}>
					Back to album
				</Link>
				<Button variant="ghost" onClick={() => setDismissed(true)}>
					Keep reviewing
				</Button>
			</div>
		</Modal>
	);
}
