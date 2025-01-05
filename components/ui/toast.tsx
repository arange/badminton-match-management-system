// your-toast.jsx
import * as ToastPrimitive from "@radix-ui/react-toast";
import { RefAttributes } from "react";

export const Toast = ({ title, content, children, altText, ...props }: ToastPrimitive.ToastProps & RefAttributes<HTMLLIElement> & { altText?: string }) => {
	return (
		<ToastPrimitive.Root {...props}>
			{title && <ToastPrimitive.Title className="font-bold">{title}</ToastPrimitive.Title>}
			<ToastPrimitive.Description>{content}</ToastPrimitive.Description>
			{children && (
				<ToastPrimitive.Action altText={altText || 'action'} asChild>{children}</ToastPrimitive.Action>
			)}
			<ToastPrimitive.Close aria-label="Close" className="absolute top-4 right-8">
				<span aria-hidden>×</span>
			</ToastPrimitive.Close>
		</ToastPrimitive.Root>
	);
};
