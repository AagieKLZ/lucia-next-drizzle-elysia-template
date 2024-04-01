import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginLayout from "../layouts/login-layout";
import { LoginForm } from "./login-form";

export default async function Page() {
	const { user } = await validateRequest();
	if (user) {
		return redirect("/");
	}
	return (
		<LoginLayout>
			<div className="flex-1 flex flex-col justify-center items-center w-full min-w-[600px]">
				<h1>Sign in</h1>
				<LoginForm />
			</div>
		</LoginLayout>
	);
}
