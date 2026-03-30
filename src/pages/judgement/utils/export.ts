import { photoData } from "../types";

export default async function exportAlbumData(albumData: photoData[]) {
	return window.ipcRenderer.exportAlbumData(albumData);
}
