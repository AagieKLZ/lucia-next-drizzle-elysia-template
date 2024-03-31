import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { lucia } from "~/lib/auth";
import type { ActionResult } from "~/lib/form";
import { db, userTable } from "~/server/db/schema";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function login(_: any, formData: FormData): Promise<ActionResult> {
	"use server";
	const username = formData.get("username");
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
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

	const validPassword = await new Argon2id().verify(
		existingUser?.password ?? "",
		password,
	);
	if (!validPassword) {
		return {
			error: "Incorrect username or password",
		};
	}

	const session = await lucia.createSession(existingUser?.id ?? "0", {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	console.log({ sessionCookie });
	cookies().set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);
	return redirect("/");
}
