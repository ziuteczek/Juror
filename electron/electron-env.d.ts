/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
	interface ProcessEnv {
		/**
		 * The built directory structure
		 *
		 * ```tree
		 * ├─┬─┬ dist
		 * │ │ └── index.html
		 * │ │
		 * │ ├─┬ dist-electron
		 * │ │ ├── main.js
		 * │ │ └── preload.js
		 * │
		 * ```
		 */
		APP_ROOT: string;
		/** /dist/ or /public/ */
		VITE_PUBLIC: string;
	}
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
	ipcRenderer: import("electron").IpcRenderer & {
		getOfflineGalleryData(): Promise<
			Array<{ name: string; path: string; thumbnail: string }>
		>;
		getOfflineAlbumPhotosList(albumPath: string): Promise<string[]>;
		getAlbumData(albumPath: string): Promise<albumData[]>;
		photoToBase64(photoPath: string): Promise<string>;
		saveAlbumData(albumPath: string, albumData: albumData[]): boolean;
		resetAlbumData(albumPath: string): boolean;
	};
}
