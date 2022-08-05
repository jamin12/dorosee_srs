"use strict";

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { userValidation } = require('../validations/index');
const { userController } = require('../controller/index');

router
  .route('/')
  .get(auth('user'), userController.output.getUsersInfo)
  .post(validate(userValidation.createUser), userController.input.createUser);

router
  .route('/:username')
  .get(auth('user'), validate(userValidation.getUserInfo), userController.output.getUserInfo)
  .patch(auth('user'), validate(userValidation.updateUser), userController.input.updateUser)
  .delete(auth('user'), validate(userValidation.deleteUser), userController.input.deleteUser);



module.exports = router;