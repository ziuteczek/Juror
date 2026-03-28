import { Link } from "react-router-dom";
import noPhotoThumbnail from "../../../assets/no.photos.thumbnail.png";
export default function AlbumThumbnail({
	name,
	thumbnail,
	path,
}: {
	name: string;
	thumbnail: string;
	path: string;
}) {
	const albumPath = `/album?album=${path}`;

	return (
		<Link to={albumPath}>
			<div key={name} className="flex flex-col w-50">
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
