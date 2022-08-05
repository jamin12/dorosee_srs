var DataTypes = require("sequelize").DataTypes;
var _files = require("./files");
var _sessions = require("./sessions");
var _user_details = require("./user_details");
var _users = require("./users");

function initModels(sequelize) {
  var files = _files(sequelize, DataTypes);
  var sessions = _sessions(sequelize, DataTypes);
  var user_details = _user_details(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);


  return {
    files,
    sessions,
    user_details,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
