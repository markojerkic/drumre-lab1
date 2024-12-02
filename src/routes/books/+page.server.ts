import { books } from '$lib/server/db';
import type { Book } from '../seed/books';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const search = event.url.searchParams.get('search') ?? '';

	const foundBooks = await books
		.find({
			title: { $regex: new RegExp(search, 'i') }
		})
		.toArray();

	return {
		books: foundBooks.map(
			(book) => ({ ...book, _id: book._id.toString() }) as Book & { _id: string }
		),
		search
	};
};
