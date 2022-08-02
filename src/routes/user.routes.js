"use strict";

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { userValidation } = require('../validations/index');
const { userController } = require('../controller/index');

router
  .route('/')
  .get(userController.output.index)
  .post(validate(userValidation.create), userController.input.createUser);

router
  .route('/:username')
  .patch(validate(userValidation.update), userController.input.updateUser);



module.exports = router;