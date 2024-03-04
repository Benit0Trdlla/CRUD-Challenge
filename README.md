All the necessary components to run the application.

Tools:
- Git 2.43.0
- Prisma 5.7.1
- Prisma/client 5.7.1
- Nodemon 3.0.2
- Node.js 20.10.0
- Npm 10.2.5
- Express 4.18.2
- Body-parser 1.20.2

After executing the bash script, it is necessary to proceed with configuring the .env file and establishing a connection to the respective database. In the .env file, you should input the database-related information, beginning with specifying the type of database to be used, such as mysql, sqlite, PostgreSQL, etc. The other required details include the username, password, port, and, finally, the name to be assigned to the database. For instance, the database URL format could be as follows: DATABASE_URL:"mysql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public".

IMPORTANT:
After configuring the .env file, run the command "npx prisma migrate dev --name NAME" in the visual studio code terminal.

Commands in case the bash script doesn't work:

Install dependencies:
```
 npm install

```

Initialize Prisma:
```
 npx prisma init

 Post the execution of this command, proceed to configure the .env file as explained earlier.
```

Command to start the application:

```
 npm run start-backend

```