"use server";
import { Argon2id } from "oslo/password";
// import type { ActionResult } from "./form";
import { generateId } from "lucia";
import { db, userTable } from "~/server/db/schema";
import { lucia } from "../auth";
import { cookies } from "next/headers";
import type { DrizzleError } from "drizzle-orm";
import { redirect } from "next/navigation";

type ActionResult = {
	error: {
		username: string | null;
		email: string | null;
		password: string | null;
	} | null;
}

// biome-ignore lint/suspicious/noExplicitAny: This is a form handler
export async function signup(_: any, formData: FormData): Promise<ActionResult> {
	const username = formData.get("username");
	// username must be between 4 ~ 31 characters
	// keep in mind some database (e.g. mysql) are case insensitive
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return {
			error: {
				username: "Invalid username",
				email: null,
				password: null,
			}
		};
	}
	const password = formData.get("password");
	if (
		typeof password !== "string" ||
		password.length < 6 ||
		password.length > 255
	) {
		return {
			error: {
				username: null,
				email: null,
				password: "Invalid password",
			}
		};
	}

	const email = formData.get("email");
	if (
		typeof email !== "string" ||
		email.length < 6 ||
		email.length > 255 ||
		!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
	) {
		return {
			error: {
				username: null,
				email: "Invalid email",
				password: null,
			}
		};
	}

	const password2 = formData.get("password2");
	if (password !== password2) {
		return {
			error: {
				username: null,
				email: null,
				password: "Passwords do not match",
			}
		};
	}

	const hashedPassword = await new (await import("oslo/password")).Argon2id().hash(password);
	const userId = generateId(15);

	try {
		await db.insert(userTable).values({
			id: userId,
			username,
			email,
			hashed_password: hashedPassword,
		});

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
	} catch (e) {
		const msg = e as unknown as DrizzleError;
		const { cause, stack, message } = msg;
		if (
			msg.message.includes("duplicate key value violates unique constraint")
			) {
				return {
					error: {
						username: "Username or email already exists",
						email: "Username or email already exists",
						password: null,
					}
				};
			}
			console.error({ cause, stack, message });
			return {
			error: {
				username: null,
				email: null,
				password: "An error occurred",
			}
		};
	}
	return redirect("/");
}
