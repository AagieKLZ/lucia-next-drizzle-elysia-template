import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

type ActionResult = {
	error: string | null;
};

export default async function Page() {
	const { user } = await validateRequest();
	if (!user) {
		return redirect("/login");
	}
	return (
		<>
			<h1>Hi, {user.username}!</h1>
			<p>Your user ID is {user.id}.</p>
			<p>Your email is {user.email}</p>
			<form action={logout}>
				<button type="submit">Sign out</button>
			</form>
		</>
	);
}

async function logout(): Promise<ActionResult> {
	"use server";
	const { session } = await validateRequest();
	if (!session) {
		return {
			error: "Unauthorized",
		};
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);
	return redirect("/login");
}
