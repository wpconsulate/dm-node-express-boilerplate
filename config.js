const dotenv = require('dotenv');

dotenv.load();

let Config = {
    // APP_URL: "http://159.65.132.45:3300",
    APP_URL: "http://localhost:3300",

    DB_HOST: "localhost",
    DB_NAME: "litehq",
    DB_USER: "root",
    DB_PASS: "Scorp5683",
    SENDGRID_API_KEY: "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", //Sengrid_API Key
    MAILCHIMP_API_KEY: "d6a33be5e07c61cdb0e6fc79f256d54c-us19",
    MAILCHIMP_INSTANCE: "us19",
    MAILCHIMP_LIST_ID: "ddc3c49cd9",
    MAILCHIMP_API_BASE: 'https://us19.api.mailchimp.com/3.0',
    
    //Email COnfig
    EMAIL_FROM:"noreply@litehq.me",
    PORT:3300,
    CRYPT_ROUNDS:10,

    CRON_INTERVAL: 1,   // In Minutes
    JWT_SECRET: 'secret',   // In Minutes
    JWT_EXPIRATION_IN_SECONDS: 36000,
    PASS_SALT: "L1TEh@5683",
    RESET_TOKEN_SIZE: 6
};

const config = Object.assign(
    {},
    {
      DB_HOST: process.env.DB_HOST || Config.DB_HOST,
      DB_NAME: process.env.DB_NAME || Config.DB_NAME,
      DB_USER: process.env.DB_USER || Config.DB_USER,
      DB_PASS: process.env.DB_PASS || Config.DB_PASS,

      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || Config.SENDGRID_API_KEY,

      MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY || Config.MAILCHIMP_API_KEY,
      MAILCHIMP_INSTANCE: process.env.MAILCHIMP_INSTANCE || Config.MAILCHIMP_INSTANCE,
      MAILCHIMP_LIST_ID: process.env.MAILCHIMP_LIST_ID || Config.MAILCHIMP_LIST_ID,
      MAILCHIMP_API_BASE: process.env.MAILCHIMP_API_BASE || Config.MAILCHIMP_API_BASE,

      APP_URL: process.env.APP_URL || Config.APP_URL,
      EMAIL_FROM: process.env.EMAIL_FROM || Config.EMAIL_FROM,
      CRON_INTERVAL: process.env.CRON_INTERVAL || Config.CRON_INTERVAL,
      RESET_TOKEN_SIZE: process.env.RESET_TOKEN_SIZE || Config.RESET_TOKEN_SIZE,
      PORT: process.env.PORT || Config.PORT,
      PASS_SALT: process.env.PASS_SALT || Config.PASS_SALT,
      CRYPT_ROUNDS: parseInt(process.env.CRYPT_ROUNDS) || Config.CRYPT_ROUNDS,

      JWT_SECRET: process.env.JWT_SECRET || Config.JWT_SECRET,
      JWT_EXPIRATION_IN_SECONDS: process.env.JWT_EXPIRATION_IN_SECONDS || Config.JWT_EXPIRATION_IN_SECONDS
      
    }
  );

module.exports = config;