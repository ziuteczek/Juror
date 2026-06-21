import { ipcRenderer, contextBridge } from "electron";

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

	// Non build in stuff :D

	async photoToBase64(photoPath: string) {
		return await ipcRenderer.invoke("photo-to-base-64", photoPath);
	},
	createAlbum(albumName: string, maxRating: number) {
		return ipcRenderer.invoke("create-album", albumName, maxRating);
	},
	deleteAlbum(albumId: string) {
		return ipcRenderer.invoke("delete-album", albumId);
	},
	deletePhoto(albumId: string, photoPath: string) {
		return ipcRenderer.invoke("delete-photo", albumId, photoPath);
	},
	getAlbumsData() {
		return ipcRenderer.invoke("get-albums-data-list");
	},
	getAlbumThumbnailBase64(albumId: string) {
		return ipcRenderer.invoke("get-album-base-64-thumbnail", albumId);
	},
	getAlbum(albumId: string) {
		return ipcRenderer.invoke("get-album", albumId);
	},
	selectImagesDialog() {
		return ipcRenderer.invoke("select-images");
	},
	selectDirectoriesDialog() {
		return ipcRenderer.invoke("select-directory");
	},
	insertImages(albumId: string, imagesPaths: string[]) {
		return ipcRenderer.invoke("insert-images", albumId, imagesPaths);
	},
	updatePhotosRating(albumId: string, photos: photo[]) {
		return ipcRenderer.invoke("update-photos-rating", albumId, photos);
	},
	resetAlbumPhotosRating(albumId: string) {
		return ipcRenderer.invoke("reset-album-photos-rating", albumId);
	},
	mergeAlbumRatings() {
		return ipcRenderer.invoke("merge-album-ratings")
	},
	async exportAlbumRatings(albumName: string, photos: photo[]) {
		return await ipcRenderer.invoke(
			"export-album-ratings",
			albumName,
			photos,
		);
	},
});
