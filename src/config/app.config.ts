
export default () => ({
  PORT: parseInt(process.env.PORT || '3000', 10),
  ENVIRONMENT: process.env.NODE_ENV || 'development'
  });
  