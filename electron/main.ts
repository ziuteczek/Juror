import "dotenv/config";

import {
	app,
	BrowserWindow,
	dialog,
	ipcMain,
	IpcMainInvokeEvent,
	shell,
} from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path, { extname } from "node:path";
import { readdir, mkdir, readFile } from "fs/promises";
import { registerRoute } from "../src/lib/electron-router-dom";
import ElectronStore from "electron-store";
import { photoData } from "../src/pages/judgement/types";
import {
	baseDirName,
	dbFileName,
	photosDirName,
	ratingsDirName,
} from "../src/env";
import { writeFile } from "node:fs/promises";
import * as XLSX from "xlsx";
import Database from "better-sqlite3";

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
let db: InstanceType<typeof Database> | null;

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
		win?.webContents.send("main-process-message", new Date().toLocaleString());
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
async function fileExists(filePath: string) {
	try {
		await readFile(filePath);
		return true;
	} catch {
		return false;
	}
}
async function initDb() {
	try {
		db = new Database(dbFileName);
	} catch (err) {
		console.error();
	}
}

async function getThumbnail(dirPath: string): Promise<string> {
	try {
		const files = await readdir(dirPath);
		const photos = [
			...files.filter(
				(file) =>
					file.toLocaleLowerCase().endsWith(".jpg") ||
					file.toLocaleLowerCase().endsWith(".jpeg")
			),
		].sort();

		if (photos.length === 0) {
			return "";
		}

		const thumbnailPath = path.join(dirPath, photos[0]);
		return photoToBase64(thumbnailPath);
	} catch (err) {
		console.error(err);
		return "";
	}
}

async function photoToBase64(photoPath: string): Promise<string> {
	try {
		const photoBase64 = await readFile(photoPath, {
			encoding: "base64",
		});

		return `data:image/jpeg;base64,${photoBase64}`;
	} catch (err) {
		console.error(err);
		return "";
	}
}

ipcMain.handle("photo-to-base-64", async (_, photoPath: string) => {
	return photoToBase64(photoPath);
});

// IPC handler for getting offline gallery data
ipcMain.handle("get-offline-gallery-data", async () => {
	const picturesPath = app.getPath("pictures");
	const jurorFolderPath = path.join(picturesPath, baseDirName);

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
				path: path.join(dir.parentPath, dir.name),
				thumbnail: await getThumbnail(path.join(dir.parentPath, dir.name)),
			}))
	);
});

ipcMain.handle(
	"get-offline-album-photos-list",
	//eslint-disable-next-line
	async (_: any, albumPath: string) => {
		try {
			if (!(await dirExists(albumPath))) {
				console.warn("Album with given path doesn't exists");
				return [];
			}
			return await readdir(albumPath);
		} catch (err) {
			console.error(err);
			return [];
		}
	}
);
//eslint-disable-next-line
ipcMain.handle("get-album-data", async (_: any, albumPath: string) => {
	try {
		if (!(await dirExists(albumPath))) {
			console.warn(
				`Album path with given directory (${albumPath}) doesn't exists`
			);
			return [];
		}

		const storage = new ElectronStore();
		const albumTitle = path.basename(albumPath);

		if (storage.has(albumTitle)) {
			const albumDataRaw = storage.get(albumTitle) as {
				title: string;
				path: string;
				rating: number | null;
				lastTimeDisplayed: number | null;
			}[];
			return albumDataRaw.map((data) => ({
				...data,
				lastTimeDisplayed:
					data.lastTimeDisplayed != null
						? new Date(data.lastTimeDisplayed)
						: null,
			})) as photoData[];
		}

		const albumFiles = await readdir(albumPath, { withFileTypes: true });
		const albumPhotos = albumFiles.filter(
			(file) =>
				(file.isFile() && file.name.toLocaleLowerCase().endsWith(".jpeg")) ||
				file.name.toLocaleLowerCase().endsWith(".jpg")
		);
		const albumData = albumPhotos.map((photo) => ({
			title: photo.name,
			path: path.join(albumPath, photo.name),
			rating: null,
		}));
		return albumData;
	} catch (err) {
		console.error(err);
		return [];
	}
});

