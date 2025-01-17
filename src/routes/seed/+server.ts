import { json } from "@sveltejs/kit";
import { NY_TIMES_API_KEY, TRAKT_API_CLIENT_ID } from "$env/static/private";
import { books, shows } from "$lib/server/db";
import type { ShowsResult } from "./shows";
import type { BookData } from "./books";

export async function GET(): Promise<Response> {
	await seedBooks();

	//const [books, shows] = await Promise.allSettled([seedBooks(), seedShows()]);
	//if (books.status === "rejected" || shows.status === "rejected") {
	//	return json({ message: "Error seeding books or shows" }, { status: 500 });
	//}

	return json({ message: "Books seeded" });
}

async function seedShows() {
	let page = 0;
	const limit = 100;

	while (page < 100) {
		console.log("Fetching page", page);
		const headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("trakt-api-version", "2");
		headers.append("trakt-api-key", TRAKT_API_CLIENT_ID);
		const response: ShowsResult = await fetch(
			`https://api.trakt.tv/shows/popular?extended=full&page=${page}&limit=${limit}`,
			{
				headers,
			},
		).then((res) => res.json());

		if (!response.length) {
			console.log("no shows found", response);
			break;
		}

		try {
			await shows.insertMany(response);
		} catch (e) {
			console.log("error savins shows", e);
		}

		page++;
	}

	console.log("Done seeding shows");
}

async function seedBooks() {
	const maxResults = 1000;
	const language = "en";
	const startIndex = 0;
	const orderBy = "relevance";

	const API_BASE_URL = "https://www.googleapis.com/books/v1/volumes";
	let currentIndex = startIndex;
	const batchSize = 40; // Google Books API max items per request
	const searchQuery = "subject:*";

	let savedBooks = 0;

	try {
		while (savedBooks < maxResults) {
			const searchParams = new URLSearchParams();
			searchParams.set("q", searchQuery);
			searchParams.set("langRestrict", language);
			searchParams.set("startIndex", currentIndex.toString());
			searchParams.set(
				"maxResults",
				Math.min(batchSize, maxResults - savedBooks).toString(),
			);
			searchParams.set("orderBy", orderBy);

			const response = await fetch(
				`${API_BASE_URL}?${searchParams.toString()}`,
			).then((res) => res.json());

			console.log("response", response);
			const items: BookData[] = response.items || [];
			if (items.length === 0) break; // No more results

			savedBooks += items.length;
			currentIndex += items.length;

			// Add a small delay to avoid hitting rate limits
			//await new Promise((resolve) => setTimeout(resolve, 1000));
			for (const book of items) {
				console.log(
					"Inserting book",
					book.volumeInfo.title,
					book.volumeInfo.categories,
				);
			}
			books.insertMany(items);
		}
	} catch (error) {
		console.error("Error seeding books", error);
	}
}
