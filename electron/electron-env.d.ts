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
		/**
		 * Queries albums list from database
		 * @returns album data array (without photos)
		 */
		getAlbumsData(): albumData[];

		/**
		 * Convers given photo to base64 string
		 * @param photoPath Absolute path to the photo
		 * @returns base64 string image or empty string on error
		 */
		photoToBase64(photoPath: string): Promise<string>;
		/**
		 * Creates album inside database.
		 * @param albumName Name of an album.
		 * @param maxRating Maximum rating that photo can achive in given album.
		 */
		createAlbum(albumName: string, maxRating: number): string;
		/**
		 * Deletes given album from database (it won't delete photos files)
		 */
		deleteAlbum(albumId: string): boolean;
	};
}
