const Joi = require('joi');
const { password, mobile } = require('./custom.validation');

const create = {
  body: Joi.object()
    .keys({
      username: Joi.string().required(),
      password: Joi.string().required().custom(password),
      role: Joi.string(),
      details: {
        name: Joi.string(),
        mobile: Joi.string().custom(mobile),
        memo: Joi.string(),
      },
    })
};

const update = {
  params: Joi.object().keys({
    username: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      username: Joi.string(),
      password: Joi.string().custom(password),
      role: Joi.string(),
      details: {
        name: Joi.string(),
        mobile: Joi.string().custom(mobile),
        memo: Joi.string(),
      },
    })
};

const login = {
  body: Joi.object()
    .keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
    })
    .min(1),
};





module.exports = {
  create,
  login,
  update,
};
