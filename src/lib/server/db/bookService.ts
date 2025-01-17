import { type User, type BookType } from "$lib/types";
import { ObjectId } from "mongodb";
import { books, users } from ".";
import type { BookData } from "../../../routes/seed/books";

export const getSimilarBooks = async (
	book: BookData,
	userId: ObjectId,
	maxResults = 5,
): Promise<BookType[]> => {
	const genre = book.volumeInfo.categories;

	if (!genre) {
		return [];
	}

	const userFavourites = await users
		.findOne<User>({ _id: userId })
		.then((user) => user?.favouriteBooks ?? []);

	console.log("Finding similar books", genre, book._id, userFavourites);

	const similarBooks = await books
		.find<BookData>({
			"volumeInfo.categories": { $in: genre },
			_id: { $ne: book._id },
		})
		.limit(maxResults)
		.toArray()
		.then((books) =>
			books.map((book) => ({
				...book.volumeInfo,
				_id: book._id.toString(),
				isFavourite: userFavourites.includes(book._id),
			})),
		);

	return similarBooks;
};
