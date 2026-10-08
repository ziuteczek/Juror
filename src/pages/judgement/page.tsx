import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";

import FinishModal from "./components/finish.modal";
import JudgementImage from "./components/image";
import ChangePhotos from "./components/change.photos";
import ExitJudgement from "./components/exit";
import { currPhotoData } from "./types";
import { getArrangedPhotos } from "./utils";
import SelectRating from "./components/select.rating";
import ProgressBar from "../../components/progress.bar";
import EmptyState from "../../components/empty.state";
import { ImageIcon } from "../../components/icons";
import { buttonClass } from "../../components/button.styles";

/**
 * It's judging album given in search params under the key "album".
 */
export default function Judgement() {
	const [photos, setPhotos] = useState<photo[]>([]);
	const [albumName, setAlbumName] = useState("");
	const [maxRating, setMaxRating] = useState(0);
	const [loaded, setLoaded] = useState(false);
	const [searchParams] = useSearchParams();
	const albumId = searchParams.get("album");

	const [currPhoto, setCurrPhoto] = useState<currPhotoData>({
		index: -1,
		photoBase64: "",
	});

	//Initial album load
	useEffect(() => {
		if (!albumId) {
			return;
		}

		(async () => {
			const data = await window.ipcRenderer.getAlbum(albumId);
			setPhotos(getArrangedPhotos(data?.photos ?? []));
			setMaxRating(data?.maxRating ?? 0);
			setAlbumName(data?.name ?? "");
			setLoaded(true);
		})();
	}, [albumId]);

	// If photo is not chosen, it starts from the first unrated one (or the first photo if all are rated)
	useEffect(() => {
		if (currPhoto.index !== -1 || !photos.length) {
			return;
		}

		const firstUnratedPhotoIndex = photos.findIndex(
			(photo) => photo.rating === null,
		);

		setCurrPhoto({
			index: Math.max(firstUnratedPhotoIndex, 0),
			photoBase64: "",
		});
	}, [photos, currPhoto.index]);

	if (!albumId) {
		return <Navigate to="/" replace />;
	}

	if (loaded && !photos.length) {
		return (
			<main className="mx-auto max-w-3xl px-6 py-16">
				<EmptyState
					icon={<ImageIcon className="size-5" />}
					title="Nothing to rate"
					description="This album doesn't have any photos yet."
				>
					<Link
						to={`/album?album=${albumId}`}
						className={buttonClass("primary")}
					>
						Back to album
					</Link>
				</EmptyState>
			</main>
		);
	}

	const photo = photos[currPhoto.index];

	if (!photo) {
		return (
			<div className="grid h-svh place-items-center text-sm text-zinc-500">
				Loading…
			</div>
		);
	}

	const ratedCount = photos.filter((photo) => photo.rating !== null).length;

	return (
		<div className="flex h-svh bg-zinc-100">
			<main className="flex min-w-0 flex-1 flex-col">
				<div className="min-h-0 flex-1 p-6">
					<JudgementImage
						setCurrPhoto={setCurrPhoto}
						currPhoto={currPhoto}
						photos={photos}
					/>
				</div>
				<p
					className="truncate px-6 pb-4 text-center text-sm text-zinc-500"
					title={photo.filePath}
				>
					{photo.fileName}
				</p>
			</main>

			<aside className="flex w-80 shrink-0 flex-col border-l border-zinc-200 bg-white">
				<div className="border-b border-zinc-200 p-5">
					<ExitJudgement albumId={albumId} photos={photos} />
					<h1
						className="mt-3 truncate text-lg font-semibold tracking-tight"
						title={albumName}
					>
						{albumName}
					</h1>
					<div className="mt-3 flex items-baseline justify-between text-sm">
						<span className="text-zinc-500">
							Photo{" "}
							<span className="font-medium tabular-nums text-zinc-900">
								{currPhoto.index + 1}
							</span>{" "}
							of {photos.length}
						</span>
						<span className="tabular-nums text-zinc-500">
							{ratedCount} rated
						</span>
					</div>
					<ProgressBar
						value={ratedCount}
						max={photos.length}
						className="mt-2"
					/>
				</div>

				<div className="flex-1 overflow-y-auto p-5">
					<SelectRating
						photos={photos}
						setPhoto={setPhotos}
						currPhoto={currPhoto}
						maxRating={maxRating}
					/>
				</div>

				<div className="border-t border-zinc-200 p-5">
					<ChangePhotos
						photos={photos}
						currPhoto={currPhoto}
						setCurrPhoto={setCurrPhoto}
					/>
					<KeyboardHints maxRating={maxRating} />
				</div>
			</aside>

			<FinishModal photos={photos} albumId={albumId} albumName={albumName} />
		</div>
	);
}

function Kbd({ children }: { children: string }) {
	return (
		<kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-zinc-200 bg-zinc-50 px-1 font-sans text-[11px] font-medium text-zinc-600">
			{children}
		</kbd>
	);
}

function KeyboardHints({ maxRating }: { maxRating: number }) {
	const lastKey = maxRating >= 10 ? "0" : String(maxRating);

	return (
		<dl className="mt-4 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5 text-xs text-zinc-500">
			<dt className="flex gap-1">
				<Kbd>1</Kbd>–<Kbd>{lastKey}</Kbd>
			</dt>
			<dd>Rate{maxRating >= 10 && " (0 = 10)"}</dd>
			<dt className="flex gap-1">
				<Kbd>←</Kbd>
				<Kbd>→</Kbd>
			</dt>
			<dd>Previous / next photo</dd>
			<dt className="flex gap-1">
				<Kbd>Enter</Kbd>
			</dt>
			<dd>Next photo</dd>
			<dt className="flex gap-1">
				<Kbd>Backspace</Kbd>
			</dt>
			<dd>Clear rating</dd>
		</dl>
	);
}
