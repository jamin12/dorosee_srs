"use strict";

const logger = require("../config/logger");
const catchAsync = require("../util/catchAsync");
const UserService = require("../service/user.service");
const passport = require("passport");
const resultDto = require("../dto/resultDTO");
const httpStatus = require("http-status");

const userservice = new UserService();

const output = {
	getUsersInfo: catchAsync(async (req, res) => {
		const users = await userservice.getUsersinfo()
		res.send(resultDto(httpStatus.OK, 'user list', users));
	}),
	getUserInfo: catchAsync(async (req, res) => {
		const user = await userservice.getUserinfo(req.params.username)
		res.send(resultDto(httpStatus.OK, 'user', user));
	}),
};

const input = {
	createUser: catchAsync(async (req, res) => {
		await userservice.createUser(req.body);
		res.send(resultDto(httpStatus.CREATED, "create success"));
	}),

	updateUser: catchAsync(async (req, res) => {
		await userservice.updateUser(req.params.username, req.body);
    res.send(resultDto(httpStatus.OK, "update success"));
	}),

	deleteUser: catchAsync(async (req, res) => {
		await userservice.deleteUser(req.params.username);
		res.send(resultDto(httpStatus.OK, "delete success"));
	}),
};

module.exports = {
	output,
	input,
};
