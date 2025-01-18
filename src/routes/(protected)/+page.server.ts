import { fail, redirect, type Actions } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";
import {
	deleteSessionTokenCookie,
	getUserByUsername,
	invalidateSession,
} from "$lib/server/auth";
import { books, shows } from "$lib/server/db";
import type { BookData } from "../seed/books";
import { type Show } from "../seed/shows";
import { getShowRecomedations } from "$lib/server/db/showService";
import { getBookRecomedations } from "$lib/server/db/bookService";

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		return redirect(302, "/login");
	}

	const userData = await getUserByUsername(user.username);
	if (!userData) {
		return redirect(302, "/login");
	}

	const recomendedShows = getShowRecomedations(userData.genres, user._id);
	const recomendedBooks = getBookRecomedations(userData.genres, user._id);

	const usersFavouriteBooks = await books
		.find<BookData>({ _id: { $in: userData.favouriteBooks ?? [] } })
		.toArray()
		.then((books) =>
			(books as unknown as BookData[]).map((book) => ({
				...book.volumeInfo,
				_id: book._id.toString(),
				isFavourite: true,
			})),
		);

	const userFavouriteShows = await shows
		.find<Show>({ _id: { $in: userData.favouriteShows ?? [] } })
		.toArray()
		.then((shows) =>
			shows.map((show) => ({
				...show,
				_id: show._id.toString(),
				isFavourite: true,
			})),
		);

	const userResponse = {
		...userData,
		favouriteBooks: undefined,
		favouriteShows: undefined,
		_id: userData?._id.toString(),
	};

	return {
		user: userResponse,
		favouriteBooks: usersFavouriteBooks,
		favouriteShows: userFavouriteShows,
		recomendedShows,
		recomendedBooks,
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (event.locals.session === null) {
			return fail(401);
		}
		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		return redirect(302, "/login");
	},
};
