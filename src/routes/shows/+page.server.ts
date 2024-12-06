import { shows } from '$lib/server/db';
import type { Show } from '../seed/shows';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const search = event.url.searchParams.get('search') ?? '';
	const cursor = Number.parseInt(event.url.searchParams.get('cursor') ?? '0');

	const foundShowsResult = shows
		.find({
			title: { $regex: new RegExp(search, 'i') }
		})
		.skip(cursor)
		.limit(50);

	const hasNext = await foundShowsResult.hasNext();
	const foundShows = await foundShowsResult.toArray();
	const totalForSearch = await shows.countDocuments({
		title: { $regex: new RegExp(search, 'i') }
	});

	return {
		shows: foundShows
			.map((book) => ({ ...book, _id: book._id.toString() }) as Show & { _id: string })
			.filter((show) => show.title),
		search,
		cursor: cursor + foundShows.length,
		hasNext,
		total: totalForSearch
	};
};
