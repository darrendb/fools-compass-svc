console.log("config/database.js");
const parse = require('pg-connection-string').parse;
const config = parse(process.env.DATABASE_URL);

module.exports = ({env}) => {
    const cur_env = env('NODE_ENV');
    console.log(`  NODE_ENV: ${cur_env}`);
    if (cur_env === "development") {
        console.log(config)
    }
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
