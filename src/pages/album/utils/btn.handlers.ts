import { NavigateFunction } from "react-router-dom";

/**
 * Resets all of the ratings from the album with given id. Asks for confirmation before doing so. After resetting, page is reloaded to show changes.
 */
export const handleResetBtn = async (albumId: string) => {
	const confirm = window.confirm(
		"Do you want to reset all of your ratings from this album?",
	);

	if (!confirm) {
		return;
	}

	await window.ipcRenderer.resetAlbumPhotosRating(albumId);
	window.location.reload();
};

/**
 * Deletes album with given id. Asks for confirmation before doing so. After deleting, user is navigated to root directory (/).
 */
export const handleDeleteBtn = async (
	albumId: string,
	navigate: NavigateFunction,
) => {
	const confirm = window.confirm(
		"Do you want to erase all of you data, regarding this album? (photos won't be deleted!)",
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
export const handleExportBtn = async (photos: photo[]) => {
	const everyPhotoRated = photos.every((photo) => !!photo.rating);

	if (!everyPhotoRated) {
		const confirm = window.confirm(
			"You didn't rate all of your photos. Do you want to export anyway?",
		);
		if (!confirm) {
			return;
		}
	}
	await window.ipcRenderer.exportAlbumRatings(photos);
};
