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
} from "./db/db";

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
		title: "Select images or directory with images to rate",
		properties: ["multiSelections", "openFile"],
		filters: [
			{
				name: "Images [jpg, jpeg, png]",
				extensions: ["png", "jpeg", "jpg"],
			},
		],
	});

	return resoult.filePaths;
});

app.whenReady().then(createWindow);
