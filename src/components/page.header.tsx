import { ReactNode } from "react";

/**
 * Sticky top bar with a title on the left and actions on the right.
 */
export default function PageHeader({
	leading,
	title,
	subtitle,
	actions,
}: {
	leading?: ReactNode;
	title: ReactNode;
	subtitle?: ReactNode;
	actions?: ReactNode;
}) {
	return (
		<header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/85 backdrop-blur">
			<div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-6 py-4">
				{leading}
				<div className="min-w-0 flex-1">
					<h1 className="truncate text-lg font-semibold tracking-tight">
						{title}
					</h1>
					{subtitle && (
						<p className="truncate text-sm text-zinc-500">{subtitle}</p>
					)}
				</div>
				{actions && (
					<div className="flex flex-wrap items-center gap-2">{actions}</div>
				)}
			</div>
		</header>
	);
}
