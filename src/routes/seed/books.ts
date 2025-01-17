import type { ObjectId } from "mongodb";

export interface BookData {
	_id: ObjectId;
	id: string;
	volumeInfo: {
		title: string;
		authors?: string[];
		description?: string;
		categories?: string[];
		averageRating?: number;
		pageCount?: number;
		subtitle?: string;
		language?: string;
		publisher?: string;
		previewLink?: string;
		imageLinks?: {
			thumbnail?: string;
		};
		publishedDate?: string;
	};
}

export interface FetchBooksOptions {
	maxResults?: number;
	language?: string;
	startIndex?: number;
	orderBy?: "relevance" | "newest";
}
