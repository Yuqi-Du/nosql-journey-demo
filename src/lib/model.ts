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
 * This method is to read stocks data from a collection in AstraDB.
 */
export async function getStocksFromAstra(): Promise<Stock[]> {
    if(stocks.length > 0){
        return stocks;
    }
    const dbClient = await getAstraClient();

    const stock_client = dbClient.collection("stock_collection");

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
        if (error.message.includes("Collection does not exist")) {
            console.error("Collection does not exist:", error);
            return stocks;
        }
        console.error("Error getting data from database:", error);
        throw error;
    }
}


/**
 * This method is to read trades data from a table in AstraDB.
 */
export async function getTradesFromAstra( stockSymbol: string): Promise<Trade[]> {
    const dbClient = await getAstraClient();

    const trade_client = dbClient.table("trade_table");
    const trades: Trade[] = []; 

    try {
        const cursor =  trade_client.find({symbol: stockSymbol});
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
        if (error.message.includes("Collection does not exist")) {
            console.error("Collection does not exist:", error);
            return trades;
        }
        console.error("Error getting data from database:", error);
        throw error;
    }
}
