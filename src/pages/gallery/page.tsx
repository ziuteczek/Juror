import { useEffect, useState } from "react";
import AlbumThumbnail from "./components/album.thumbnail";
import CreateAlbumBtn from "./components/create.album.btn";
import MergeAlbumRatingsBtn from "./components/merge.album.ratings.btn";
import PageHeader from "../../components/page.header";
import EmptyState from "../../components/empty.state";
import { AlbumsIcon } from "../../components/icons";
import { parseDbDate } from "../../lib/format";

/**
 * Displays albums thumbnails (newest first) and allows creating new ones.
 * @see AlbumThumbnail
 */
export default function Gallery() {
	const [albums, setAlbums] = useState<albumData[] | null>(null);

	useEffect(() => {
		window.ipcRenderer.getAlbumsData().then(setAlbums);
	}, []);

	const sortedAlbums = (albums ?? []).toSorted(
		(a, b) =>
			parseDbDate(b.createdAt).getTime() -
			parseDbDate(a.createdAt).getTime(),
	);

	return (
		<div className="min-h-svh">
			<PageHeader
				title="Juror"
				subtitle={
					albums
						? `${albums.length} ${albums.length === 1 ? "album" : "albums"}`
						: "Albums"
				}
				actions={
					<>
						<MergeAlbumRatingsBtn />
						<CreateAlbumBtn />
					</>
				}
			/>

			<main className="mx-auto max-w-7xl px-6 py-8">
				{albums && albums.length === 0 && (
					<EmptyState
						icon={<AlbumsIcon className="size-5" />}
						title="No albums yet"
						description="Create an album, add your photos and start rating them one by one."
					>
						<CreateAlbumBtn />
					</EmptyState>
				)}

				{sortedAlbums.length > 0 && (
					<div className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-x-6 gap-y-8">
						{sortedAlbums.map((album) => (
							<AlbumThumbnail key={album.id} album={album} />
						))}
					</div>
				)}
			</main>
		</div>
	);
}
