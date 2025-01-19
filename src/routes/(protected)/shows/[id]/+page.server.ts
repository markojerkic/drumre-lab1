import { shows, users } from "$lib/server/db";
import type { User } from "$lib/types";
import { ObjectId } from "mongodb";
import type { PageServerLoad } from "./$types";
import { json } from "@sveltejs/kit";
import { getSimilarShows } from "$lib/server/db/showService";
import type { Show } from "../../../seed/shows";

export const load: PageServerLoad = async (event) => {
	const user: User = event.locals.user!;
	const id = ObjectId.createFromHexString(event.params.id);
	const show = await shows.findOne<Show>({ _id: id });
	if (!show) {
		return json({ error: "show not found" }, { status: 404 });
	}

	const similarShows = getSimilarShows(show, user._id, 10);

	const usersFavouriteShows = await users
		.findOne<User>({ _id: user._id })
		.then((user) => user?.favouriteShows ?? [])
		.then((favourites: ObjectId[]) => favourites.map((favourite) => favourite.toString()));
	const isUsersFavourite = usersFavouriteShows?.includes(show._id.toString()) ?? false;

	const showData = {
		...show,
		trailerLink: getTrailerLink(show),
		_id: show._id.toString()
	};

	return {
		show: showData,
		isUsersFavourite,
		similarShows
	};
};

const getTrailerLink = (show: Show) => {
	if (!show.trailer) {
		return null;
	}
	const url = new URL(show.trailer);
	const searchParams = new URLSearchParams(url.search);
	return `https://www.youtube.com/embed/${searchParams.get("v")}`;
};
