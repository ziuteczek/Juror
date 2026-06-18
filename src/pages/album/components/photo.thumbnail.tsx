import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import trashIcon from "../../../assets/trash.icon.svg";

/**
 *
 * @returns Photo thumbnail component, that displays photo's name, photo and rating. ~It's all wrapped around a link to a single  photo rating page~. Thumbnail is loaded only when it's in the viewport.
 */
export default function PhotoThumbnail({
	path,
	rating,
	fileName,
	albumId,
	maxRating,
}: {
	path: string;
	rating: number | null;
	fileName: string;
	albumId: string;
	maxRating: number;
}) {
	const { ref, inView } = useInView();
	const [photoBase64, setPhotoBase64] = useState("");

	useEffect(() => {
		(async () => {
			if (!inView) {
				setPhotoBase64("");
				return;
			}

			const photoStr = await window.ipcRenderer.photoToBase64(path);

			if (!photoStr) {
				console.error(`Photo with path "${path}" not found`);
				return;
			}

			setPhotoBase64(photoStr);
		})();
	}, [path, inView]);

	const handleDeleteBtn = async () => {
		await window.ipcRenderer.deletePhoto(albumId, path);
		window.location.reload();
	};

	return (
		<Link
			to={window.location.href}
			ref={ref}
			key={path}
			className="max-w-50 max-h-50 relative"
		>
			<h3 className="truncate">{fileName}</h3>
			<img src={photoBase64} className="size-full object-cover" />
			<p>
				{rating ?? 0}/{maxRating}
			</p>
			<button
				className="absolute top-0 right-0 w-10 h-10 cursor-pointer hover:scale-105 transition-transform"
				onClick={handleDeleteBtn}
			>
				<img src={trashIcon} alt="trash icon" />
			</button>
		</Link>
	);
}
