export interface BookData {
	id: string;
	volumeInfo: {
		title: string;
		authors?: string[];
		description?: string;
		categories?: string[];
		averageRating?: number;
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
