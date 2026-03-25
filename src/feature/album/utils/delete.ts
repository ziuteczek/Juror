export default async function deleteAlbum(albumPath: string) {
	return window.ipcRenderer.deleteAlbum(albumPath);
}
