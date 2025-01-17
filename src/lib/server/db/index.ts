import { env } from "$env/dynamic/private";
import { MongoClient } from "mongodb";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
if (!env.DATABASE_NAME) throw new Error("DATABASE_URL is not set");

const client = new MongoClient(env.DATABASE_URL); // Replace with your MongoDB connection string

export async function connectDb() {
	console.log("Connecting to database");
	// set database

	return client.connect();
}

export const db = client.db(env.DATABASE_NAME);
export const sessions = db.collection("sessions");
export const users = db.collection("users");
export const books = db.collection("books");
export const shows = db.collection("shows");
