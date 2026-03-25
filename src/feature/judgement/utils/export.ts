import { albumData } from "../types";

export default async function exportAlbumData(albumData: albumData[]) {
	return window.ipcRenderer.exportAlbumData(albumData);
}
