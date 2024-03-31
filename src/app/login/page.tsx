import Link from "next/link";

import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Form } from "@/lib/form";
import { login } from "../../lib/login";
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
				<h1>Sign in</h1>
				<Form
					// @ts-ignore
					action={login}
					className="w-full  flex flex-col gap-3 max-w-lg"
				>
					<div className="w-full">
						<Label htmlFor="username">Username</Label>
						<Input className="w-full" name="username" id="username" />
					</div>
					<div>
						<Label htmlFor="password">Password</Label>
						<Input type="password" name="password" id="password" />
					</div>
					<Button type="submit">Log In</Button>
					<TextSeparator text="OR" />
					<Link href="/signup" className=" w-full max-w-lg">
						<Button variant={"outline"} className=" w-full">
							Create an account
						</Button>
					</Link>
				</Form>
			</div>
		</LoginLayout>
	);
}
