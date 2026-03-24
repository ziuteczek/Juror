import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import getAlbumData from "../judgement/untils/get.album.data";
import { albumData } from "../judgement/types";

import PhotoThumbnail from "./components/photo.thumbnail";

export default function Album() {
	const [searchParams] = useSearchParams();
	const albumPath = searchParams.get("album");
	const navigate = useNavigate();

	const [albumData, setAlbumData] = useState<albumData[]>([]);

	//Initial album load
	useEffect(() => {
		if (!albumPath) {
			return;
		}

		(async () => {
			const data = await getAlbumData(albumPath);
			setAlbumData(data);
		})();
	}, [albumPath]);

	if (!albumPath) {
		navigate("/");
		return <></>;
	}

	return (
		<div className="flex gap-5 p-3">
			<Link
				to={`/judgement?album=${albumPath}`}
				className="flex items-center justify-center w-50 h-50 bg-green-600 mt-6"
			>
				<span className="text-4xl uppercase text-white">start</span>
			</Link>
			{albumData.map(({ title, path, rating }) => (
				<PhotoThumbnail
					name={title}
					path={path}
					rootPath={albumPath}
					rating={rating}
				/>
			))}
		</div>
	);
}
