import { shows } from '$lib/server/db';
import type { Show } from '../seed/shows';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const search = event.url.searchParams.get('search') ?? '';

	const foundShows = await shows
		.find({
			title: { $regex: new RegExp(search, 'i') }
		})
		.toArray();

	return {
		shows: foundShows
			.map((book) => ({ ...book, _id: book._id.toString() }) as Show & { _id: string })
			.filter((show) => show.title),
		search
	};
};
