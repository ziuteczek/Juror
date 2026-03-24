export interface albumData {
	title: string;
	path: string;
	rating: number | null;
	lastTimeDisplayed: Date | null;
}
/**
 * Represents the current photo being viewed or edited.
 * @property index - Index of the current photo in the albumData (-1 for no photo selected)
 * @property photoBase64 - The base64 encoded string representation of the current photo
 * @property rating - The rating assigned to the current photo, or null if not rated
 */
export interface currPhotoData {
	index: number;
	photoBase64: string;
}
