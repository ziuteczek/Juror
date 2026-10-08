import { useEffect } from "react";

const isTyping = (target: EventTarget | null) =>
	target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

/**
 * Row/grid of rating buttons (1 – max). While mounted, it also listens to the keyboard:
 * digits rate ("0" stands for 10), Backspace/Delete clears the rating.
 */
export default function RatingPicker({
	value,
	max,
	onChange,
	className = "",
}: {
	value: number | null;
	max: number;
	onChange: (rating: number | null) => void;
	/** Layout of the buttons container, e.g. "grid grid-cols-5 gap-2" */
	className?: string;
}) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) {
				return;
			}

			if (e.key === "Backspace" || e.key === "Delete") {
				onChange(null);
				return;
			}

			if (!/^[0-9]$/.test(e.key)) {
				return;
			}

			const numPressed = e.key === "0" ? 10 : Number(e.key);

			if (numPressed >= 1 && numPressed <= max) {
				onChange(numPressed);
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [max, onChange]);

	return (
		<div role="radiogroup" aria-label="Rating" className={className}>
			{Array.from({ length: max }, (_, i) => {
				const rating = i + 1;
				const isSelected = value === rating;
				return (
					<button
						key={rating}
						type="button"
						role="radio"
						aria-checked={isSelected}
						onClick={() => onChange(rating)}
						className={`aspect-square min-w-10 cursor-pointer rounded-lg text-lg font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
							isSelected
								? "bg-accent text-white shadow-sm"
								: "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
						}`}
					>
						{rating}
					</button>
				);
			})}
		</div>
	);
}
