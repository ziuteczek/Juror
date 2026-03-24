import { useEffect, useState } from "react";
import getOfflineGalleryData from "./utils/get.offline.gallery.data";
import { devMode } from "../../env";
import AlbumThumbnail from "./components/album.thumbnail";

type GalleryOflineData = Awaited<ReturnType<typeof getOfflineGalleryData>>;

export default function Gallery() {
	const [galleries, setGalleries] = useState<GalleryOflineData>([]);

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
		<div className="flex p-3 gap-3">
			{galleries.map(({ name, thumbnail, path }) => (
				<AlbumThumbnail name={name} thumbnail={thumbnail} path={path} />
			))}
		</div>
	);
}
