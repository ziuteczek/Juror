import initQuery from "./sql/init.sql?raw";
import createAlbumQuery from "./sql/create.album.sql?raw";
import getAlbumDataQuery from "./sql/get.album.data.sql?raw";
import deleteAlbumQuery from "./sql/delete.album.sql?raw";
import getAlbumQuery from "./sql/get.album.sql?raw";
import getAlbumsDataList from "./sql/get.albums.data.list.sql?raw";
import getAlbumThumbnailPathQuery from "./sql/get.album.thumbnail.path.sql?raw";
import Database from "better-sqlite3";
import { dbFileName } from "../../src/env";
import { randomUUID } from "node:crypto";

/**
 * Initialized database
 */
const db = new Database(dbFileName);
db.exec(initQuery);

const queries = {
	createAlbum: db.prepare(createAlbumQuery),
	getAlbumData: db.prepare(getAlbumDataQuery),
	deleteAlbumData: db.prepare(deleteAlbumQuery),
	getAlbum: db.prepare(getAlbumQuery),
	getAlbumThumbnailPath: db.prepare(getAlbumThumbnailPathQuery),
	getAlbumsDataList: db.prepare(getAlbumsDataList),
};

/**
 * Creates new album in the data base (create.album.sql)
 * @returns new album id
 */
const dbCreateAlbum = (
	albumName: string,
	maxRating: number,
): returnWrapper<string> => {
	try {
		const newAlbumId = randomUUID();
		queries.createAlbum.run({
			id: newAlbumId,
			album_name: albumName,
			max_rating: maxRating,
		});
		return { success: true, data: newAlbumId, error: null };
	} catch (err) {
		console.error(err);
		return { success: false, error: err, data: null };
	}
};

/**
 * Queries album data from database
 * @returns album data (without the photos)
 */
const dbGetAlbumData = (albumId: string): returnWrapper<albumData> => {
	try {
		const albumData = queries.getAlbumData.get({
			id: albumId,
		}) as albumData;
		return { success: true, data: albumData, error: null };
	} catch (err) {
		console.error(err);
		return { success: false, error: err, data: null };
	}
};

/**
 * Queries album from database
 * @returns album (with photos)
 */
const dbGetAlbum = (albumId: string): returnWrapper<album> => {
	try {
		const album = queries.getAlbum.get({ album_id: albumId }) as album;
		return { success: true, data: album, error: null };
	} catch (err) {
		console.error(err);
		return { success: false, error: err, data: null };
	}
};

/**
 * Deletes album from database
 */
const dbDeleteAlbum = (albumId: string): returnWrapper<null> => {
	try {
		const { changes } = queries.deleteAlbumData.run({ id: albumId });

		if (changes === 0) {
			throw new Error(`Couldn't delete album with id = ${albumId}`);
		}

		return { success: true, data: null, error: null };
	} catch (err) {
		console.error(err);
		return { success: false, error: err, data: null };
	}
};

/**
 * Queries first photo from the album, sorted by photos id
 * @returns photo path
 */
const dbGetThumbnailPath = (albumId: string): returnWrapper<string> => {
	try {
		const row = queries.getAlbumThumbnailPath.get({ album_id: albumId }) as {
			file_path: string;
		};

		return { success: true, data: row?.file_path as string, error: null };
	} catch (err) {
		console.error(err);
		return { success: false, error: err, data: null };
	}
};

const dbGetAlbumsDataList = (): returnWrapper<albumData[]> => {
	try {
		const data = queries.getAlbumsDataList.all() as albumData[];
		return { success: true, data, error: null };
	} catch (err) {
		console.error(err);
		return { success: false, data: null, error: err };
	}
};

export {
	db,
	dbCreateAlbum,
	dbGetAlbumData,
	dbDeleteAlbum,
	dbGetAlbum,
	dbGetThumbnailPath,
	dbGetAlbumsDataList,
};
