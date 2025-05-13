require('dotenv').config();

const config = {
  port: process.env.PORT || 4000,
  database: {
    url: process.env.DATABASE_URL
  },
  jwt: {
    secret: process.env.JWT_SECRET
  }
};

module.exports = { config }; 