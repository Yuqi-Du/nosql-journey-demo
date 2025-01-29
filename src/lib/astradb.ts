"use server";
import { config } from 'dotenv';
config();

import { DataAPIClient } from '@datastax/astra-db-ts';

if (!process.env.ASTRA_URI) {
  throw new Error('Invalid/Missing environment variable: "ASTRA_URI"');
}
if (!process.env.ASTRA_TOKEN) {
    throw new Error('Invalid/Missing environment variable: "ASTRA_TOKEN"');
}
if (!process.env.USE_COLLECTION) {
    throw new Error('Invalid/Missing environment variable: "USE_COLLECTION"');
}

const astra_uri = process.env.ASTRA_URI;
const astra_token = process.env.ASTRA_TOKEN;

const client = new DataAPIClient(astra_token)
const db = client.db(astra_uri);

/**
 * This method is to get a Data API typescript AstraDB client.
 * Since "typescript client does not validate the existence of the database, it simply creates a reference",
 * we need to call listCollections() to check if the database exists.
 */
export async function getAstraClient() {
  try {
    await db.listCollections();
    return db;
  } catch (e) {
    throw e;
  }
}

/**
 * USE_COLLECTION is variable acts as a switcher to decide whether to use collection or table for the demo app.
 */
export async function use_collection() {
    return await (process.env.USE_COLLECTION === "true" ? true : false);
}
