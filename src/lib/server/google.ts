import { Google } from "arctic";
import { env } from "$env/dynamic/private";

export type GoogleUser = {
	id: number;
	googleId: string;
	iss: string;
	azp: string;
	aud: string;
	sub: string;
	at_hash: string;
	name: string;
	picture: string;
	given_name: string;
	family_name: string;
	email: string;
};

export const google = new Google(
	env.GOOGLE_CLIENT_ID,
	env.GOOGLE_CLIENT_SECRET,
	"http://localhost:5173/login/google/callback",
);
