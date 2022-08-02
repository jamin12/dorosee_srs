const LocalStrategy = require('passport-local').Strategy;
const UserService = require('../../service/user.service');
const { users } = require('../../models/index');

const localOptions = {
  usernameField: 'username',
  passwordField: 'password',
};

const loclaVerify = async (username, password, done) => {
  const userservice = new UserService();
  try {
    if (await userservice.isPasswordMatchByUsername(username, password)) {
      const user = await users.findOne({
        where:{
          username: username
        }
      });
      done(null, user.id);
    } else {
      done(error, false);
    }
  } catch (error) {
    done(error, false);
  }
};

const localStrategy = new LocalStrategy(localOptions, loclaVerify);

module.exports = {
  localStrategy,
};
