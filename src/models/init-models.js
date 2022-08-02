var DataTypes = require("sequelize").DataTypes;
var _user_details = require("./user_details");
var _users = require("./users");

function initModels(sequelize) {
  var user_details = _user_details(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);


  return {
    user_details,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
