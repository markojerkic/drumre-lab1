import { type User, type BookType } from "$lib/types";
import { ObjectId } from "mongodb";
import { books, users } from ".";
import type { BookData } from "../../../routes/seed/books";

export const getSimilarBooks = async (
	book: BookData,
	userId: ObjectId,
	maxResults = 5
): Promise<BookType[]> => {
	const genre = book.volumeInfo.categories;

	if (!genre) {
		return [];
	}

	const userFavourites = await users
		.findOne<User>({ _id: userId })
		.then((user) => user?.favouriteBooks?.map((fav) => fav.toString()) ?? []);

	console.log("Finding similar books", genre, book._id, userFavourites);

	const similarBooks = await books
		.find<BookData>({
			"volumeInfo.categories": {
				$in: genre.map((genre) => new RegExp("^" + genre + "$", "i"))
			},
			_id: { $ne: book._id }
		})
		.limit(maxResults)
		.toArray()
		.then((books) =>
			books.map((book) => ({
				...book.volumeInfo,
				_id: book._id.toString(),
				isFavourite: userFavourites.includes(book._id.toString())
			}))
		);

	return similarBooks;
};

export const getBookRecomedations = async (
	genres: string[],
	userId: ObjectId,
	maxResults = 5
): Promise<BookType[]> => {
	const userFavourites = await users
		.findOne<User>({ _id: userId })
		.then((user) => user?.favouriteBooks ?? []);

	const recommendations = await books
		.find<BookData>({
			"volumeInfo.categories": {
				$in: genres.map((genre) => new RegExp("^" + genre + "$", "i"))
			},

			_id: { $nin: userFavourites }
		})
		.limit(maxResults)
		.toArray()
		.then((books) =>
			books.map((book) => ({
				...book.volumeInfo,
				_id: book._id.toString(),
				isFavourite: userFavourites.includes(book._id)
			}))
		);
	console.log("recommendations", recommendations);

	return recommendations;
};
