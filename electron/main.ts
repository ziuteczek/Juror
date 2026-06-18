import "dotenv/config";

import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { readFile } from "fs/promises";
import { registerRoute } from "../src/lib/electron-router-dom";
import {
	dbCreateAlbum,
	dbDeleteAlbum,
	dbGetAlbum,
	dbGetAlbumData,
	dbGetThumbnailPath,
	dbGetAlbumsDataList,
	db,
	dbInsertPhotos,
	dbUpdatePhotosRating,
	dbResetAlbumsPhotosRatings,
} from "./db/db";
import { devMode } from "../src/env";
import * as Excel from "exceljs";
import { readdir, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// electron-router-dom expects CommonJS-style `require` in the main process.
globalThis.require = require;

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
	? path.join(process.env.APP_ROOT, "public")
	: RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC!, "electron-vite.svg"),
		webPreferences: {
			preload: path.join(__dirname, "preload.mjs"),
		},
	});

	win.maximize();

	registerRoute({
		id: "main",
		browserWindow: win,
		devServerUrl: VITE_DEV_SERVER_URL,
		htmlFile: path.join(RENDERER_DIST, "index.html"),
	});

	// Test active push message to Renderer-process.
	win.webContents.on("did-finish-load", () => {
		win?.webContents.send(
			"main-process-message",
			new Date().toLocaleString(),
		);
	});

	if (VITE_DEV_SERVER_URL) {
		win.webContents.openDevTools({ mode: "detach" });
	}
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
		db.close();
		win = null;
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

const isFile = async (path: string) => {
	try {
		await readFile(path);
		return true;
	} catch (err) {
		if (devMode) {
			console.error(err);
		}
		return false;
	}
};
/**
 * Chechs if file with given path is an image
 *
 * @param path path of a file to check
 * @returns is given path an image
 */
const isImage = (path: string) => {
	const fileLowerCase = path.toLowerCase();
	const isPng = fileLowerCase.endsWith(".png");
	const isJpg = fileLowerCase.endsWith(".jpg");

	return isPng || isJpg;
};
/**
 * Transforms image from given path to base 64 string
 * @param photoPath PNG or JPEG photo image
 * @returns base64 string or empty string on error
 */
async function imagePathToBase64(photoPath: string): Promise<string> {
	try {
		const isPng = photoPath.toLocaleLowerCase().endsWith(".png");

		const photoBase64 = await readFile(photoPath, {
			encoding: "base64",
		});

		return `data:image/${isPng ? "png" : "jpeg"};base64,${photoBase64}`;
	} catch (err) {
		console.error(err);
		return "";
	}
}

ipcMain.handle("photo-to-base-64", async (_, photoPath: string) => {
	return await imagePathToBase64(photoPath);
});

ipcMain.handle("get-album", (_, albumId: string) => {
	const { data } = dbGetAlbum(albumId);
	return data;
});

ipcMain.handle("get-album-data", (_, albumId: string) => {
	const { data } = dbGetAlbumData(albumId);
	return data;
});

ipcMain.handle("create-album", (_, albumName: string, maxRating: number) => {
	const { success, data } = dbCreateAlbum(albumName, maxRating);

	if (!success) {
		return "";
	}

	return data;
});

ipcMain.handle("delete-album", (_, albumId: string) => {
	const { success } = dbDeleteAlbum(albumId);
	return success;
});

ipcMain.handle("get-album-base-64-thumbnail", async (_, albumId: string) => {
	const { success, data: path } = dbGetThumbnailPath(albumId);

	if (!success) {
		return "";
	}

	return await imagePathToBase64(path);
});

ipcMain.handle("get-albums-data-list", () => {
	const { success, data } = dbGetAlbumsDataList();

	if (!success) {
		return [];
	}

	return data;
});

ipcMain.handle("select-images", async () => {
	if (!win) {
		throw new Error("Window is not initialized!");
	}
	const resoult = await dialog.showOpenDialog(win, {
		title: "Select images to rate",
		properties: ["multiSelections", "openFile"],
		filters: [
			{
				name: "Images (jpg, jpeg, png)",
				extensions: ["png", "jpeg", "jpg"],
			},
		],
	});

	return resoult.filePaths;
});

ipcMain.handle("select-directory", async () => {
	if (!win) {
		throw new Error("Window is not initialized!");
	}

	const resoult = await dialog.showOpenDialog(win, {
		title: "Select directories with images to rate!",
		properties: ["openDirectory", "multiSelections"],
	});

	const selectedDirs = resoult.filePaths;
	const selectedFilesPromise = selectedDirs.map(
		async (dir) => await readdir(dir, { encoding: "utf-8" }),
	);
	const selectedFiles = await Promise.all(selectedFilesPromise);
	const selectedFilesPaths = selectedFiles.map((files, i) =>
		files.map((file) => path.join(selectedDirs[i], file)),
	);
	const selectedFilesFlat = selectedFilesPaths.flat();
	const selectedImages = selectedFilesFlat.filter((file) => isImage(file));

	return selectedImages;
});

ipcMain.handle(
	"insert-images",
	async (_, albumId: string, imagesPaths: string[]) => {
		const existingImages = imagesPaths.filter(
			async (imagePath) => await isFile(imagePath),
		);

		const missingImagesCount =
			existingImages.length - existingImages.length;

		if (missingImagesCount) {
			alert(`Cound't read ${missingImagesCount} images`);
		}

		return dbInsertPhotos(albumId, existingImages);
	},
);

ipcMain.handle(
	"update-photos-rating",
	(_, albumId: string, photos: photo[]) => {
		const { success } = dbUpdatePhotosRating(albumId, photos);
		return success;
	},
);

ipcMain.handle("reset-album-photos-rating", (_, albumId: string) => {
	const { success } = dbResetAlbumsPhotosRatings(albumId);
	return success;
});

const exportRatingsJson = async (path: string, photos: photo[]) => {
	const formatedPhotos = photos.map(({ fileName, rating }) => ({
		name: fileName,
		rating,
	}));
	await writeFile(path, JSON.stringify(formatedPhotos));
};

const exportRatingsXlsx = async (path: string, photos: photo[]) => {
	const workbook = new Excel.Workbook();
	const worksheet = workbook.addWorksheet();

	worksheet.addRow(["name", "rating"]);
	photos.forEach(({ fileName, rating }) => {
		worksheet.addRow([fileName, rating]);
	});

	await workbook.xlsx.writeFile(path);
};

ipcMain.handle(
	"export-album-ratings",
	async (_, albumName: string, photos: photo[]) => {
		if (!win) {
			throw new Error("Window is not initialized!");
		}

		const docsPath = app.getPath("documents");
		const defaultPath = path.join(docsPath, `${albumName}-rating`);

		const { canceled, filePath } = await dialog.showSaveDialog(win, {
			filters: [
				{ name: "excel file (.xlsx)", extensions: ["xlsx"] },
				{ name: "JSON", extensions: ["json"] },
			],
			defaultPath,
		});

		if (canceled) {
			return;
		}

		if (filePath.toLowerCase().endsWith(".json")) {
			exportRatingsJson(filePath, photos);
		} else if (filePath.toLowerCase().endsWith(".xlsx")) {
			exportRatingsXlsx(filePath, photos);
		} else {
			exportRatingsXlsx(filePath + ".xlsx", photos);
		}
	},
);

app.whenReady().then(createWindow);
