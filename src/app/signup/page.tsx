import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

import LoginLayout from "../layouts/login-layout";
import SignupForm from "./signup-form";

export default async function Page() {
	const { user } = await validateRequest();
	if (user) {
		return redirect("/");
	}
	return (
		<LoginLayout>
			<div className="flex-1 flex flex-col justify-center items-center w-full min-w-[600px]">
				<h1>Create an account</h1>
				<SignupForm />
			</div>
		</LoginLayout>
	);
}
