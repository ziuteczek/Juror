import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import getAlbumData from "../judgement/untils/get.album.data";
import { albumData } from "../judgement/types";
import leftArrow from "../../assets/left.arrow.icon.svg";
import PhotoThumbnail from "./components/photo.thumbnail";
import resetIcon from "../../assets/reset.icon.svg";
import resetAlbumData from "./utils/reset";

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

	const handleResetBtn = () => {
		const confirm = window.confirm(
			"Do you want to erase all of your data, regarding this album? (photos won't be deleted)",
		);

		if (!confirm) {
			return;
		}

		resetAlbumData(albumPath);
		navigate("/");
	};

	return (
		<>
			<Link to="/" className="pl-3 block">
				<img
					src={leftArrow}
					alt="go back arrow"
					className="max-h-15 max-w-15 size-full"
				/>
			</Link>

			<div className="flex gap-5 p-3 pt-1 flex-wrap">
				<Link
					to={`/judgement?album=${albumPath}`}
					className="flex items-center justify-center w-50 h-50 bg-green-600 mt-6"
				>
					<span className="text-4xl uppercase text-white">start</span>
				</Link>
				<button
					onClick={handleResetBtn}
					className="flex items-center justify-center w-50 h-50 bg-gray-400 mt-6 flex-col cursor-pointer"
				>
					<img
						src={resetIcon}
						alt="reset quiz icon"
						className="max-w-25 max-h-25 size-full"
					/>
					reset
				</button>
				{albumData.map(({ title, path, rating }) => (
					<PhotoThumbnail
						name={title}
						path={path}
						rootPath={albumPath}
						rating={rating}
					/>
				))}
			</div>
		</>
	);
}
