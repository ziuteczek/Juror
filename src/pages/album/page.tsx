import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import leftArrow from "../../assets/left.arrow.icon.svg";
import PhotoThumbnail from "./components/photo.thumbnail";
import trashIcon from "../../assets/trash.icon.svg";
import resetIcon from "../../assets/reset.icon.svg";
import directoryIcon from "../../assets/directory.icon.svg";

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
			console.log("data", data);
			setPhotos(data.photos);

			const { photos, ...albumData } = data;
			setAlbumData(albumData);
		})();
	}, [albumId]);

	if (!albumId) {
		navigate("/");
		return <></>;
	}

	const handleResetBtn = async () => {
		const confirm = window.confirm(
			"Do you want to reset all of your ratings from this album?",
		);

		if (!confirm) {
			return;
		}

		await window.ipcRenderer.resetAlbumPhotosRating(albumId);
		window.location.reload();
	};

	const handleDeleteBtn = async () => {
		const confirm = window.confirm(
			"Do you want to erase all of you data, regarding this album? (photos won't be deleted!)",
		);

		if (!confirm) {
			return;
		}

		await window.ipcRenderer.deleteAlbum(albumId);
		navigate("/");
	};

	console.log(photos);

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
