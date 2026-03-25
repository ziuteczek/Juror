export default async function getAlbumData(albumPath: string) {
	return window.ipcRenderer.getAlbumData(albumPath);
}
