"use server"
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lucia } from "~/lib/auth";
import { db, userTable } from "~/server/db/schema";

type ActionResult = {
	error: string | null;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function login(_: any, formData: FormData): Promise<ActionResult> {
	const username = formData.get("username");
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 
	) {
		return {
			error: "Invalid username",
		};
	}
	const password = formData.get("password");
	if (
		typeof password !== "string" ||
		password.length < 6 ||
		password.length > 255
	) {
		return {
			error: "Invalid password",
		};
	}

	const user: { id: string; username: string; password: string }[] = await db
		.select({
			id: userTable.id,
			username: userTable.username,
			password: userTable.hashed_password,
		})
		.from(userTable)
		.where(eq(userTable.username, username))
		.limit(1);
	if (!user || user.length === 0) {
		return {
			error: "Incorrect username or password",
		};
	}

	const existingUser = user[0];

	if (!existingUser?.password) {
		return {
			error: "Incorrect username or password",
		};
	}

	const validPassword = await new (await import("oslo/password")).Argon2id().verify(
		existingUser.password,
		password,
	);
	if (!validPassword) {
		return {
			error: "Incorrect username or password",
		};
	}

	const session = await lucia.createSession(existingUser?.id ?? "0", {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);
	return redirect("/");
}
