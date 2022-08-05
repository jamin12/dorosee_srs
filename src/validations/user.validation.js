const Joi = require('joi');
const { password, mobile } = require('./custom.validation');

const createUser = {
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

const updateUser = {
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

const getUserInfo = {
  params: Joi.object().keys({
    username: Joi.string().required(),
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    username: Joi.string().required(),
  }),
};





module.exports = {
  createUser,
  login,
  updateUser,
  getUserInfo,
  deleteUser,
};
