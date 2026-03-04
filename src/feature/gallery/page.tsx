import { useEffect, useState } from "react";
import getOfflineGalleryData from "./utils/get.offline.gallery.data";
import { Link } from "react-router-dom";
import { devMode } from "../../env";

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
		<>
			<Link to={"/judgement?album=/home/stasio/Pictures/juror/drupa"}>
				dupa
			</Link>
			{galleries.map((gallery) => (
				<div key={gallery.name}>
					<p>{gallery.name}</p>
					<img src={gallery.thumbnail} alt="" />
				</div>
			))}
		</>
	);
}
