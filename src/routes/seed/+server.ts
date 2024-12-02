import { json } from '@sveltejs/kit';
import {
	NY_TIMES_API_KEY,
	TRAKT_API_CLIENT_ID,
	TRAKT_API_CLIENT_SECRET
} from '$env/static/private';
import { books } from '$lib/server/db';

export async function GET(): Promise<Response> {
	//await seedBooks();
	await seedShows();

	return json({ message: 'Books seeded' });
}

async function seedShows() {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('trakt-api-version', '2');
	headers.append('trakt-api-key', TRAKT_API_CLIENT_ID);
	const response = await fetch('https://api.trakt.tv/shows/trending');

	console.log(response.ok, response.status, response.statusText, TRAKT_API_CLIENT_ID);
}

async function seedBooks() {
	let offset = 0;

	let i = 0;
	while (i < 1000) {
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
export interface BookSeedResult {
	status: string;
	copyright: string;
	num_results: number;
	results: Result[];
}

export interface Result {
	title: string;
	description?: string;
	contributor?: string;
	author: string;
	contributor_note?: string;
	price: string;
	age_group?: string;
	publisher?: string;
	isbns: Isbn[];
	ranks_history: RanksHistory[];
	reviews: Review[];
}

export interface Isbn {
	isbn10: string;
	isbn13: string;
}

export interface RanksHistory {
	primary_isbn10: string;
	primary_isbn13: string;
	rank: number;
	list_name: string;
	display_name: string;
	published_date: string;
	bestsellers_date: string;
	weeks_on_list: number;
	rank_last_week: number;
	asterisk: number;
	dagger: number;
}

export interface Review {
	book_review_link: string;
	first_chapter_link?: string;
	sunday_review_link: string;
	article_chapter_link?: string;
}
