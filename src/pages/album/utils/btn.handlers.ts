import { NavigateFunction } from "react-router-dom";

/**
 * Resets all of the ratings from the album with given id. Asks for confirmation before doing so.
 * @returns whether ratings were reset (caller should reload album data)
 */
export const handleResetBtn = async (albumId: string) => {
	const confirm = window.confirm(
		"Reset all ratings in this album? This can't be undone.",
	);

	if (!confirm) {
		return false;
	}

	return await window.ipcRenderer.resetAlbumPhotosRating(albumId);
};

/**
 * Deletes album with given id. Asks for confirmation before doing so. After deleting, user is navigated to root directory (/).
 */
export const handleDeleteBtn = async (
	albumId: string,
	navigate: NavigateFunction,
) => {
	const confirm = window.confirm(
		"Delete this album and all of its ratings? Your photo files won't be deleted.",
	);

	if (!confirm) {
		return;
	}

	await window.ipcRenderer.deleteAlbum(albumId);
	navigate("/");
};

/**
 * Exports the ratings of the given photos. If not all photos are rated, asks for confirmation before exporting.
 * @param photos Array of photos to export ratings for.
 */
export const handleExportBtn = async (albumName: string, photos: photo[]) => {
	const everyPhotoRated = photos.every((photo) => !!photo.rating);

	if (!everyPhotoRated) {
		const confirm = window.confirm(
			"Not all photos are rated yet. Export anyway?",
		);
		if (!confirm) {
			return;
		}
	}
	await window.ipcRenderer.exportAlbumRatings(albumName, photos);
};
