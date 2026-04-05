import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

export default function PhotoThumbnail({
	path,
	rating,
	// albumId,
	maxRating,
}: {
	path: string;
	rating: number | null;
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
		<Link to={"/"} ref={ref} key={path}>
			<h3>{path}</h3>
			<img
				src={photoBase64}
				className="max-w-50 max-h-50 size-full object-cover"
			/>
			<p>
				{rating ?? 0}/{maxRating}
			</p>
		</Link>
	);
}
