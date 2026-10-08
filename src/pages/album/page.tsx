import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import PhotoThumbnail from "./components/photo.thumbnail";
import PhotoRatingModal from "./components/photo.rating.modal";
import {
	handleDeleteBtn,
	handleExportBtn,
	handleResetBtn,
} from "./utils/btn.handlers";
import PageHeader from "../../components/page.header";
import Button from "../../components/button";
import { buttonClass } from "../../components/button.styles";
import EmptyState from "../../components/empty.state";
import ProgressBar from "../../components/progress.bar";
import {
	ArrowLeftIcon,
	DownloadIcon,
	FolderPlusIcon,
	ImageIcon,
	ImagePlusIcon,
	PlayIcon,
	ResetIcon,
	TrashIcon,
} from "../../components/icons";

/**
 * Displays photos from an album specified in the URL search params ("album" query key).
 *
 * Provides functionality to start judging, manage photos, and reset/delete album photos.
 */
export default function Album() {
	const [searchParams] = useSearchParams();
	const albumId = searchParams.get("album");
	const navigate = useNavigate();

	const [album, setAlbum] = useState<album | null>(null);
	const [status, setStatus] = useState<"loading" | "ready" | "missing">(
		"loading",
	);
	const [busy, setBusy] = useState(false);
	/** File path of the photo opened for rating */
	const [selectedPath, setSelectedPath] = useState<string | null>(null);

	const loadAlbum = useCallback(async () => {
		if (!albumId) return;

		const data = await window.ipcRenderer.getAlbum(albumId);

		if (!data?.id) {
			setStatus("missing");
			return;
		}

		setAlbum(data);
		setStatus("ready");
	}, [albumId]);

	useEffect(() => {
		loadAlbum();
	}, [loadAlbum]);

	if (!albumId) {
		return <Navigate to="/" replace />;
	}

	const backLink = (
		<Link
			to="/"
			aria-label="Back to albums"
			title="Back to albums"
			className={buttonClass("ghost", "icon", "-ml-2")}
		>
			<ArrowLeftIcon className="size-5" />
		</Link>
	);

	if (status === "missing") {
		return (
			<div className="min-h-svh">
				<PageHeader leading={backLink} title="Album not found" />
				<main className="mx-auto max-w-7xl px-6 py-8">
					<EmptyState
						icon={<ImageIcon className="size-5" />}
						title="This album doesn't exist"
						description="It may have been deleted."
					>
						<Link to="/" className={buttonClass("primary")}>
							Back to albums
						</Link>
					</EmptyState>
				</main>
			</div>
		);
	}

	const photos = album?.photos ?? [];
	const ratedCount = photos.filter((photo) => photo.rating !== null).length;
	const hasPhotos = photos.length > 0;

	const addPhotos = async (paths: string[]) => {
		if (!paths.length) return;

		setBusy(true);
		try {
			await window.ipcRenderer.insertImages(albumId, paths);
			await loadAlbum();
		} finally {
			setBusy(false);
		}
	};

	const addImages = async () =>
		addPhotos(await window.ipcRenderer.selectImagesDialog());

	const addDirectories = async () =>
		addPhotos(await window.ipcRenderer.selectDirectoriesDialog());

	const removePhoto = async (filePath: string) => {
		const success = await window.ipcRenderer.deletePhoto(albumId, filePath);
		if (!success) return;

		setAlbum((prev) =>
			prev && {
				...prev,
				photos: prev.photos.filter((photo) => photo.filePath !== filePath),
			},
		);
	};

	/** Updates rating right away and saves it; reverts if saving fails */
	const ratePhoto = async (filePath: string, rating: number | null) => {
		const target = photos.find((photo) => photo.filePath === filePath);
		if (!target || target.rating === rating) return;

		const setRating = (value: number | null) =>
			setAlbum((prev) =>
				prev && {
					...prev,
					photos: prev.photos.map((photo) =>
						photo.filePath === filePath
							? { ...photo, rating: value }
							: photo,
					),
				},
			);

		setRating(rating);

		const success = await window.ipcRenderer.updatePhotosRating(albumId, [
			{ ...target, rating },
		]);

		if (!success) {
			setRating(target.rating);
			alert("Couldn't save the rating.");
		}
	};

	const selectedIndex = photos.findIndex(
		(photo) => photo.filePath === selectedPath,
	);
	const selectedPhoto = photos[selectedIndex];

	const startLabel =
		ratedCount === 0
			? "Start rating"
			: ratedCount === photos.length
				? "Review ratings"
				: "Continue rating";

	const addButtons = (
		<>
			<Button onClick={addImages} disabled={busy}>
				<ImagePlusIcon />
				Add photos
			</Button>
			<Button onClick={addDirectories} disabled={busy}>
				<FolderPlusIcon />
				Add folder
			</Button>
		</>
	);

	return (
		<div className="min-h-svh">
			<PageHeader
				leading={backLink}
				title={album?.name ?? ""}
				subtitle={
					album &&
					`${photos.length} ${photos.length === 1 ? "photo" : "photos"} · Scale 1–${album.maxRating}`
				}
				actions={
					<>
						{addButtons}
						<Button
							onClick={() =>
								album && handleExportBtn(album.name, photos)
							}
							disabled={!hasPhotos}
						>
							<DownloadIcon />
							Export
						</Button>

						<div className="mx-1 h-6 w-px bg-zinc-200" />

						<Button
							variant="ghost"
							size="icon"
							title="Reset all ratings"
							aria-label="Reset all ratings"
							disabled={ratedCount === 0}
							onClick={async () => {
								if (await handleResetBtn(albumId)) {
									await loadAlbum();
								}
							}}
						>
							<ResetIcon />
						</Button>
						<Button
							variant="danger"
							size="icon"
							title="Delete album"
							aria-label="Delete album"
							onClick={() => handleDeleteBtn(albumId, navigate)}
						>
							<TrashIcon />
						</Button>

						{hasPhotos ? (
							<Link
								to={`/judgement?album=${albumId}`}
								className={buttonClass("primary", "md", "ml-1")}
							>
								<PlayIcon className="size-3.5 fill-current" />
								{startLabel}
							</Link>
						) : (
							<Button variant="primary" disabled className="ml-1">
								<PlayIcon className="size-3.5 fill-current" />
								Start rating
							</Button>
						)}
					</>
				}
			/>

			<main className="mx-auto max-w-7xl px-6 py-8">
				{status === "ready" && !hasPhotos && (
					<EmptyState
						icon={<ImagePlusIcon className="size-5" />}
						title="No photos yet"
						description="Add individual photos or a whole folder (PNG and JPG) to start rating."
					>
						{addButtons}
					</EmptyState>
				)}

				{hasPhotos && album && (
					<>
						<div className="mb-6 flex items-center gap-4">
							<ProgressBar
								value={ratedCount}
								max={photos.length}
								className="flex-1"
							/>
							<p className="shrink-0 text-sm tabular-nums text-zinc-500">
								<span className="font-medium text-zinc-900">
									{ratedCount}
								</span>{" "}
								of {photos.length} rated
							</p>
						</div>

						<div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-x-4 gap-y-6">
							{photos.map(({ filePath, rating, fileName }) => (
								<PhotoThumbnail
									key={filePath}
									path={filePath}
									maxRating={album.maxRating}
									fileName={fileName}
									rating={rating}
									onSelect={() => setSelectedPath(filePath)}
									onRemove={() => removePhoto(filePath)}
								/>
							))}
						</div>
					</>
				)}

				{selectedPhoto && album && (
					<PhotoRatingModal
						photo={selectedPhoto}
						index={selectedIndex}
						count={photos.length}
						maxRating={album.maxRating}
						onRate={(rating) =>
							ratePhoto(selectedPhoto.filePath, rating)
						}
						onPrev={() =>
							setSelectedPath(photos[selectedIndex - 1].filePath)
						}
						onNext={() =>
							setSelectedPath(photos[selectedIndex + 1].filePath)
						}
						onClose={() => setSelectedPath(null)}
					/>
				)}

				{busy && (
					<p className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900 px-4 py-2 text-sm text-white shadow-lg">
						Adding photos…
					</p>
				)}
			</main>
		</div>
	);
}
