import type { RequestEvent } from "@sveltejs/kit";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase64url, encodeHexLowerCase } from "@oslojs/encoding";
import { db, sessions, users } from "$lib/server/db";
import { ObjectId } from "mongodb";
import type { User } from "$lib/types";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = "auth-session";

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session = {
		sessionId: sessionId,
		userId: userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30),
	};
	await sessions.insertOne(session);
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session = await sessions.findOne({ sessionId: sessionId });

	if (!session) {
		return { session: null, user: null };
	}

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await sessions.deleteOne({ sessionId: sessionId });
		return { session: null, user: null };
	}

	const user = await users.findOne<User>(
		{ userId: session.userId },
		{ projection: { _id: 1, username: 1 } },
	);
	if (!user) {
		return { session: null, user: null };
	}

	const renewSession =
		Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await sessions.updateOne(
			{ sessionId: sessionId },
			{ $set: { expiresAt: session.expiresAt } },
		);
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<
	ReturnType<typeof validateSessionToken>
>;

export async function invalidateSession(sessionId: string) {
	await sessions.deleteOne({ _id: new ObjectId(sessionId) });
}

export function setSessionTokenCookie(
	event: RequestEvent,
	token: string,
	expiresAt: Date,
) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: "/",
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: "/",
	});
}

export async function getUserByUsername(username: string): Promise<User> {
	return (await users.findOne({
		username,
	})) as unknown as Promise<User>;
}

export async function getUserFromGitHubId(githubId: number) {
	return await users.findOne({
		userId: githubId,
	});
}

export async function getUserFromGoogleId(githubId: number) {
	return await users.findOne({
		userId: githubId,
	});
}

export async function createUser(
	githubId: number,
	githubUsername: string,
	data: { name: string; email: string; location: string },
) {
	const user = {
		userId: githubId,
		username: githubUsername,
		data,
	};
	await users.insertOne(user);
	return user;
}
