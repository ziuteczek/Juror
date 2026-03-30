export default async function openAlbumDirectory(albumPath: string) {
	return window.ipcRenderer.openAlbumDirectory(albumPath);
}
