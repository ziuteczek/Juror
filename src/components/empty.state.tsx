import { ReactNode } from "react";

export default function EmptyState({
	icon,
	title,
	description,
	children,
}: {
	icon: ReactNode;
	title: string;
	description: string;
	/** Action buttons */
	children?: ReactNode;
}) {
	return (
		<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
			<div className="mb-4 grid size-12 place-items-center rounded-full bg-accent-soft text-accent">
				{icon}
			</div>
			<h2 className="text-base font-semibold">{title}</h2>
			<p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
			{children && (
				<div className="mt-6 flex flex-wrap justify-center gap-2">
					{children}
				</div>
			)}
		</div>
	);
}
