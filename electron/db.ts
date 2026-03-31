import initQuery from "./sql/init.sql?raw";
import createAlbumQuery from "./sql/create.album.sql?raw";
import getAlbumData from "./sql/get.album.data.sql?raw";
import Database from "better-sqlite3";
import { dbFileName } from "../src/env";
import { photoData } from "../src/pages/judgement/types";

// prettier-ignore
type returnWrapper<T> = {
			succes: true;
			data: T; } | { succes: false; error: unknown };

/**
 * Initialized database
 */
const db = new Database(dbFileName);
db.exec(initQuery);

const queries = {
	createAlbum: db.prepare(createAlbumQuery),
	getAlbumData: db.prepare(getAlbumData),
};

const dbCreateAlbum = (albumId: number): returnWrapper<null> => {
	try {
		queries.createAlbum.run({ id: albumId });
		return { succes: true, data: null };
	} catch (err) {
		return { succes: false, error: "Failed while creating album" };
	}
};

const dbGetAlbumData = (albumId: number): returnWrapper<photoData[]> => {
	try {
		const albumData = queries.getAlbumData.all({
			album_id: albumId,
		}) as photoData[];
		return { succes: true, data: albumData };
	} catch (err) {
		return { succes: false, error: "Failed while querying album data" };
	}
};

export { db, dbCreateAlbum, dbGetAlbumData };
