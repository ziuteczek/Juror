import { Link } from "react-router-dom";
import noPhotoThumbnail from "../../../assets/no.photos.thumbnail.png";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

export default function AlbumThumbnail({
	id,
	name,
}: {
	id: string;
	name: string;
}) {
	const albumUrl = `/album?album=${id}`;
	const [thumbnail, setThumbnail] = useState("");
	const { ref, inView } = useInView();

	useEffect(() => {
		if (inView) {
			window.ipcRenderer
				.getAlbumThumbnailBase64(id)
				.then((newThumbnail) => setThumbnail(newThumbnail));
		} else {
			setThumbnail("");
		}
	}, [id, inView]);

	return (
		<Link to={albumUrl} ref={ref}>
			<div className="flex flex-col w-50">
				<p className="font-bold text-xl truncate">{name}</p>
				<img
					src={thumbnail || noPhotoThumbnail}
					className="h-50 w-50 object-cover object-center border"
					alt=""
				/>
			</div>
		</Link>
	);
}
