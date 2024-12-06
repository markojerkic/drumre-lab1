import { books } from '$lib/server/db';
import type { Book } from '../seed/books';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const search = event.url.searchParams.get('search') ?? '';
	const cursor = Number.parseInt(event.url.searchParams.get('cursor') ?? '0');

	const foundBooksResult = books
		.find({
			title: { $regex: new RegExp(search, 'i') }
		})
		.skip(cursor)
		.limit(50);

	const totalForSearch = await books.countDocuments({
		title: { $regex: new RegExp(search, 'i') }
	});

	const foundBooks = await foundBooksResult.toArray();
	const hasNext = await foundBooksResult.hasNext();

	return {
		books: foundBooks.map(
			(book) => ({ ...book, _id: book._id.toString() }) as Book & { _id: string }
		),
		search,
		cursor: cursor + foundBooks.length,
		hasNext,
		total: totalForSearch
	};
};
