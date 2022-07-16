const mysql = require('mysql2');
const env = require('dotenv');
env.config();
const pool = mysql
  .createPool({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  })
  .promise();

module.exports = pool;
