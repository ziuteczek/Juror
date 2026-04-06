import { useEffect, useState } from "react";
import AlbumThumbnail from "./components/album.thumbnail";
import plusIcon from "../../assets/plus.icon.svg";
import CreateAlbumModal from "./components/create.album.modal";

/**
 * Displays albums and allows creating new ones.
 */
export default function Gallery() {
	const [galleries, setGalleries] = useState<albumData[]>([]);
	const [createAlbumVisible, setCreateAlbumVisible] = useState(false);

	useEffect(() => {
		(async () => {
			const galleriesData = await window.ipcRenderer.getAlbumsData();
			setGalleries(galleriesData);
		})();
	}, []);

	return (
		<>
			<div className="flex p-3 gap-3 flex-wrap">
				<button
					onClick={() => setCreateAlbumVisible(true)}
					className="max-h-50 max-w-50 font-bold text-xl cursor-pointer text-left"
				>
					New album
					<img
						src={plusIcon}
						alt="plus svg"
						className="bg-green-400 size-full"
					/>
				</button>
				{galleries.toSorted().map(({ id, name }) => (
					<AlbumThumbnail key={id} id={id} name={name} />
				))}
			</div>
			<CreateAlbumModal
				isVisible={createAlbumVisible}
				setIsVisible={setCreateAlbumVisible}
			/>
		</>
	);
}
