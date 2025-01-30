/* eslint-disable @typescript-eslint/no-unused-vars */
import { config } from 'dotenv';
config();

import * as fs from "fs";
import csv from "csv-parser";
import { Db } from '@datastax/astra-db-ts';
import { Stock, Trade} from './model';
import { getAstraClient} from "./astradb";


/**
 * Entry point for the seed script.
 */
populateDB().catch(error => {
    console.error(error);
    process.exit(-1);
});;
    


/**
 * This method is to seed the AstraDB with stock data.
 * 
 * Data seeding flow) will perform the following steps:
 * 1. Establishe a connection to the AstraDB using the Data API typescript client.
 * 2. Delete any existing data in the AstraDB.
 * 3. Read stock data from csv and inserts it into a collection in the AstraDB.
 * 4. Read trade data from csv and inserts it into a table in the AstraDB.
 * 
 */
async function populateDB() {

    const client = await getAstraClient();
    await deleteExistingDataInAstra(client)
    
    // Read stock data from csv and inserts it into a collection in the AstraDB.
    const stocks = await readFromStockAndInsertCollection(client);

    // Read trade data from csv and inserts it into the table in the AstraDB.
    await readFromTradeAndInsertTable(client, stocks);
}



/**
 * This method is to read stock data from a csv file and inserts into a collection in the AstraDB.
 * 
 * collection: stock_collection
 * cvs file: nasdaq_stocks.csv
 * csv file path: ./src/lib/datasets/nasdaq_stocks.csv
 */
async function readFromStockAndInsertCollection(client: Db): Promise<Stock[]> {
    console.log("Start to parsing nasdaq_stocks CSV. Inserting into database...");

    // Create or retrieve the collection
    const stock_collection = await client.createCollection("stock_collection");
  
    const stocks: Stock[] = [];
    const filePath = "./src/lib/datasets/nasdaq_stocks.csv"; 
  
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          const stock: Stock = {
            symbol: row["Symbol"],
            fullName: row["Name"],
          };
          stocks.push(stock);
        })
        .on("end", async () => {
          console.log("Finished parsing nasdaq_stocks CSV. Inserting into database...");
          try {
            await stock_collection.insertMany(stocks);
            console.log("collection stock_collection populated successfully!");
            resolve(stocks);
          } catch (error) {
            console.error("Error inserting data into database:", error);
            reject(error);
          }
        })
        .on("error", (error) => {
          console.error("Error reading CSV file:", error);
          reject(error);
        });
    });
  }

/**
 * This method is to read trades data from csv files and inserts into a table in the Astra database.
 * 
 * table: trade_table
 * csv file path: ./src/lib/datasets/${stockSymbol}_1Y.csv
 * Note, each trade data csv represents a single stock, and it contains trades metadata for 1 year.
 */
async function readFromTradeAndInsertTable(client: Db, stocks: Stock[]): Promise<void> {
    console.log("Start to parsing stock trades CSVs. Inserting into database...");

    const trade_table = await client.createTable('trade_table', {
        definition: {
          columns: {
            symbol: 'text',
            fullName: 'text',
            date: 'timestamp',
            high: 'float',
            low: 'float',
            open: 'float',
            close: 'float',
            volume: 'int',
          },
          primaryKey: {
            partitionBy: ['symbol'],
            partitionSort: { date : 1 },
          },
        },
        ifNotExists: true,
      });

    for (const stock of stocks) {
        const filePath = `./src/lib/datasets/${stock.symbol}_1Y.csv`; // Path to your CSV file for each stock

        await new Promise<void>((resolve, reject) => {
            const trades : Trade[] = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on("data", (row) => {
                    const trade = {
                        symbol: stock.symbol,
                        fullName: stock.fullName,
                        date: new Date(row["Date"]),
                        high: parseFloat(row["High"].replace('$', '')),
                        low: parseFloat(row["Low"].replace('$', '')),
                        open: parseFloat(row["Open"].replace('$', '')),
                        close: parseFloat(row["Close/Last"].replace('$', '')),
                        volume: parseInt(row["Volume"], 10),
                      };
                    trades.push(trade);
                })
                .on("end", async () => {
                    console.log(`Finished parsing ${stock.symbol}_1Y CSV. Inserting into database...`);
                    try {
                        await trade_table.insertMany(trades);
                        console.log(`table trade_table populated successfully for ${stock.symbol}!`);
                        resolve();
                    } catch (error) {
                        console.error(`Error inserting data into database for ${stock.symbol}:`, error);
                        reject(error);
                    }
                })
                .on("error", (error) => {
                    console.error(`Error reading CSV file for ${stock.symbol}:`, error);
                    reject(error);
                });
        });
    }
}




/**
 * Deletes existing data in Astra by truncating the specified collections and tables.
 * 
 * This function attempts to delete all rows from: 
 * 1. collectios: "stock_collection"
 * 2. table: "trade_table"
 * 
 */
async function deleteExistingDataInAstra(client: Db): Promise<void> {
    // Belowing deleteManycommands will truncate the Data API collection or table.
    // It does not matter if the collection or table does not exist, we will ignore the error
    // since table creation will take care of it.
    try {
        await client.collection("stock_collection").deleteMany({});
    } catch (error) {
    }
    try {
        await client.table("stock_table").deleteMany({});
    } catch (error) {
    }
  }


