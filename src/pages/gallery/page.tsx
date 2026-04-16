import { useEffect, useState } from "react";
import AlbumThumbnail from "./components/album.thumbnail";
import CreateAlbumBtn from "./components/create.album.btn";

/**
 * Displays albums thumbnails and allows creating new ones.
 * @see AlbumThumbnail
 */
export default function Gallery() {
	const [galleries, setGalleries] = useState<albumData[]>([]);

	useEffect(() => {
		(async () => {
			const galleriesData = await window.ipcRenderer.getAlbumsData();
			setGalleries(galleriesData);
		})();
	}, []);

	return (
		<div className="flex p-3 gap-3 flex-wrap">
			<CreateAlbumBtn />
			{galleries.toSorted().map(({ id, name }) => (
				<AlbumThumbnail key={id} id={id} name={name} />
			))}
		</div>
	);
}
