import { photoData } from "../types";

export default async function saveAlbumData(
	albumPath: string,
	albumData: photoData[],
) {
	return window.ipcRenderer.saveAlbumData(albumPath, albumData);
}
