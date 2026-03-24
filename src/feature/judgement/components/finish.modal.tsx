import { Link } from "react-router-dom";
import { albumData } from "../types";

export default function FinishModal({
	photosCount,
	albumData,
}: {
	photosCount: number;
	albumData: albumData[];
}) {
	const end = albumData.every((photo) => !!photo.rating);

	if (!end) {
		return <></>;
	}

	return (
		<dialog open={true}>
			<h1>Finish</h1>
			<p>You finished rating all of your ${photosCount} photos</p>
			<Link to={"/offline-gallery"}>Back to gallery</Link>
			<button>Export resoults</button>
		</dialog>
	);
}
