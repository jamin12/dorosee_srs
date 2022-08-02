"use strict";

const logger = require("../config/logger");
const catchAsync = require("../util/catchAsync");
const UserService = require("../service/user.service");
const passport = require("passport");
const resultDto = require("../dto/resultDTO");
const httpStatus = require("http-status");

const userservice = new UserService();

const output = {
	index: async (req, res, next) => {
		res.json({ test: "hihi", userid: req.user });
	},
};

const input = {
	createUser: catchAsync(async (req, res) => {
		await userservice.createUser(req.body);
		res.send(resultDto(httpStatus.CREATED, "create success"));
	}),

	updateUser: catchAsync(async (req, res) => {
		await userservice.updateUser(req.params, req.body);
    res.send(resultDto(httpStatus.OK, "update success"));
	}),
};

module.exports = {
	output,
	input,
};
