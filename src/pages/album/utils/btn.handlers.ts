import { NavigateFunction } from "react-router-dom";

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
