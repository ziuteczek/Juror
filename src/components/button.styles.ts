export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "icon";

const base =
	"inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap select-none cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
	primary: "bg-accent text-white shadow-sm hover:bg-accent-hover",
	secondary:
		"bg-white text-zinc-800 shadow-xs ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50",
	ghost: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
	danger: "text-red-600 hover:bg-red-50",
};

const sizes: Record<ButtonSize, string> = {
	sm: "h-8 px-3 text-sm",
	md: "h-9 px-4 text-sm",
	icon: "size-9",
};

/**
 * Class names for button-looking elements. Used by `Button` and by router `Link`s that should look like buttons.
 */
export const buttonClass = (
	variant: ButtonVariant = "secondary",
	size: ButtonSize = "md",
	extra = "",
) => [base, variants[variant], sizes[size], extra].join(" ");
