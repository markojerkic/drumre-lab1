import type { ObjectId } from "mongodb";
import type { BookData } from "../routes/seed/books";
import type { Show } from "../routes/seed/shows";

export type BookType = BookData["volumeInfo"] & {
	_id: string;
	isFavourite: boolean;
};

export type ShowType = Show & { _id: string; isFavourite: boolean };

export type User = {
	_id: ObjectId;
	userId: number;
	username: string;
	genres: string[];
	favouriteBooks?: ObjectId[];
	favouriteShows?: ObjectId[];
	data: {
		name: string;
		email: string;
		location?: string;
	};
};
