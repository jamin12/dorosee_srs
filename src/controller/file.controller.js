"use strict";

const logger = require("../config/logger");
const catchAsync = require("../util/catchAsync");
const UserService = require("../service/user.service");
const passport = require("passport");
const resultDto = require("../dto/resultDto");
const httpStatus = require("http-status");

const userservice = new UserService();

const output = {
	index: async (req, res, next) => {
		res.json({ test: "hihi", userid: req.user });
	},
};

const input = {

};

module.exports = {
	output,
	input,
};
