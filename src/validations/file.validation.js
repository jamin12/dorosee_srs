const Joi = require('joi');
const { password, mobile } = require('./custom.validation');

const getFile = {
  params: Joi.object()
    .keys({
      originalname: Joi.string().required(),
    })
};

const deleteFile = {
  params: Joi.object()
    .keys({
      originalname: Joi.string().required(),
    })
};;





module.exports = {
  deleteFile,
  getFile
};
