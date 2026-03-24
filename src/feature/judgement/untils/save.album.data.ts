import { albumData } from "../types";

export default async function saveAlbumData(
	albumPath: string,
	albumData: albumData[],
) {
	return window.ipcRenderer.saveAlbumData(albumPath, albumData);
}
