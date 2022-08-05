"use strict";

const logger = require("../config/logger");
const catchAsync = require("../util/catchAsync");
const { fileService } = require("../service/index");
const passport = require("passport");
const resultDto = require("../dto/resultDTO");
const httpStatus = require("http-status");

const fileservice = new fileService();

const output = {
	downLoadFile: catchAsync(async (req, res) => {
		const file = await fileservice.findByOriginalname(req.params.originalname);
		res.download(file.path.replace('\\','/'));
	}),
};

const input = {
	insertFile: catchAsync(async (req, res) => {
		let resultFile;
		const checkFile = await fileservice.findByOriginalname(req.file.originalname);
		// 파일이 존재하면 업데이트
		if(checkFile) resultFile =await fileservice.updateFile(checkFile.fid, req.file);
		// 없으면 생성
		else resultFile = await fileservice.createFile(req.file);
		res.send(resultDto(httpStatus.OK, "createFile success", resultFile));
	}),

	deleteFile: catchAsync(async (req, res) => {
		const deletedFile = await fileservice.findByOriginalname(req.params.originalname);
		await fileservice.deleteFile(deletedFile.fid);
		res.send(resultDto(httpStatus.OK, "deleteFile success", deletedFile));
	})
};


module.exports = {
	output,
	input,
};
