import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import photoToBase64 from "../../judgement/untils/photo.to.base64";
import { Link } from "react-router-dom";

export default function PhotoThumbnail({
	name,
	path,
	rating,
	rootPath,
}: {
	name: string;
	path: string;
	rating: number | null;
	rootPath: string;
}) {
	const { ref, inView } = useInView();
	const [photoBase64, setPhotoBase64] = useState("");

	useEffect(() => {
		(async () => {
			if (!inView) {
				setPhotoBase64("");
			}

			const photoStr = await photoToBase64(path);

			if (!photoStr) {
				console.error(`Photo with path "${path}" not found`);
				return;
			}

			setPhotoBase64(photoStr);
		})();
	}, [path, inView]);

	console.log(rootPath);

	return (
		<Link to={"/"} ref={ref}>
			<h3>{name}</h3>
			<img src={photoBase64} className="w-50 h-50 object-cover" />
			<p>{rating}</p>
		</Link>
	);
}
