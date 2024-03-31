"use client";

import { useFormState } from "react-dom";

export function Form({
	children,
	action,
	...props
}: {
	children: React.ReactNode;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	action: (prevState: any, formData: FormData) => Promise<ActionResult>;
} & React.HTMLProps<HTMLFormElement>) {
	const [state, formAction] = useFormState(action, {
		error: null,
	});
	return (
		<form action={formAction} {...props}>
			{children}
			<p>{state.error}</p>
		</form>
	);
}

export interface ActionResult {
	error: string | null;
}
