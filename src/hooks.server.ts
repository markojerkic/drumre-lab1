import type { Handle } from "@sveltejs/kit";
import * as auth from "$lib/server/auth.js";
import { connectDb } from "$lib/server/db";

connectDb()
	.then(() => console.log("Connected to database"))
	.catch((error) => console.error("Failed to connect to database", error));

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	console.log("sessionToken", sessionToken);
	if (!sessionToken) {
		console.log("no sessionToken");
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	console.log("session", session);
	console.log("user", user);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle: Handle = handleAuth;
