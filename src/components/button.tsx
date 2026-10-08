import { ButtonHTMLAttributes } from "react";
import { ButtonSize, ButtonVariant, buttonClass } from "./button.styles";

export default function Button({
	variant,
	size,
	className,
	type = "button",
	...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
	size?: ButtonSize;
}) {
	return (
		<button
			type={type}
			className={buttonClass(variant, size, className)}
			{...props}
		/>
	);
}
