import { redirect } from '@sveltejs/kit';
import { generateState } from 'arctic';

import type { RequestEvent } from '@sveltejs/kit';
import { github } from '$lib/server/github';

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const url = github.createAuthorizationURL(state, []);

	event.cookies.set('github_oauth_state', state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	return redirect(302, url.toString());
}
