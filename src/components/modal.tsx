import { ReactNode, useEffect, useRef } from "react";

/**
 * Centered modal built on the native `<dialog>`. Closes on Escape and on backdrop click.
 */
export default function Modal({
	open,
	onClose,
	labelledBy,
	width = "max-w-md",
	className = "",
	children,
}: {
	open: boolean;
	onClose: () => void;
	labelledBy?: string;
	/** Tailwind max-width class */
	width?: string;
	className?: string;
	children: ReactNode;
}) {
	const dialogRef = useRef<HTMLDialogElement | null>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
	}, [open]);

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby={labelledBy}
			onClose={onClose}
			onCancel={(e) => {
				e.preventDefault();
				onClose();
			}}
			onClick={(e) => {
				// Clicks on the dialog element itself (not its content) are backdrop clicks
				if (e.target === e.currentTarget) onClose();
			}}
			className={`m-auto w-full ${width} rounded-2xl bg-white text-zinc-900 shadow-xl ring-1 ring-zinc-200 backdrop:bg-zinc-900/40 backdrop:backdrop-blur-[2px] ${className}`}
		>
			<div className="p-6">{children}</div>
		</dialog>
	);
}
