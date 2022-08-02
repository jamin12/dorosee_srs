"use strict";

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { userValidation } = require('../validations/index');
const { authController } = require('../controller');

router
  // OAuth2 로그인 
  .route('/login')
  .post(validate(userValidation.login) ,authController.input.login);

router
  // 세션 만료
  .route('/logout')
  .get(auth('user'), authController.output.logout)

module.exports = router;