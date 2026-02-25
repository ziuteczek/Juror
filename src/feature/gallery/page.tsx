import { useEffect, useState } from "react";
import getOfflineGalleryData from "./utils/get.offline.gallery.data";

type GalleryOflineData = Awaited<ReturnType<typeof getOfflineGalleryData>>;

export default function Gallery() {
	const [galleries, setGalleries] = useState<GalleryOflineData>([]);

	useEffect(() => {
		(async () => {
			const galleriesData = await getOfflineGalleryData();
			console.log(galleriesData);
			setGalleries(galleriesData);
		})();
	}, []);

	return (
		<>
			{galleries.map((gallery) => (
				<div key={gallery.name}>
					<p>{gallery.name}</p>
					<img src={gallery.thumbnail} alt="" />
				</div>
			))}
		</>
	);
}
