const maxRatingRaw = import.meta.env.VITE_MAX_RATING;
const devMode = import.meta.env.DEV;
const baseDirName = import.meta.env.VITE_BASE_DIR_NAME as string;
const photosDirName = import.meta.env.VITE_PHOTOS_DIR_NAME as string;
const ratingsDirName = import.meta.env.VITE_RATINGS_DIR_NAME as string;
const dbFileName = import.meta.env.VITE_DB_NAME as string;

const maxRating = Number(maxRatingRaw);

if (!maxRatingRaw || Number.isNaN(maxRating)) {
	throw new Error("Env variable VITE_MAX_RATING must be a valid number");
}

if (!baseDirName || typeof baseDirName !== "string") {
	throw new Error("Env variable VITE_BASE_DIR_NAME must be a non-empty string");
}

if (!photosDirName || typeof photosDirName !== "string") {
	throw new Error("Env variable VITE_BASE_DIR_NAME must be a non-empty string");
}

if (!ratingsDirName || typeof ratingsDirName !== "string") {
	throw new Error(
		"Env variable VITE_RATINGS_DIR_NAME must be a non-empty string"
	);
}

if (!dbFileName || typeof dbFileName !== "string") {
	throw new Error(
		"Env variable VITE_RATINGS_DIR_NAME must be a non-empty string"
	);
}

if (maxRating <= 1) {
	throw new Error("VITE_MAX_RATING must be greater than 1");
}

export {
	baseDirName,
	maxRating,
	devMode,
	photosDirName,
	ratingsDirName,
	dbFileName,
};
