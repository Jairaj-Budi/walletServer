export default () => {
  return {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/wallet',
    },
    port: Number(process.env.PORT) || 3000,
  };
};
