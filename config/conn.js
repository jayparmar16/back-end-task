require('dotenv').config()

const sqlConfig = {
  user: process.env.user_name,
  password: process.env.password,
  server: process.env.server,
  database: process.env.database,
}

module.exports = sqlConfig;
