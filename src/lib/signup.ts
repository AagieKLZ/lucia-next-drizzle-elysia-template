import { Argon2id } from "oslo/password";
import type { ActionResult } from "./form";
import { generateId } from "lucia";
import { db, userTable } from "~/server/db/schema";
import { lucia } from "./auth";
import { cookies } from "next/headers";
import type { DrizzleError } from "drizzle-orm";
import { redirect } from "next/navigation";

// biome-ignore lint/suspicious/noExplicitAny: This is a form handler
export async function signup(_: any, formData: FormData): Promise<ActionResult> {
	"use server";
	const username = formData.get("username");
	// username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
	// keep in mind some database (e.g. mysql) are case insensitive
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

	const email = formData.get("email");
	if (
		typeof email !== "string" ||
		email.length < 6 ||
		email.length > 255 ||
		!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
	) {
		return {
			error: "Invalid email",
		};
	}

	const hashedPassword = await new Argon2id().hash(password);
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
		console.error({ cause, stack, message });
		if (
			msg.message.includes("duplicate key value violates unique constraint")
		) {
			return {
				error: "Username or email already used",
			};
		}
		return {
			error: "An unknown error occurred",
		};
	}
	return redirect("/");
}
