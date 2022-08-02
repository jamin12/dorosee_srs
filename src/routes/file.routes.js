"use strict";

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { userValidation } = require('../validations/index');
const { fileController } = require('../controller/index');
const upload = require('../util/file');

router
  .route('/insert')
  .post(upload.single('test'), fileController.output.index);




module.exports = router;