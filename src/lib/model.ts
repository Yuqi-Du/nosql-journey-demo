import { getAstraClient } from "./astradb";

export type Stock = {
    symbol: string;
    fullName: string;
};

export type Trade = {
    symbol: string;
    fullName: string;
    date: Date;
    high: number;
    low: number;
    open: number;
    close: number;
    volume: number;
};

const stocks : Stock[] = [];

/**
 * This method is to read stocks data from AstraDB.
 * Note, it takes a table name as parameter, and return a list of stocks.
 * So, this table name can from a
 * 1. Collection
 * 2. Table
 */
export async function getStocksFromAstra(isCollection: boolean): Promise<Stock[]> {
    if(stocks.length > 0){
        return stocks;
    }
    const dbClient = await getAstraClient();

    let stock_client;
    if(isCollection){
        stock_client = dbClient.collection("stock_collection");
    }else{
        stock_client = dbClient.table("stock_table");
    }

    try {
        const cursor =  stock_client.find({});
        for await (const row of cursor) {
            const stock: Stock = {
                symbol: row.symbol, 
                fullName: row.fullName,
            };
            stocks.push(stock);
        }
        return stocks;
    }catch(error){
        console.error("Error getting data from database:", error);
        throw error;
    }
}


/**
 * This method is to read trades data from AstraDB.
 * Note, it takes a table name as parameter, and return a list of stocks.
 * So, this table name can from a
 * 1. Collection
 * 2. Table
 */
export async function getTradesFromAstra(isCollection: boolean, stockSymbol: string): Promise<Trade[]> {
    const dbClient = await getAstraClient();

    let trade_client;
    if(isCollection){
        trade_client = dbClient.collection("trade_collection");
    }else{
        trade_client = dbClient.table("trade_table");
    }
    

    try {
        const cursor =  trade_client.find({symbol: stockSymbol});
        const trades: Trade[] = []; 
        for await (const document of cursor) {
            const trade: Trade = {
                symbol: document.symbol, 
                fullName: document.fullName,
                date: document.date,
                high: document.high,
                low: document.low,
                open: document.open,
                close: document.close,
                volume: document.volume,
            };
            trades.push(trade);
        }
        return trades;
    }catch(error){
        console.error("Error getting data from database:", error);
        throw error;
    }
}
