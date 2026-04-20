// Sequelize models are initialized using CommonJS.
// Using require here to ensure compatibility with Sequelize config setup.
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_SCHEMA,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
  },
};
