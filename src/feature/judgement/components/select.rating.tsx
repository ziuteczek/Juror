import { Fragment } from "react/jsx-runtime";
import { maxRating } from "../../../env";
import { albumData, currPhotoData } from "../types";
import { Dispatch, SetStateAction } from "react";

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

	return (
		<form>
			{Array.from({ length: maxRating }, (_, i) => (
				<Fragment key={i}>
					<label htmlFor={`${i + 1}`}>{i + 1}</label>
					<input
						type="radio"
						name="rating"
						id={`${i + 1}`}
						value={i + 1}
						checked={albumData[currPhoto.index].rating === i + 1}
						onChange={() => ratePhoto(i + 1)}
					/>
				</Fragment>
			))}
			<button type="reset">reset</button>
		</form>
	);
}
