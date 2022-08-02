"use strict";

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { userValidation } = require('../validations/index');
const { fileController } = require('../controller/index');
const upload = require('../util/file');

router
  .route('/')
  .post(upload.single('file'), fileController.output.index);




module.exports = router;