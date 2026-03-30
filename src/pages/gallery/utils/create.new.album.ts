export default function createteNewAlbum(albumName: string) {
	return window.ipcRenderer.createAlbum(albumName);
}
