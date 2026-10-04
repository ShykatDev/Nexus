export default () => ({
  app: {
    name: process.env.APP_NAME ?? 'nexus-api',
    environment: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
  },

  database: {
    url: process.env.DATABASE_URL,
  },
});