ipcMain.handle(
	"save-album-data",
	async (_: IpcMainInvokeEvent, albumPath: string, albumData: photoData[]) => {
		try {
			if (!(await dirExists(albumPath))) {
				console.warn(
					`Album path with given directory (${albumPath}) doesn't exists`
				);
				return false;
			}

			const storage = new ElectronStore();
			const albumTitle = path.basename(albumPath);
			const albumDataComputed = albumData.map((data) => ({
				...data,
				lastTimeDisplayed: data.lastTimeDisplayed?.getTime() ?? null,
			}));

			storage.set(albumTitle, albumDataComputed);
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	}
);

const deleteAlbumData = async (albumPath: string) => {
	try {
		const storage = new ElectronStore();
		const albumTitle = path.basename(albumPath);
		storage.delete(albumTitle);
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};

ipcMain.handle(
	"reset-album-data",
	(_: IpcMainInvokeEvent, albumPath: string) => {
		try {
			return deleteAlbumData(albumPath);
		} catch (err) {
			console.error(err);
			return false;
		}
	}
);

// ...existing code...

ipcMain.handle(
	"export-album-data",
	async (_: IpcMainInvokeEvent, albumData: photoData[]) => {
		try {
			const { canceled, filePath } = await dialog.showSaveDialog({
				title: "Save your file",
				defaultPath: "output.xlsx",
				filters: [
					{ name: "JSON", extensions: ["json"] },
					{ name: "Excel", extensions: ["xlsx"] },
				],
			});

			if (canceled || !filePath) {
				return false;
			}

			let outputPath = filePath;
			let extension = extname(outputPath).toLowerCase();

			if (!extension) {
				extension = ".xlsx";
				outputPath = `${outputPath}${extension}`;
			}

			const exportData = albumData.map((item) => ({
				...item,
				lastTimeDisplayed: item.lastTimeDisplayed
					? item.lastTimeDisplayed.toISOString()
					: null,
			}));

			if (extension === ".json") {
				await writeFile(
					outputPath,
					JSON.stringify(exportData, null, 2),
					"utf-8"
				);
				return true;
			}

			if (extension === ".xlsx") {
				const worksheet = XLSX.utils.json_to_sheet(exportData);
				const workbook = XLSX.utils.book_new();
				XLSX.utils.book_append_sheet(workbook, worksheet, "ratings");
				XLSX.writeFile(workbook, outputPath);
				return true;
			}

			throw new Error(`Unsupported file extension: ${extension}`);
		} catch (err) {
			console.error(err);
			return false;
		}
	}
);

ipcMain.handle(
	"create-album",
	async (_: IpcMainInvokeEvent, albumName: string) => {
		try {
			const picturesPath = app.getPath("pictures");
			const jurorFolderPath = path.join(picturesPath, baseDirName);

			const photosDirPath = path.join(jurorFolderPath, photosDirName);
			const ratignDirPath = path.join(jurorFolderPath, ratingsDirName);

			const photosPathAlbum = path.join(photosDirPath, albumName);
			const ratingFilePath = path.join(ratignDirPath, dbFileName);

			if (await dirExists(photosPathAlbum)) {
				return false;
			}

			await mkdir(photosPathAlbum, { recursive: true });

			try {
				const x = new Database();
			} catch (err) {
				console.error(err);
			}

			return;
		} catch (err) {
			console.error(err);
			return "";
		}
	}
);

ipcMain.handle(
	"open-album-directory",
	async (_: IpcMainInvokeEvent, albumPath: string) => {
		try {
			await shell.openPath(albumPath);
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	}
);

ipcMain.handle(
	"delete-album",
	async (_: IpcMainInvokeEvent, albumPath: string) => {
		try {
			deleteAlbumData(albumPath);
			await shell.trashItem(albumPath);
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	}
);

app.whenReady().then(createWindow);
