module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  host: env('APP_HOST', '0.0.0.0'),
  port: env.int('PORT', 1937),
  port: env.int('NODE_PORT', 1937),
  admin: {
    auth: {
      events: {
        onConnectionSuccess(e) {
          console.log("server.onConnectionSuccess()");
          console.log(e.user, e.provider);
        },
        onConnectionError(e) {
          console.log("server.onConnectionError()");
          console.error(e.error, e.provider);
        },
      },
      secret: env('ADMIN_JWT_SECRET', '38a44c0055f32dd47b6d4842220699a4'),
    },
    url: env('PUBLIC_ADMIN_URL', '/dashboard')
  },
});
