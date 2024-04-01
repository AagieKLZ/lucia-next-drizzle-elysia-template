"use client";
import Link from "next/link";
import React from "react";
import { useFormState } from "react-dom";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import TextSeparator from "~/components/ui/text-separator";
import { signup } from "~/lib/actions/signup";

export default function SignupForm() {
	const [state, formAction] = useFormState(signup, null);
	return (
		<form
			// @ts-ignore
			action={formAction}
			className="w-full flex flex-col gap-3 max-w-lg"
		>
			<div>
				<Label htmlFor="username">Username</Label>
				<Input name="username" id="username" />
				<p className=" text-red-500 text-sm">{state?.error?.username}</p>
			</div>
			<div>
				<Label htmlFor="email">Email</Label>
				<Input name="email" type="email" id="email" />
				<p className=" text-red-500 text-sm">{state?.error?.email}</p>
			</div>
			<div>
				<Label htmlFor="password">Password</Label>
				<Input type="password" name="password" id="password" />
				<p className=" text-red-500 text-sm">{state?.error?.password}</p>
			</div>
			<div>
				<Label htmlFor="password">Repeat Password</Label>
				<Input type="password" name="password2" id="password2" />
				<p className=" text-red-500 text-sm">{state?.error?.password}</p>
			</div>
			<Button type="submit">Sign Up</Button>
			<TextSeparator text="OR" />
			<Link href="/login" className=" w-full">
				<Button variant={"outline"} className=" w-full">
					Log in
				</Button>
			</Link>
		</form>
	);
}
