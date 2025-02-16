
export default () => ({

        MONGO_URI: process.env.DB || 'mongodb://localhost:27017/walletDB?replicaSet=rs0',
      
    });
    