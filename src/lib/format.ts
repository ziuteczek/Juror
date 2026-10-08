/**
 * SQLite's CURRENT_TIMESTAMP is stored as "YYYY-MM-DD HH:MM:SS" in UTC. Converts it (or a Date) to a Date.
 */
export const parseDbDate = (value: Date | string): Date => {
	if (value instanceof Date) return value;
	return new Date(value.replace(" ", "T") + "Z");
};

export const formatDate = (value: Date | string) => {
	const date = parseDbDate(value);
	if (isNaN(date.getTime())) return "";
	return date.toLocaleDateString(undefined, { dateStyle: "medium" });
};
