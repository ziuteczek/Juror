import { ReactNode } from "react";

/**
 * Stroke icons (Lucide style). They inherit color from `currentColor`, so they follow the text color.
 */
function Icon({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			className={`size-4 shrink-0 ${className}`}
		>
			{children}
		</svg>
	);
}

type IconProps = { className?: string };

export const PlusIcon = (p: IconProps) => (
	<Icon {...p}>
		<path d="M5 12h14" />
		<path d="M12 5v14" />
	</Icon>
);

export const XIcon = (p: IconProps) => (
	<Icon {...p}>
		<path d="M18 6 6 18" />
		<path d="m6 6 12 12" />
	</Icon>
);

export const ArrowLeftIcon = (p: IconProps) => (
	<Icon {...p}>
		<path d="m12 19-7-7 7-7" />
		<path d="M19 12H5" />
	</Icon>
);

export const ChevronLeftIcon = (p: IconProps) => (
	<Icon {...p}>
		<path d="m15 18-6-6 6-6" />
	</Icon>
);

export const ChevronRightIcon = (p: IconProps) => (
	<Icon {...p}>
		<path d="m9 18 6-6-6-6" />
	</Icon>
);

export const CheckIcon = (p: IconProps) => (
	<Icon {...p}>
		<path d="M20 6 9 17l-5-5" />
	</Icon>
);

export const TrashIcon = (p: IconProps) => (
	<Icon {...p}>
		<path d="M3 6h18" />
		<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
		<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
	</Icon>
);

export const ResetIcon = (p: IconProps) => (
	<Icon {...p}>
		<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
		<path d="M3 3v5h5" />
	</Icon>
);

export const DownloadIcon = (p: IconProps) => (
	<Icon {...p}>
		<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
		<path d="m7 10 5 5 5-5" />
		<path d="M12 15V3" />
	</Icon>
);

export const ImageIcon = (p: IconProps) => (
	<Icon {...p}>
		<rect width="18" height="18" x="3" y="3" rx="2" />
		<circle cx="9" cy="9" r="2" />
		<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
	</Icon>
);

export const ImagePlusIcon = (p: IconProps) => (
	<Icon {...p}>
		<path d="M16 5h6" />
		<path d="M19 2v6" />
		<path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" />
		<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
		<circle cx="9" cy="9" r="2" />
	</Icon>
);

export const FolderPlusIcon = (p: IconProps) => (
	<Icon {...p}>
		<path d="M12 10v6" />
		<path d="M9 13h6" />
		<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
	</Icon>
);

export const MergeIcon = (p: IconProps) => (
	<Icon {...p}>
		<circle cx="18" cy="18" r="3" />
		<circle cx="6" cy="6" r="3" />
		<path d="M6 21V9a9 9 0 0 0 9 9" />
	</Icon>
);

export const PlayIcon = (p: IconProps) => (
	<Icon {...p}>
		<path d="M6 3 20 12 6 21Z" />
	</Icon>
);

export const AlbumsIcon = (p: IconProps) => (
	<Icon {...p}>
		<rect width="7" height="7" x="3" y="3" rx="1" />
		<rect width="7" height="7" x="14" y="3" rx="1" />
		<rect width="7" height="7" x="14" y="14" rx="1" />
		<rect width="7" height="7" x="3" y="14" rx="1" />
	</Icon>
);
