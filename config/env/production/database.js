console.log("config/env/production/database.js");
const parse = require('pg-connection-string').parse;
module.exports = ({env}) => {
  console.log(`--NODE_ENV: ${env('NODE_ENV')}`);
  const config = parse(process.env.DATABASE_URL);
  return {
    defaultConnection: 'default',
    connections: {
      default: {
        connector: 'bookshelf',
        settings: {
          client: 'postgres',
          host: config.host,
          port: config.port,
          database: config.database,
          username: config.user,
          password: config.password,
          ssl: {
            rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false)
          }
        },
        options: {
          ssl: true,
          debug: false
        }
      }
    }
  };
};
