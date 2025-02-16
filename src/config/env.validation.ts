import * as Joi from 'joi';

export function validateEnv() {
  return Joi.object({
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    MONGO_URI: Joi.string().required(),
  });
}
