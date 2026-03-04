const maxRatingRaw = import.meta.env.VITE_MAX_RATING;
const devMode = import.meta.env.DEV;
const offlineGalleryDirName = import.meta.env
	.VITE_OFFLINE_GALLERY_DIR_NAME as string;

const maxRating = Number(maxRatingRaw);

if (!maxRatingRaw || Number.isNaN(maxRating)) {
	throw new Error("Env variable VITE_MAX_RATING must be a valid number");
}

if (!offlineGalleryDirName || typeof offlineGalleryDirName !== "string") {
	throw new Error(
		"Env variable VITE_OFFLINE_GALLERY_DIR_NAME must be a non-empty string",
	);
}

if (maxRating <= 0) {
	throw new Error("VITE_MAX_RATING must be greater than 0");
}

export { offlineGalleryDirName, maxRating, devMode };
