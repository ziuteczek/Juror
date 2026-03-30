import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import getAlbumData from "../judgement/utils/get.album.data";
import { photoData } from "../judgement/types";
import leftArrow from "../../assets/left.arrow.icon.svg";
import PhotoThumbnail from "./components/photo.thumbnail";
import resetAlbumData from "./utils/reset";
import deleteAlbum from "./utils/delete";
import trashIcon from "../../assets/trash.icon.svg";
import resetIcon from "../../assets/reset.icon.svg";
import directoryIcon from "../../assets/directory.icon.svg";
import openAlbumDirectory from "../gallery/utils/open.album.directory";

/**
 * Displays photos from an album specified in the URL search params ("album" query key).
 * 
 * Provides functionality to start judging, manage photos, and reset/delete album photos.
 */
export default function Album() {
	const [searchParams] = useSearchParams();
	const albumPath = searchParams.get("album");
	const navigate = useNavigate();

	const [albumData, setAlbumData] = useState<photoData[]>([]);

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

	const handleResetBtn = async () => {
		const confirm = window.confirm(
			"Do you want to erase all of your data, regarding this album? (photos won't be deleted)",
		);

		if (!confirm) {
			return;
		}

		await resetAlbumData(albumPath);
		navigate("/");
	};

	const handleDeleteBtn = async () => {
		const confirm = window.confirm(
			"Do you want to erase all of you data, regarding this album? (photos will be deleted!)",
		);

		if (!confirm) {
			return;
		}

		await deleteAlbum(albumPath);
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
				{/* Start quiz */}
				<Link
					to={`/judgement?album=${albumPath}`}
					className="flex items-center justify-center w-50 h-50 bg-green-600 mt-6"
				>
					<span className="text-4xl uppercase text-white">start</span>
				</Link>

				{/* open directory */}
				<button
					onClick={() => openAlbumDirectory(albumPath)}
					className="flex items-center justify-center w-50 h-50 bg-yellow-600 mt-6 flex-col cursor-pointer"
				>
					<img src={directoryIcon} alt="open directory icon" />
				</button>

				{/* reset data button */}
				<button
					onClick={handleResetBtn}
					className="flex items-center justify-center w-50 h-50 bg-gray-400 mt-6 flex-col cursor-pointer"
				>
					<img
						src={resetIcon}
						alt="reset album icon"
						className="max-w-25 max-h-25 size-full"
					/>
					reset
				</button>

				{/* Delete data  */}
				<button
					onClick={handleDeleteBtn}
					className="flex justify-center items-center h-50 w-50 size-full bg-red-500 mt-6 cursor-pointer"
				>
					<img
						src={trashIcon}
						alt="delete icon"
						className="max-w-20 max-h-20 size-full"
					/>
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
