# Fletch's News API
___
[![My Skills](https://skillicons.dev/icons?i=js,express,jest,nodejs,postgres,git,github)](https://skillicons.dev)

**Fletch's News is an API capable of fetching & posting articles, comments, users & topics.** This API is built with JavaScript, utilizing Express for handling of HTTP requests, Jest for testing, and Node.js for server-side scripting. Data is stored in a PostgreSQL database. For a complete list of endpoints, complete with descriptions, example responses & a list of possible queries, see `endpoints.json` located in the project's root directory.

🔗 Access the API using the following link:
`https://fletch-news.onrender.com`

## 🛠️ Getting Started
___
###### Fork & Clone
Fork the repo using the fork button in the top right of the screen. When the fork has been created, get the .git URL from your fork.

Create a new folder on your local machine (my_news_api) & clone to your local machine from a terminal open to this folder using the fork URL & the below command.
`git clone <URL_for_your_fork.git>`

Open the folder in your IDE. 

#### NPM
From a terminal open to the folder (my_news_api), run `npm install` to install project dependencies & packages.

A list of the available scripts is available in `package.json` under scripts. You can run these scripts using the command `npm run <script_key>`.

#### Environment Variables
Ensure you have a postgrSQL server running on your local machine. Follow [this link](https://notes.northcoders.com/courses/js-back-end/sql-setup) for instructions. Replace the database names in `setup.sql` to names of your choosing. Then run:
`npm run setup-dbs`
This will create the test & development databases.

This project uses environment variables to connect the the database. Create .env.test, .env.development & .env.production files in the root directory. Ensure to add these files to .gitignore to ensure your database configuration is not publically exposed. These files should contain the following:

###### .env.test
`PGDATABASE=your_db_test`

###### .env.development
`PGDATABASE=your_db`

###### .env.production
`DATABASE_URL=postgres://your-live-db-url.dbaasprovider.com`
In order to connect to the production database, you will need to setup a remote database using a DBaaS provider of your choosing. Follow [this link](https://notes.northcoders.com/courses/js-back-end/api-hosting) for instructions on how to setup a free postgreSQL database using ElephantSQL. 

See .env.example for further information on environment variables. 

#### Seeding
Seeding adds example data to the test, development & production databases. Use: 
`npm run seed` to add data to the development database. Use `npm run test` to add data to the testing database (note that seeding will take place automatically before each test using this command). 

See the above link for more information on seeding the production database & deploying the API remotely. 


## 🔢 Versions
___

| Tech       | Version | Command    | 
| ---------- | ------- | --- |
| Node.js    | v21.1.0 | `node -v`    |
| Express.js | 4.18.2  |   `npm show express version`  |
| Jest       | 29.7.0  |  `npm show jest version`   |
| PostgreSQL | 14.9    |  `psql --version`   |

