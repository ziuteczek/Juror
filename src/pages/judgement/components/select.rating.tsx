import { Fragment } from "react/jsx-runtime";
import { currPhotoData } from "../types";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";

export default function SelectRating({
	photos,
	currPhoto,
	maxRating,
	setPhoto,
}: {
	photos: photo[];
	currPhoto: currPhotoData;
	maxRating: number;
	setPhoto: Dispatch<SetStateAction<photo[]>>;
}) {
	const ratePhoto = (rating: number | null) =>
		setPhoto((prev) =>
			prev.map((photo, photoIndex) =>
				photoIndex === currPhoto.index
					? { ...photo, rating }
					: { ...photo },
			),
		);
	const ratePhotoCallback = useCallback(ratePhoto, [
		currPhoto.index,
		setPhoto,
	]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
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

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [ratePhotoCallback]);

	return (
		<form className="flex flex-col gap-5 items-center">
			{Array.from({ length: maxRating }, (_, i) => {
				const isSelected = photos[currPhoto.index].rating === i + 1;

				return (
					<Fragment key={i}>
						<label
							htmlFor={`${i + 1}`}
							className={`font-bold text-4xl cursor-pointer transition-colors duration-150 ${
								isSelected
									? "text-sky-700 hover:text-sky-700"
									: "hover:text-gray-600"
							}`}
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
