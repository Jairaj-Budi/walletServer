export default () => ({
  MONGODB_URI:
    process.env.MONGODB_URI ||
    'mongodb+srv://wallet:walletProject@cluster0.ulxx5.mongodb.net/wallet',
});
