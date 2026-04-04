/// <reference types="vite-plugin-electron/electron-env" />

//prettier-ignore
type returnWrapper<T> ={
	success: true,
	data: T,
	error:null
} | { 
	success: false,
	data: null,
	error: unknown,
};

interface photo {
	path: string;
	rating: number | null;
	lastTimeDisplayed: Date | null;
}

interface albumData {
	id: string;
	name: string;
	maxRating: number;
	createdAt: Date;
}

interface album extends albumData {
	photos: photo[];
}

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
		getAlbumsData(): Promise<albumData[]>;

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
		createAlbum(albumName: string, maxRating: number): Promise<string>;
		/**
		 * Deletes given album from database (it won't delete photos files)
		 */
		deleteAlbum(albumId: string): boolean;

		/**
		 * Queries first photo from album, reads it and converts to base64 image string
		 * @returns base64 image string, and on error empty string
		 */
		getAlbumThumbnailBase64(albumId: string): Promise<string>;

		/**
		 * Queries album from database (including photos)
		 */
		getAlbum(albumId: string): Promise<album>;
	};
}
