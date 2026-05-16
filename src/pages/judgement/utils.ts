export const getArrangedPhotos = (photos: photo[]): photo[] => {
	const photosDisplayed = photos.filter(
		(photo) => photo.lastDisplayed,
	) as Override<photo, "lastDisplayed", Date>[];
	const photosNotDisplayed = photos.filter(
		(photo) => !photo.lastDisplayed,
	) as Override<photo, "lastDisplayed", null>[];

	const photosDisplayedSorted = photosDisplayed.toSorted(
		(a, b) => a.lastDisplayed.getTime() - b.lastDisplayed.getTime(),
	);

	return [...photosDisplayedSorted, ...photosNotDisplayed];
};
