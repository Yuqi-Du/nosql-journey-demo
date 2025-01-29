**Welcome to the SKO NoSQL journey!**
You are seeing the stock data fullStack demo app. This app is built using [AstraDB](https://docs.datastax.com/en/astra-db-serverless/index.html), [Astra Data API](https://docs.datastax.com/en/astra-db-serverless/api-reference/dataapiclient.html), [Data API TypeScript client](https://docs.datastax.com/en/astra-db-serverless/api-reference/typescript-client.html), [Next.js](https://nextjs.org/docs), and [Vercel](https://vercel.com/).

In this journey, you will follow the README to implement the app in two paths:
1. **Data API Collection**: [Learn more](https://docs.datastax.com/en/astra-db-serverless/api-reference/collections.html)
2. **Data API Table**: [Learn more](https://docs.datastax.com/en/astra-db-serverless/api-reference/tables.html)

You will see the app UI on your local machine and eventually deploy it to Vercel.

We aim to provide an experience where you can appreciate the fast speed of Astra for reading/writing data, the ease of using the Data API for interacting with your Astra DB, and the seamless transition between using Data API collections and tables.

[Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



## Prerequisites

To get started with this project, ensure you have the following:

- **Node.js**: Version 22 or above. 
- **Astra DB**: Obtain the endpoint and token.
- **GitHub Account**: For git operation and vercel use.
- **Vercel Account**: For deploying the app in vercel.

### Astra DB prerequisites
1. Create a database in astra.
2. Get the endpoint and token.
![database details example](./public/astra-requirements.png)


## project Structure

The project directory is organized as follows:
(To minimize the distractions, we will only introduce the some components, and emphesize the parts you will be working on)

```
/nosql-journey-demo
├── .env, 
├── .env.example 
├── node_modules
├── package.json
├── package-lock.json
├── README.md
├── README1.md
├── /src
│   ├── /app
│   │   ├── /dashboard
│   │   │   ├── /[symbol]
│   │   |   ├── page.tsx
│   ├── /components
│   │   ├── /ui
│   │   ├── data-table.tsx
│   ├── /lib
│   │   ├── /datasets
│   │   │   ├── NVDA_1Y.csv
│   │   │   ├── MSFT_1Y.csv
│   │   │   ├── (other dataset files...)
│   │   ├── seed.ts
│   │   ├── model.ts
│   │   ├── astradb.ts
```

- `/.env.example`: File for you to copy and create .env file.
- `/src/app/dashboard/page.tsx`: Stock dashboard component that you will see in the UI.
- `/libs/datasets`: Nasdaq stocks and trades csv data files.
- `/libs/model.ts`: Export data model and also funtions to read corresponding data from Astra.
- `/libs/astradb.ts`: Export Data API typescript Astra client.
- `/libs/datasets`: Nasdaq stocks and trades csv data files.
- `/seed.ts`: Data preparation script to read data files and populate into Astra DB.
- `.gitignore`: Specifies files to be ignored by Git.
- `README.md`: Project documentation.
- `package.json`: Project dependencies and scripts.
- `next.config.js`: Next.js configuration file.



## NoSQL Journey



### Create .env file
By now you should have Astra DB endpoint and token ready.
Then you can reference the [.env.example](./env.example) file, and create a new file ".env".

> ASTRA_URI="YOUR_ASTRA_DB_ENDPOINT"
> ASTRA_TOKEN="YOUR_ASTRA_TOKEN"
> USE_COLLECTION="true" # Please set to "true" first, this is the flag indicates whether to use collection or table in the demo app.


### Populate Astra DB (collection path)
Have a look at [seed.ts](./src/lib/seed.ts) script file.
This file is for reading stocks and trades csv data files and then inserting into Astra DB.

> Note the script has two paths, collection or tables. It means the demo app will be supported by Astra Data API collection or table. The path will be determined by the USE_COLLECTION enviroment variable you just set in .env file.

Run the script with following command.
```sh
npm run seed
```

After the script finished, you can check on your data explorer in AstraDB portal.

![collections in AstraDB](./public/check-astra-portal.png)

> Note since we set the app path as collection, you can see two collections instead of tables are created and populated. 



### Start the app (collection path)
Now we have the data ready in your AstraDB, then we can start the app in your local and see how it looks with Astra support!

Since it is the first time running the app, install all the dependencies first.
```sh
npm install
```

Then start the app with following command.
```sh
npm run dev
```

Once the app is ready, bring the front-end UI up in [http://localhost:3000](http://localhost:3000)


### Populate Astra DB (table path)
Instead of using a Data API collection, Astra Data API has a new feature previewed, which is Data API tables. Now you can read/write on a regular cassandra table by using Astra Data API.

Now change the USE_COLLECTION variable to "false" in your .env file to indicate the app will be using Data API tables.

Run the script with following command.
```sh
npm run seed
```

After the script finished, you can check on your data explorer in AstraDB portal. You can see there are two additional tables in your DB.

![tables in AstraDB](./public/tables-astra.png)


### Start the app (table path)
Without restart the app, you can see the UI brings up successfully, that is all supported by Data API tables.



## Deploying to Vercel
To deploy the app to Vercel, follow these steps:

