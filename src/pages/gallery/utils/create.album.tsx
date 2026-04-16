export const createAlbum = async (
	e: React.FormEvent<HTMLFormElement>,
	albumTitle: string,
	maxRating: number,
	setAlbumTitle: (title: string) => void,
	setMaxRating: (rating: number) => void,
	closeDialog: () => void,
) => {
	e.preventDefault();

	const trimmedTitle = albumTitle.trim();

	if (!trimmedTitle) {
		alert("Album title can't be empty");
		return;
	}

	try {
		const newAlbumPath = await window.ipcRenderer.createAlbum(
			trimmedTitle,
			maxRating,
		);

		if (!newAlbumPath) {
			alert("Failed to create album");
			return;
		}

		alert("Album created successfully");

		setAlbumTitle("");
		setMaxRating(6);
		closeDialog();

		// Avoid full reload if possible, but keeping your logic:
		window.location.reload();
	} catch (err) {
		console.error(err);
		alert("Something went wrong");
	}
};
