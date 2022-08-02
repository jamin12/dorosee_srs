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

	logout: catchAsync((req, res) => {
		req.session.destroy();
		// TODO: 로그아웃 url 지정
		res.send("/");
	}),
};

const input = {
	login: catchAsync(async (req, res, next) => {
		await passport.authenticate('local', (err, user) => {
			if (err || !user) {
				return res.status(httpStatus.BAD_REQUEST).send({ message: "login error" });
			}
			req.login(user, (error) => {
				if (error) {
					return res.status(httpStatus.BAD_REQUEST).send({ message: "login error" });
				}else return res.send({ message: "login success" });
			});
		})(req, res, next);
	}),
};

module.exports = {
	output,
	input,
};
