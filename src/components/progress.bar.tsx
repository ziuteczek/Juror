export default function ProgressBar({
	value,
	max,
	className = "",
}: {
	value: number;
	max: number;
	className?: string;
}) {
	const percent = max > 0 ? Math.round((value / max) * 100) : 0;

	return (
		<div
			role="progressbar"
			aria-valuemin={0}
			aria-valuemax={max}
			aria-valuenow={value}
			className={`h-1.5 overflow-hidden rounded-full bg-zinc-200 ${className}`}
		>
			<div
				className="h-full rounded-full bg-accent transition-[width] duration-300"
				style={{ width: `${percent}%` }}
			/>
		</div>
	);
}
