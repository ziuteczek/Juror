import "dotenv/config";
import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { readdir, mkdir, readFile } from "fs/promises";
import { registerRoute } from "../src/lib/electron-router-dom";

const require = createRequire(import.meta.url);
// electron-router-dom expects CommonJS-style `require` in the main process.
globalThis.require = require;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
		icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
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

async function dirExists(dirPath: string): Promise<boolean> {
	try {
		await readdir(dirPath);
		return true;
	} catch {
		return false;
	}
}

async function getThumbnail(dirPath: string): Promise<string> {
	try {
		const files = await readdir(dirPath);
		const photos = [
			...files.filter(
				(file) =>
					file.toLocaleLowerCase().endsWith(".jpg") ||
					file.toLocaleLowerCase().endsWith(".jpeg"),
			),
		].sort();

		if (photos.length === 0) {
			console.warn(`There are no photos in ${dirPath} gallery`);
			return "";
		}

		const thumbnailPath = path.join(dirPath, photos[0]);
		const thumbnailBase64 = await readFile(thumbnailPath, {
			encoding: "base64",
		});

		return `data:image/jpeg;base64,${thumbnailBase64}`;
	} catch (err) {
		console.error(err);
		return "";
	}
}

// IPC handler for getting offline gallery data
ipcMain.handle("get-offline-gallery-data", async () => {
	const galleryFolderName = process.env.OFFLINE_GALLERY_DIR_NAME;

	if (!galleryFolderName) {
		throw new Error("Env variable OFFLINE_GALLERY_DIR_NAME not defined");
	}

	const picturesPath = app.getPath("pictures");
	const jurorFolderPath = path.join(picturesPath, galleryFolderName);

	if (!(await dirExists(jurorFolderPath))) {
		await mkdir(jurorFolderPath);
	}

	const directoriesAndFiles = await readdir(jurorFolderPath, {
		withFileTypes: true,
	});

	return Promise.all(
		directoriesAndFiles
			.filter((dir) => dir.isDirectory())
			.map(async (dir) => ({
				name: dir.name,
				path: dir.parentPath,
				thumbnail: await getThumbnail(
					path.join(dir.parentPath, dir.name),
				),
			})),
	);
});

app.whenReady().then(createWindow);
