import { ipcRenderer, contextBridge } from "electron";
import { albumData } from "../src/feature/judgement/types";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
	on(...args: Parameters<typeof ipcRenderer.on>) {
		const [channel, listener] = args;
		return ipcRenderer.on(channel, (event, ...args) =>
			listener(event, ...args),
		);
	},
	off(...args: Parameters<typeof ipcRenderer.off>) {
		const [channel, ...omit] = args;
		return ipcRenderer.off(channel, ...omit);
	},
	send(...args: Parameters<typeof ipcRenderer.send>) {
		const [channel, ...omit] = args;
		return ipcRenderer.send(channel, ...omit);
	},
	invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
		const [channel, ...omit] = args;
		return ipcRenderer.invoke(channel, ...omit);
	},
	getOfflineGalleryData() {
		return ipcRenderer.invoke("get-offline-gallery-data");
	},
	getOfflineAlbumPhotosList(albumPath: string) {
		return ipcRenderer.invoke("get-offline-album-photos-list", albumPath);
	},
	getAlbumData(albumPath: string) {
		return ipcRenderer.invoke("get-album-data", albumPath);
	},
	photoToBase64(photoPath: string) {
		return ipcRenderer.invoke("photo-to-base-64", photoPath);
	},
	saveAlbumData(albumPath: string, albumData: albumData[]) {
		return ipcRenderer.invoke("save-album-data", albumPath, albumData);
	},
	resetAlbumData(albumPath: string) {
		return ipcRenderer.invoke("reset-album-data", albumPath);
	},
	exportAlbumData(albumData: albumData[]) {
		return ipcRenderer.invoke("export-album-data", albumData);
	},
	createAlbum(albumName: string) {
		return ipcRenderer.invoke("create-album", albumName);
	},
	openAlbumDirectory(albumPath: string) {
		return ipcRenderer.invoke("open-album-directory", albumPath);
	},
});
