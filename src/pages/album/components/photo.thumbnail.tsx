import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ImageIcon, TrashIcon } from "../../../components/icons";

/**
 * @returns Photo card that displays photo, its name and rating. Clicking the photo opens it for rating; a separate button removes it from the album (the file itself is kept). Photo is loaded only when it's near the viewport.
 */
export default function PhotoThumbnail({
	path,
	rating,
	fileName,
	maxRating,
	onSelect,
	onRemove,
}: {
	path: string;
	rating: number | null;
	fileName: string;
	maxRating: number;
	/** Opens the photo to change its rating */
	onSelect: () => void;
	onRemove: () => void;
}) {
	const { ref, inView } = useInView({ rootMargin: "300px" });
	const [photoBase64, setPhotoBase64] = useState("");

	useEffect(() => {
		if (!inView) {
			setPhotoBase64("");
			return;
		}

		let cancelled = false;

		window.ipcRenderer.photoToBase64(path).then((photoStr) => {
			if (cancelled) return;

			if (!photoStr) {
				console.error(`Photo with path "${path}" not found`);
				return;
			}

			setPhotoBase64(photoStr);
		});

		return () => {
			cancelled = true;
		};
	}, [path, inView]);

	const rated = rating !== null;

	return (
		<div ref={ref} className="group">
			<div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100 ring-1 ring-zinc-200 transition group-hover:ring-zinc-300 group-hover:shadow-md">
				<button
					type="button"
					onClick={onSelect}
					title="Change rating"
					aria-label={`Change rating of ${fileName}`}
					className="block size-full cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
				>
					{photoBase64 ? (
						<img
							src={photoBase64}
							alt={fileName}
							className="size-full object-cover"
						/>
					) : (
						<div className="grid size-full place-items-center text-zinc-300">
							<ImageIcon className="size-6" />
						</div>
					)}
				</button>

				<span
					className={`pointer-events-none absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums shadow-sm ${
						rated
							? "bg-white/95 text-zinc-900"
							: "bg-zinc-900/55 text-white backdrop-blur-sm"
					}`}
				>
					{rated ? `${rating} / ${maxRating}` : "Unrated"}
				</span>

				<button
					type="button"
					onClick={onRemove}
					title="Remove from album"
					aria-label={`Remove ${fileName} from album`}
					className="absolute right-2 top-2 cursor-pointer rounded-md bg-white/95 p-1.5 text-zinc-600 opacity-0 shadow-sm transition hover:text-red-600 focus-visible:opacity-100 group-hover:opacity-100"
				>
					<TrashIcon />
				</button>
			</div>
			<p className="mt-2 truncate text-sm text-zinc-600" title={fileName}>
				{fileName}
			</p>
		</div>
	);
}
