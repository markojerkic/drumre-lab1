import { shows, users } from "$lib/server/db";
import { fail, type Actions } from "@sveltejs/kit";
import type { Show } from "../../seed/shows";
import type { PageServerLoad } from "./$types";
import { ObjectId } from "mongodb";

export const load: PageServerLoad = async (event) => {
	const search = event.url.searchParams.get("search") ?? "";
	const cursor = Number.parseInt(event.url.searchParams.get("cursor") ?? "0");

	const userFavourites = await users
		.findOne({ _id: event.locals.user!._id })
		.then((user) => user?.favouriteShows ?? [])
		.then((favourites: ObjectId[]) =>
			favourites.map((favourite) => favourite.toString()),
		);

	const foundShowsResult = shows
		.find({
			title: { $regex: new RegExp(search, "i") },
		})
		.skip(cursor)
		.limit(50);

	const foundShows = await foundShowsResult.toArray();
	const totalForSearch = await shows.countDocuments({
		title: { $regex: new RegExp(search, "i") },
	});
	const hasNext = totalForSearch > cursor + 50;

	return {
		shows: foundShows
			.map(
				(show) =>
					({
						...show,
						_id: show._id.toString(),

						isFavourite: userFavourites.includes(show._id.toString()),
					}) as Show & { _id: string; isFavourite: boolean },
			)
			.filter((show) => show.title),
		search,
		cursor: cursor + foundShows.length,
		hasNext,
		total: totalForSearch,
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
				message: "No id provided",
			});
		}
		const objectId = new ObjectId(id);
		await shows.deleteOne({ _id: objectId });
	},
	addFavourite: async ({ request, locals }) => {
		if (locals.session === null) {
			return fail(401);
		}
		const id = await request.formData().then((data) => data.get("id"));
		if (!id || typeof id !== "string") {
			return fail(400, {
				message: "No id provided",
			});
		}
		const objectId = new ObjectId(id);
		const user = locals.user!;
		users.updateOne(
			{ _id: user._id },
			{ $addToSet: { favouriteShows: objectId } },
		);
	},
	removeFavourite: async ({ request, locals }) => {
		if (locals.session === null) {
			return fail(401);
		}
		const id = await request.formData().then((data) => data.get("id"));
		if (!id || typeof id !== "string") {
			return fail(400, {
				message: "No id provided",
			});
		}
		const objectId = new ObjectId(id);
		const user = locals.user!;
		users.updateOne({ _id: user._id }, { $pull: { favouriteShows: objectId } });
	},
};
