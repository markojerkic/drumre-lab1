import { createUser, getUserFromGitHubId } from '$lib/server/auth';
import { github } from '$lib/server/github';
import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';

import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('github_oauth_state') ?? null;
	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} catch (e) {
		// Invalid code or client credentials
		console.error(e);
		return new Response(null, {
			status: 400
		});
	}
	const githubUserResponse = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`
		}
	});
	const githubUser = await githubUserResponse.json();
	const githubUserId = githubUser.id;
	const githubUsername = githubUser.login;

	const existingUser = await getUserFromGitHubId(githubUserId);

	if (existingUser) {
		const sessionToken = generateSessionToken();
		console.log('sessionToken', sessionToken);
		const session = await createSession(sessionToken, existingUser.userId);
		console.log('session', session);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	}

	console.log('creating user with githubUserId', githubUserId);
	const user = await createUser(githubUserId, githubUsername);
	console.log('user', user);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, String(user.userId));
	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
}
