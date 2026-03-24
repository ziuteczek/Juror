export default async function resetAlbumData(albumPath: string) {
	return window.ipcRenderer.resetAlbumData(albumPath);
}
