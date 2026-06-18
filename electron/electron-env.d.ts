/// <reference types="vite-plugin-electron/electron-env" />

type Override<T, K extends keyof T, V> = Omit<T, K> & Record<K, V>;

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
	filePath: string;
	fileName: string;
	rating: number | null;
	lastRated: Date | null;
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
		 * @returns album data array **(without photos)**
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
		 * Deletes given album from database **(it won't delete photos files)**
		 */
		deleteAlbum(albumId: string): Promise<boolean>;

		/**
		 * Queries first photo from album, reads it and converts to base64 image string
		 * @returns base64 image string, and on error empty string
		 */
		getAlbumThumbnailBase64(albumId: string): Promise<string>;

		/**
		 * Queries album from database (including photos)
		 */
		getAlbum(albumId: string): Promise<album>;

		/**
		 * Opens window allowing user to select multiple photos with **.png**, **.jpg** and **.jpeg** extensions *(case insensitive)*
		 * @returns absolute paths to selected photos
		 */
		selectImagesDialog(): Promise<string[]>;

		/**
		 * Opens window allowing user to select multiple directories with photos. Inside of this directory photos with **.png**, **.jpg** and **.jpeg** extensions *(case insensitive)* are extracted
		 *
		 * @returns absolute paths to the photos inside of selected directories
		 */
		selectDirectoriesDialog(): Promise<string[]>;

		/**
		 * Inserts **readable** images with given paths to the database
		 *
		 * In case if any photo is unreadable, alert() is displayed with message containing number of unreadable images. (**All other readable images are insterted normaly**)
		 *
		 * @param imagesPaths **Absolute** paths of images to insert
		 * @returns objects of succesfully inserted photos
		 */
		insertImages(
			albumId: string,
			imagesPaths: string[],
		): Promise<Omit<photo, "fileName">[]>;

		/**
		 * Updates photos rating and last_display in given album inside database.
		 * @returns **true** on succes, **false** on error
		 */
		updatePhotosRating(albumId: string, photos: photo[]): Promise<boolean>;

		/**
		 * Resets all photos: rating, last_rated from given album
		 * @returns **true** on succes, **false** on failure
		 */
		resetAlbumPhotosRating(albumId: string): Promise<boolean>;

		/**
		 * Exports ratings to file. Directory and extenstion selected by user (**xlsx** or **json**).
		 * @param albumName Namoe of the album to export
		 */
		exportAlbumRatings(albumName: string, photos: photo[]): Promise<void>;
	};
}
