import { json } from '@sveltejs/kit';
import { NY_TIMES_API_KEY, TRAKT_API_CLIENT_ID } from '$env/static/private';
import { books, shows } from '$lib/server/db';
import type { BookSeedResult } from './books';
import type { ShowsResult } from './shows';

export async function GET(): Promise<Response> {
	const [books, shows] = await Promise.allSettled([seedBooks(), seedShows()]);
	if (books.status === 'rejected' || shows.status === 'rejected') {
		return json({ message: 'Error seeding books or shows' }, { status: 500 });
	}

	return json({ message: 'Books seeded' });
}

async function seedShows() {
	let page = 0;
	const limit = 100;

	while (page < 100) {
		console.log('Fetching page', page);
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('trakt-api-version', '2');
		headers.append('trakt-api-key', TRAKT_API_CLIENT_ID);
		const response: ShowsResult = await fetch(
			`https://api.trakt.tv/shows/popular?extended=full&page=${page}&limit=${limit}`,
			{
				headers
			}
		).then((res) => res.json());

		if (!response.length) {
			console.log('no shows found', response);
			break;
		}

		try {
			await shows.insertMany(response);
		} catch (e) {
			console.log('error savins shows', e);
		}

		page++;
	}

	console.log('Done seeding shows');
}

async function seedBooks() {
	let offset = 0;

	let i = 0;
	while (i < 10000) {
		console.log(
			`https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?api-key=${NY_TIMES_API_KEY}&offset=${offset}`
		);
		const response: BookSeedResult = await fetch(
			`https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?api-key=${NY_TIMES_API_KEY}&offset=${offset}`
		).then((res) => res.json());

		if (!response.results?.length) {
			// @ts-expect-error - this is a hack to get around the fact that the API is returning a 200 status code
			if (response.fault.detail.errorcode === 'policies.ratelimit.QuotaViolation') {
				console.log('API rate limit reached. Wait a minute and try again.');
				await new Promise((r) => setTimeout(r, 60000));
				continue;
			}

			console.log('no books found', response);
			break;
		}

		try {
			await books.insertMany(response.results);
		} catch (e) {
			console.log('error', e);
		}
		offset += response.results.length;

		// Rate limiting
		await new Promise((r) => setTimeout(r, 2000));
		i++;
	}
}
