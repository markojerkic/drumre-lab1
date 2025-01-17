import {
	generateSessionToken,
	createSession,
	setSessionTokenCookie,
	getUserFromGoogleId,
	createUser,
} from "$lib/server/auth";
import { google, type GoogleUser } from "$lib/server/google";
import { decodeIdToken } from "arctic";

import type { RequestEvent } from "@sveltejs/kit";
import type { OAuth2Tokens } from "arctic";

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("google_oauth_state") ?? null;
	const codeVerifier = event.cookies.get("google_code_verifier") ?? null;
	if (
		code === null ||
		state === null ||
		storedState === null ||
		codeVerifier === null
	) {
		return new Response(null, {
			status: 400,
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400,
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		console.error("Error validationg auth code", e);
		// Invalid code or client credentials
		return new Response(null, {
			status: 400,
		});
	}
	const claims = decodeIdToken(tokens.idToken()) as GoogleUser;
	const googleUserId = claims.sub;
	const username = claims.name;

	// TODO: Replace this with your own DB query.
	const existingUser = await getUserFromGoogleId(+googleUserId);

	if (existingUser !== null) {
		const sessionToken = generateSessionToken();
		console.log("sessionToken", sessionToken);
		const session = await createSession(sessionToken, existingUser.userId);
		console.log("session", session);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/",
			},
		});
	}

	// TODO: Replace this with your own DB query.
	const user = await createUser(+googleUserId, username, {
		email: "",
		location: "",
		name: claims.name,
	});

	console.log("created user", user);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, String(user.userId));
	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: {
			Location: "/",
		},
	});
}
