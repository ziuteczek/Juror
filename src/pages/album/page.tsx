import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import leftArrow from "../../assets/left.arrow.icon.svg";
import PhotoThumbnail from "./components/photo.thumbnail";
import trashIcon from "../../assets/trash.icon.svg";
import resetIcon from "../../assets/reset.icon.svg";
import directoryIcon from "../../assets/directory.icon.svg";
import exportIcon from "../../assets/export.icon.svg";
import {
	handleDeleteBtn,
	handleExportBtn,
	handleResetBtn,
} from "./utils/btn.handlers";

/**
 * Displays photos from an album specified in the URL search params ("album" query key).
 *
 * Provides functionality to start judging, manage photos, and reset/delete album photos.
 */
export default function Album() {
	const [searchParams] = useSearchParams();
	const albumId = searchParams.get("album");
	const navigate = useNavigate();

	const [photos, setPhotos] = useState<photo[]>([]);
	const [albumData, setAlbumData] = useState<albumData>({
		id: "",
		createdAt: new Date(0),
		maxRating: 0,
		name: "",
	});

	//Initial album load
	useEffect(() => {
		if (!albumId) {
			return;
		}

		(async () => {
			const data = await window.ipcRenderer.getAlbum(albumId);

			setPhotos(data.photos);

			const { photos: _, ...albumData } = data;
			setAlbumData(albumData);
		})();
	}, [albumId]);

	if (!albumId) {
		navigate("/");
		return <></>;
	}

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
					to={`/judgement?album=${albumId}`}
					className="flex items-center justify-center w-50 h-50 bg-green-600 mt-6"
				>
					<span className="text-4xl uppercase text-white">start</span>
				</Link>
				{/*Select photos*/}
				<button
					onClick={async () => {
						const imagesPaths =
							await window.ipcRenderer.selectImagesDialog();
						await window.ipcRenderer.insertImages(
							albumId,
							imagesPaths,
						);
						window.location.reload();
					}}
					className="flex items-center justify-center w-50 h-50 bg-yellow-600 mt-6 flex-col cursor-pointer"
				>
					<img src={directoryIcon} alt="open directory icon" />
				</button>
				{/* reset data button */}
				<button
					onClick={() => handleResetBtn(albumId)}
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
					onClick={() => handleDeleteBtn(albumId, navigate)}
					className="flex justify-center items-center h-50 w-50 size-full bg-red-500 mt-6 cursor-pointer"
				>
					<img
						src={trashIcon}
						alt="delete icon"
						className="max-w-20 max-h-20 size-full"
					/>
				</button>

				<button
					onClick={() => handleExportBtn(photos)}
					className="flex justify-center items-center h-50 w-50 size-full bg-amber-400 mt-6 cursor-pointer flex-col"
				>
					<img
						src={exportIcon}
						alt="delete icon"
						className="max-w-20 max-h-20 size-full"
					/>
					<span>export</span>
				</button>

				{photos.map(({ filePath, rating, fileName }) => (
					<PhotoThumbnail
						path={filePath}
						maxRating={albumData?.maxRating}
						fileName={fileName}
						// albumId={albumId}
						rating={rating}
					/>
				))}
			</div>
		</>
	);
}
