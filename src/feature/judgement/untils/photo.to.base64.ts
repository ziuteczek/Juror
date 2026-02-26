export default async function photoToBase64(photoPath: string) {
	return window.ipcRenderer.photoToBase64(photoPath);
}
