import { useEffect, useState } from "react";
import getOfflineGalleryData from "./utils/get.offline.gallery.data";
import { devMode } from "../../env";
import AlbumThumbnail from "./components/album.thumbnail";
import plusIcon from "../../assets/plus.icon.svg";
import CreateAlbumModal from "./components/create.album.modal";

type GalleryOflineData = Awaited<ReturnType<typeof getOfflineGalleryData>>;

export default function Gallery() {
	const [galleries, setGalleries] = useState<GalleryOflineData>([]);
	const [createAlbumVisible, setCreateAlbumVisible] = useState(false);

	useEffect(() => {
		(async () => {
			const galleriesData = await getOfflineGalleryData();
			if (devMode) {
				console.log(galleriesData);
			}
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
				{galleries.map(({ name, thumbnail, path }) => (
					<AlbumThumbnail
						name={name}
						thumbnail={thumbnail}
						path={path}
						key={name}
					/>
				))}
			</div>
			<CreateAlbumModal
				isVisible={createAlbumVisible}
				setIsVisible={setCreateAlbumVisible}
			/>
		</>
	);
}
