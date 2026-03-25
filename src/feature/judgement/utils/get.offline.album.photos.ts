export default async function getOfflineAlbumPhotos(albumPath: string) {
	return window.ipcRenderer.getOfflineAlbumPhotosList(albumPath);
}
