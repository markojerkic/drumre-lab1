import { books, users } from "$lib/server/db";
import { fail, type Actions } from "@sveltejs/kit";
import type { BookData } from "../../seed/books";
import type { BookType } from "$lib/types";
import type { PageServerLoad } from "./$types";
import { ObjectId } from "mongodb";

export const load: PageServerLoad = async (event) => {
	const search = event.url.searchParams.get("search") ?? "";
	const cursor = Number.parseInt(event.url.searchParams.get("cursor") ?? "0");

	const userFavourites = await users
		.findOne({ _id: event.locals.user!._id })
		.then((user) => user?.favouriteBooks ?? [])
		.then((favourites: ObjectId[]) => favourites.map((favourite) => favourite.toString()));

	const foundBooksResult = books
		.find(
			{
				"volumeInfo.title": { $regex: new RegExp(search, "i") }
			},
			{ projection: { volumeInfo: 1 } }
		)
		.skip(cursor)
		.limit(50);

	const totalForSearch = await books.countDocuments({
		"volumeInfo.title": { $regex: new RegExp(search, "i") }
	});

	const hasNext = totalForSearch > cursor + 50;
	const foundBooks = (await foundBooksResult.toArray()) as {
		_id: ObjectId;
		volumeInfo: BookData;
	}[];

	return {
		books: foundBooks.map(
			(book) =>
				({
					...book.volumeInfo,
					_id: book._id.toString(),
					isFavourite: userFavourites.includes(book._id.toString())
				}) as unknown as BookType
		),
		search,
		cursor: cursor + foundBooks.length,
		hasNext,
		total: totalForSearch
	};
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		if (locals.session === null) {
			return fail(401);
		}
		const id = await request.formData().then((data) => data.get("id"));
		if (!id || typeof id !== "string") {
			return fail(400, {
				message: "No id provided"
			});
		}
		const objectId = new ObjectId(id);
		await books.deleteOne({ _id: objectId });
	},
	addFavourite: async ({ request, locals }) => {
		if (locals.session === null) {
			return fail(401);
		}
		const id = await request.formData().then((data) => data.get("id"));
		if (!id || typeof id !== "string") {
			return fail(400, {
				message: "No id provided"
			});
		}
		const objectId = new ObjectId(id);
		const user = locals.user!;
		users.updateOne({ _id: user._id }, { $addToSet: { favouriteBooks: objectId } });
	},
	removeFavourite: async ({ request, locals }) => {
		if (locals.session === null) {
			return fail(401);
		}
		const id = await request.formData().then((data) => data.get("id"));
		if (!id || typeof id !== "string") {
			return fail(400, {
				message: "No id provided"
			});
		}
		const objectId = new ObjectId(id);
		const user = locals.user!;
		users.updateOne({ _id: user._id }, { $pull: { favouriteBooks: objectId } });
	}
};
