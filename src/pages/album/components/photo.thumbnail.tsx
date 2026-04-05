import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

export default function PhotoThumbnail({
	path,
	rating,
	fileName,
	// albumId,
	maxRating,
}: {
	path: string;
	rating: number | null;
	fileName: string;
	// albumId: string;
	maxRating: number;
}) {
	const { ref, inView } = useInView();
	const [photoBase64, setPhotoBase64] = useState("");

	console.log("path", path);
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

	return (
		<Link to={"/"} ref={ref} key={path} className="max-w-50 max-h-50">
			<h3 className="truncate">{fileName}</h3>
			<img src={photoBase64} className="size-full object-cover" />
			<p>
				{rating ?? 0}/{maxRating}
			</p>
		</Link>
	);
}
