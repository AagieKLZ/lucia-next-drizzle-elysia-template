"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import TextSeparator from "~/components/ui/text-separator";
import { login } from "~/lib/actions/login";

export function LoginForm() {
	const [state, formAction] = useFormState(login, null);
	const { pending } = useFormStatus();
	return (
		<form
			// @ts-ignore
			action={formAction}
			className="w-full  flex flex-col gap-3 max-w-lg"
		>
			<div className="w-full">
				<Label htmlFor="username">Username</Label>
				<Input className="w-full" name="username" id="username" />
			</div>
			<div>
				<Label htmlFor="password">Password</Label>
				<Input
					type="password"
					name="password"
					id="password"
					className={`${state?.error ? "border border-red-500" : ""}`}
				/>
				<p className=" text-red-500">{state?.error}</p>
			</div>
			<Button disabled={pending} type="submit">
				{pending ? "Loading..." : "Sign in"}
			</Button>
			<TextSeparator text="OR" />
			<Link href="/signup" className=" w-full max-w-lg">
				<Button variant={"outline"} className=" w-full">
					Create an account
				</Button>
			</Link>
		</form>
	);
}
