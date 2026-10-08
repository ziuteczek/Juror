import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { ImageIcon } from "../../../components/icons";
import { formatDate } from "../../../lib/format";

/**
 * Album card with a cover photo (first photo of the album), name, rating scale and creation date.
 * If album doesn't contain any photos, a placeholder is shown.
 *
 * Cover is loaded only once the card enters the viewport.
 *
 * It's a link that leads to album page.
 *
 * @see Album
 */
export default function AlbumThumbnail({ album }: { album: albumData }) {
	const { id, name, maxRating, createdAt } = album;
	const [thumbnail, setThumbnail] = useState("");
	const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "200px" });

	useEffect(() => {
		if (!inView) return;

		window.ipcRenderer.getAlbumThumbnailBase64(id).then(setThumbnail);
	}, [id, inView]);

	const created = formatDate(createdAt);

	return (
		<Link
			to={`/album?album=${id}`}
			ref={ref}
			className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
		>
			<div className="aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-zinc-200 transition group-hover:shadow-md group-hover:ring-zinc-300">
				{thumbnail ? (
					<img
						src={thumbnail}
						alt=""
						className="size-full object-cover transition duration-300 group-hover:scale-[1.03]"
					/>
				) : (
					<div className="grid size-full place-items-center text-zinc-300">
						<ImageIcon className="size-8" />
					</div>
				)}
			</div>
			<div className="mt-3 px-0.5">
				<p className="truncate font-medium" title={name}>
					{name}
				</p>
				<p className="truncate text-sm text-zinc-500">
					Scale 1–{maxRating}
					{created && ` · ${created}`}
				</p>
			</div>
		</Link>
	);
}
