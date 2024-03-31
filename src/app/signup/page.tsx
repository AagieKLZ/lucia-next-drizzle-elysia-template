import Link from "next/link";

import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Form } from "@/lib/form";
import { generateId } from "lucia";

import type { ActionResult } from "@/lib/form";
import { db, userTable } from "~/server/db/schema";
import type { DrizzleError } from "drizzle-orm";
import { signup } from "~/lib/signup";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import LoginLayout from "../layouts/login-layout";
import TextSeparator from "~/components/ui/text-separator";

export default async function Page() {
	const { user } = await validateRequest();
	if (user) {
		return redirect("/");
	}
	return (
		<LoginLayout>
			<div className="flex-1 flex flex-col justify-center items-center w-full min-w-[600px]">
				<h1>Create an account</h1>
				<Form
					// @ts-ignore
					action={signup}
					className="w-full flex flex-col gap-3 max-w-lg"
				>
					<Label htmlFor="username">Username</Label>
					<Input name="username" id="username" />
					<Label htmlFor="email">Email</Label>
					<Input name="email" type="email" id="email" />
					<Label htmlFor="password">Password</Label>
					<Input type="password" name="password" id="password" />
					<Button type="submit">Sign Up</Button>
					<TextSeparator text="OR" />
					<Link href="/login" className=" w-full">
						<Button variant={"outline"} className=" w-full">
							Log in
						</Button>
					</Link>
				</Form>
			</div>
		</LoginLayout>
	);
}
