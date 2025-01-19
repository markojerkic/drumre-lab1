import type { ObjectId } from "mongodb";

export type ShowsResult = PopularShow[];

export interface PopularShow {
	watchers: number;
	show: Show;
}

export interface Show {
	_id: ObjectId;
	title: string;
	year: number;
	ids: Ids;
	tagline: string;
	overview: string;
	first_aired: string;
	airs: Airs;
	runtime: number;
	certification: string;
	network: string;
	country: string;
	trailer?: string;
	trailerLink?: string;
	homepage: string;
	status: string;
	rating: number;
	votes: number;
	comment_count: number;
	updated_at: string;
	language: string;
	languages: string[];
	available_translations: string[];
	imageLinks?: {
		thumbnail: string;
	};
	genres: string[];
	aired_episodes: number;
}

export interface Ids {
	trakt: number;
	slug: string;
	tvdb: number;
	imdb: string;
	tmdb: number;
	tvrage: unknown;
}

export interface Airs {
	day: string;
	time: string;
	timezone: string;
}
