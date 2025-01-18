import { type ShowType, type User } from "$lib/types";
import { ObjectId } from "mongodb";
import { shows, users } from ".";
import type { Show } from "../../../routes/seed/shows";

export const getSimilarShows = async (
	show: Show,
	userId: ObjectId,
	maxResults = 5,
): Promise<ShowType[]> => {
	const genre = show.genres;

	if (!genre) {
		return [];
	}

	const userFavourites = await users
		.findOne<User>({ _id: userId })
		.then((user) => user?.favouriteShows ?? []);

	console.log("Finding similar books", genre, show._id, userFavourites);

	const similarShows = await shows
		.find<Show>({
			genres: { $in: genre },
			_id: { $ne: show._id },
		})
		.limit(maxResults)
		.toArray()
		.then((shows) =>
			shows.map((show) => ({
				...show,
				_id: show._id.toString(),
				isFavourite: userFavourites.includes(show._id),
			})),
		);

	return similarShows as ShowType[];
};

export const getShowRecomedations = async (
	genres: string[],
	userId: ObjectId,
	maxResults = 5,
): Promise<ShowType[]> => {
	const userFavourites = await users
		.findOne<User>({ _id: userId })
		.then((user) => user?.favouriteShows ?? []);

	const recommendations = await shows
		.find<Show>({
			genres: {
				$in: genres.map((genre) => new RegExp("^" + genre + "$", "i")),
			},

			_id: { $nin: userFavourites },
		})
		.limit(maxResults)
		.toArray()
		.then((shows) =>
			shows.map((show) => ({
				...show,
				_id: show._id.toString(),
				isFavourite: userFavourites.includes(show._id),
			})),
		);

	return recommendations as ShowType[];
};
