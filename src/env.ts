const devMode = import.meta.env.DEV;
const dbFileName = import.meta.env.VITE_DB_NAME as string;

if (!dbFileName || typeof dbFileName !== "string") {
	throw new Error(
		"Env variable VITE_RATINGS_DIR_NAME must be a non-empty string",
	);
}

export { devMode, dbFileName };