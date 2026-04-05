import { Link } from "react-router-dom";
import flowers from "../../../assets/flowers.svg";
import { useEffect } from "react";
export default function FinishModal({
	albumId,
	photos,
}: {
	albumId: string;
	photos: photo[];
}) {
	const end = photos.every((photo) => !!photo.rating);

	useEffect(() => {
		if (end) {
			window.ipcRenderer.updatePhotosRating(albumId, photos);
		}
	}, [end]);

	if (!end) {
		return <></>;
	}

	return (
		<dialog
			open={true}
			className="left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] pb-25 px-50 border"
		>
			<h1 className="pt-15 text-center text-5xl">You finished!</h1>
			<img
				src={flowers}
				className="max-w-100 max-h-100 size-full pt-10"
				alt="flowers"
			/>
			<p className="text-lg text-center">
				You finished rating all of your {photos.length} photos
			</p>
			<div className="flex flex-col items-center gap-2">
				<Link
					to={"/"}
					className="block bg-blue-500 w-full py-2 text-center text-white "
				>
					Back to the gallery
				</Link>
				<button className="block bg-green-500 w-full py-2 text-center cursor-pointer">
					Export resoults
				</button>
			</div>
		</dialog>
	);
}
