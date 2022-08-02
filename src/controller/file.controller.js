"use strict";

const logger = require("../config/logger");
const catchAsync = require("../util/catchAsync");
const UserService = require("../service/user.service");
const passport = require("passport");
const resultDto = require("../dto/resultDTO");
const httpStatus = require("http-status");

const userservice = new UserService();

const output = {
	index: catchAsync(async (req, res) => {
		res.send("good");
	}),
};

const input = {

};


module.exports = {
	output,
	input,
};
