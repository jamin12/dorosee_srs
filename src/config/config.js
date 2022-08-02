const appRoot = require('app-root-path');
const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    HOST: Joi.string().required(),
    PORT: Joi.number().default(3000),
    // MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    MYSQL_HOST: Joi.string().required().description('MySQL host'),
    MYSQL_PORT: Joi.string().required().description('MySQL port'),
    MYSQL_USERNAME: Joi.string().required().description('MySQL username'),
    MYSQL_PASSWORD: Joi.string().required().description('MySQL password'),
    MYSQL_DATABASE: Joi.string().required().description('MySQL database'),
    // JWT_SECRET: Joi.string().required().description('JWT secret key'),
    // JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    // JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    // JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
    //   .default(10)
    //   .description('minutes after which reset password token expires'),
    // JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
    //   .default(10)
    //   .description('minutes after which verify email token expires'),
    // SMTP_HOST: Joi.string().description('server that will send the emails'),
    // SMTP_PORT: Joi.number().description('port to connect to the email server'),
    // SMTP_USERNAME: Joi.string().description('username for email server'),
    // SMTP_PASSWORD: Joi.string().description('password for email server'),
    // EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    // STORAGE_PATH: Joi.string().pattern(/^\/*/). description('root directory path to store image for upload file'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  host: envVars.HOST + (envVars.NODE_ENV === 'development' ? ':' + envVars.PORT : ''),
  port: envVars.PORT,
  // mongoose: {
  //   url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
  //   options: {
  //     useCreateIndex: true,
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true
  //   }
  // },
  mysql: {
    development: {
      host: envVars.MYSQL_HOST,
      port: envVars.MYSQL_PORT,
      username: envVars.MYSQL_USERNAME,
      password: envVars.MYSQL_PASSWORD,
      database: envVars.MYSQL_DATABASE,
      dialect: "mysql",
      debug: false,
      charset: 'utf8mb4',
      timezone: '+09:00',
      waitForConnections: true,
      connectionLimit: 20
    },
    production: {
      host: envVars.MYSQL_HOST,
      port: envVars.MYSQL_PORT,
      username: envVars.MYSQL_USERNAME,
      password: envVars.MYSQL_PASSWORD,
      database: envVars.MYSQL_DATABASE,
      dialect: "mysql",
      debug: false,
      charset: 'utf8mb4',
      timezone: '+09:00',
      waitForConnections: true,
      connectionLimit: 20
    }
  },
  // jwt: {
  //   secret: envVars.JWT_SECRET,
  //   accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  //   refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  //   resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
  //   verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
  // },
  // email: {
  //   smtp: {
  //     host: envVars.SMTP_HOST,
  //     port: envVars.SMTP_PORT,
  //     auth: {
  //       user: envVars.SMTP_USERNAME,
  //       pass: envVars.SMTP_PASSWORD
  //     }
  //   },
  //   from: envVars.EMAIL_FROM
  // },
  // storage: {
  //   appRoot: appRoot + '',
  //   root: envVars.STORAGE_PATH,
  //   tmp: envVars.STORAGE_PATH + '/tmp',
  // },
  session: {
    host: envVars.MYSQL_HOST,
    port: envVars.MYSQL_PORT,
    user: envVars.MYSQL_USERNAME,
    password: envVars.MYSQL_PASSWORD,
    database: envVars.MYSQL_DATABASE,
    expiration: 1000 * 60 * 60 * 2,
    clearExpired: true,
    checkExpirationInterval: 900000,
  }
};
