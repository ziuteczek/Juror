import { Link } from "react-router-dom";

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
					src={thumbnail}
					className="h-50 w-50 object-cover object-center"
					alt=""
				/>
			</div>
		</Link>
	);
}
