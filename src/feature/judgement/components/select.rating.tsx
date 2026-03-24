import { Fragment } from "react/jsx-runtime";
import { maxRating } from "../../../env";
import { albumData, currPhotoData } from "../types";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";

export default function SelectRating({
	albumData,
	currPhoto,
	setAlbumData,
}: {
	albumData: albumData[];
	currPhoto: currPhotoData;
	setAlbumData: Dispatch<SetStateAction<albumData[]>>;
}) {
	const ratePhoto = (rating: number | null) =>
		setAlbumData((prev) =>
			prev.map((photo, photoIndex) =>
				photoIndex === currPhoto.index
					? { ...photo, rating }
					: { ...photo },
			),
		);
	const ratePhotoCallback = useCallback(ratePhoto, [
		currPhoto.index,
		setAlbumData,
	]);

	useEffect(() => {
		const ratedByKeyboard = (e: KeyboardEvent) => {
			const keyCode = e.code;
			const digitKeyword = "Digit";

			if (!keyCode.startsWith(digitKeyword)) {
				return;
			}

			const numPressedStr = keyCode.replace(digitKeyword, "");
			const numPressed = Number(numPressedStr);

			if (isNaN(numPressed)) {
				return;
			}

			if (numPressed >= 1 && numPressed <= maxRating) {
				ratePhotoCallback(numPressed);
			}
		};

		document.addEventListener("keydown", ratedByKeyboard);

		return () => {
			document.removeEventListener("keydown", ratedByKeyboard);
		};
	}, [ratePhotoCallback]);

	return (
		<form
			className="flex flex-col gap-5 items-center"
			onKeyDown={(e) => console.log(e)}
		>
			{Array.from({ length: maxRating }, (_, i) => {
				const isSelected = albumData[currPhoto.index].rating === i + 1;

				return (
					<Fragment key={i}>
						<label
							htmlFor={`${i + 1}`}
							className={`font-bold text-4xl ${isSelected && "text-sky-700"} cursor-pointer hover:${isSelected ? "text-sky-700" : "text-gray-600"} transition-colors duration-150`}
						>
							{i + 1}
						</label>
						<input
							type="radio"
							name="rating"
							id={`${i + 1}`}
							value={i + 1}
							checked={isSelected}
							onChange={() => ratePhotoCallback(i + 1)}
							className="hidden"
						/>
					</Fragment>
				);
			})}
			<button
				type="reset"
				className="-mt-5 text-gray-700 py-2 text-lg cursor-pointer"
				onClick={() => ratePhotoCallback(null)}
			>
				reset
			</button>
		</form>
	);
}
