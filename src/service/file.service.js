const { files, sequelize } = require("../models/index");
const { v4: uuid } = require('uuid');
const logger = require("../config/logger");
const CustomError = require("../util/Error/customError");
const httpStatus = require("http-status");
const pick = require("../util/pick");

class FileService {
	constructor() {
	}

  async findLastOne(updateType){
    const lastOne = await files.findOne({
      order:[[updateType, 'DESC']]
    })

    return lastOne;
  }

  async findByOriginalname(originalname){
    const result_file = await files.findOne({
      where:{
        originalname:originalname
      }
    })
    if(!result_file) throw new CustomError(httpStatus.BAD_REQUEST, "File not found!");
    return result_file;
  }

  async createFile(fileInfo){
    fileInfo.fid = uuid();
    fileInfo.ext = `.${fileInfo.originalname.split('.')[1]}`
    await files.create(
      fileInfo
    )

    return await this.findLastOne('created_at');
  }

  async updateFile(fileId, fileInfo){
    fileInfo.ext = `.${fileInfo.originalname.split('.')[1]}`
    files.update(fileInfo, {
      where:{
        fid: fileId
      }
    });
    return await this.findLastOne('updated_at');
  }

  async deleteFile(fileId){
    files.destroy({
      where:{
        fid: fileId
      }
    });
  }
}

module.exports = FileService;
