export const getArrangedPhotos = (photos: photo[]): photo[] => {
	const photosDisplayed = photos.filter(
		(photo) => photo.lastRated,
	) as Override<photo, "lastRated", Date>[];
	const photosNotDisplayed = photos.filter(
		(photo) => !photo.lastRated,
	) as Override<photo, "lastRated", null>[];

	const photosDisplayedSorted = photosDisplayed.toSorted(
		(a, b) => a.lastRated.getTime() - b.lastRated.getTime(),
	);

	return [...photosDisplayedSorted, ...photosNotDisplayed];
};