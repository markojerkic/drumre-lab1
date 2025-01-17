import { books, shows, users } from "$lib/server/db";
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async (event) => {
	const bookGenres = books
		.distinct("volumeInfo.categories")
		.then((categories: string[]) => {
			return categories.map((category) => category.toLowerCase());
		});

	const showGenres = await shows.distinct("genres").then((genres: string[]) => {
		return genres.map((genre) => genre.toLowerCase());
	});

	const userSavedGenres = users
		.findOne({ _id: event.locals.user!._id })
		.then((user) => user?.genres ?? []);

	const [g1, g2, userGenres] = await Promise.all([
		bookGenres,
		showGenres,
		userSavedGenres,
	]);
	const genres = new Set([...g1, ...g2]);

	return {
		genres: Array.from(genres),
		userGenres,
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const selectedGenres = await request
			.formData()
			.then((data) => data.getAll("genres"));
		const user = locals.user;

		users.updateOne({ _id: user!._id }, { $set: { genres: selectedGenres } });

		return redirect(302, "/");
	},
};
