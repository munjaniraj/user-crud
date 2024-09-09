import mysql from "serverless-mysql";

export const database = mysql({
  config: {
    host: process.env.MYSQL_ROOT_HOST,
    port: process.env.MYSQL_ROOT_PORT,
    user: process.env.MYSQL_ROOT_USERNAME,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_ROOT_DATABASE,
  },
});
