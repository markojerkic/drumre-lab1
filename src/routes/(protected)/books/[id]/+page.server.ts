import { books, users } from "$lib/server/db";
import type { User } from "$lib/types";
import { ObjectId } from "mongodb";
import type { BookData } from "../../../seed/books";
import type { PageServerLoad } from "./$types";
import { json } from "@sveltejs/kit";
import { getSimilarBooks } from "$lib/server/db/bookService";

export const load: PageServerLoad = async (event) => {
	const user: User = event.locals.user!;
	const id = ObjectId.createFromHexString(event.params.id);
	const book = await books.findOne<BookData>({ _id: id });
	if (!book) {
		return json({ error: "Book not found" }, { status: 404 });
	}

	const similarBooks = getSimilarBooks(book, user._id, 10);

	const usersFavouriteBooks = await users
		.findOne<User>({ _id: user._id })
		.then((user) => user?.favouriteBooks ?? [])
		.then((favourites: ObjectId[]) =>
			favourites.map((favourite) => favourite.toString()),
		);
	const isUsersFavourite =
		usersFavouriteBooks?.includes(book._id.toString()) ?? false;

	const bookData = {
		...book.volumeInfo,
		_id: book._id.toString(),
	};

	return {
		book: bookData,
		isUsersFavourite,
		similarBooks,
	};
};
