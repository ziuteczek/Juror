import { Link } from "react-router-dom";

export default function FinishModal({ photosCount }: { photosCount: number }) {
	return (
		<dialog open={true}>
			<h1>Finish</h1>
			<p>You finished rating all of your ${photosCount} photos</p>
			<Link to={"/offline-gallery"}>Back to gallery</Link>
			<button>Export resoults</button>
		</dialog>
	);
}
