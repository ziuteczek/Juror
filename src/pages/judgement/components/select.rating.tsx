import { currPhotoData } from "../types";
import { Dispatch, SetStateAction, useCallback } from "react";
import Button from "../../../components/button";
import RatingPicker from "../../../components/rating.picker";

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
	const ratePhoto = useCallback(
		(rating: number | null) =>
			setPhoto((prev) =>
				prev.map((photo, photoIndex) =>
					photoIndex === currPhoto.index ? { ...photo, rating } : photo,
				),
			),
		[currPhoto.index, setPhoto],
	);

	const currentRating = photos[currPhoto.index]?.rating ?? null;

	return (
		<div>
			<div className="flex items-baseline justify-between">
				<h2 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
					Rating
				</h2>
				<span className="text-sm tabular-nums text-zinc-500">
					{currentRating === null ? "—" : currentRating} / {maxRating}
				</span>
			</div>

			<RatingPicker
				value={currentRating}
				max={maxRating}
				onChange={ratePhoto}
				className="mt-3 grid grid-cols-5 gap-2"
			/>

			<Button
				variant="ghost"
				size="sm"
				className="mt-3 -ml-3"
				disabled={currentRating === null}
				onClick={() => ratePhoto(null)}
			>
				Clear rating
			</Button>
		</div>
	);
}
