const devMode = import.meta.env.DEV;
const baseDirName = import.meta.env.VITE_BASE_DIR_NAME as string;
const photosDirName = import.meta.env.VITE_PHOTOS_DIR_NAME as string;
const dbFileName = import.meta.env.VITE_DB_NAME as string;

if (!baseDirName || typeof baseDirName !== "string") {
	throw new Error(
		"Env variable VITE_BASE_DIR_NAME must be a non-empty string",
	);
}

if (!photosDirName || typeof photosDirName !== "string") {
	throw new Error(
		"Env variable VITE_BASE_DIR_NAME must be a non-empty string",
	);
}

if (!dbFileName || typeof dbFileName !== "string") {
	throw new Error(
		"Env variable VITE_RATINGS_DIR_NAME must be a non-empty string",
	);
}

export { baseDirName, devMode, photosDirName, dbFileName };
