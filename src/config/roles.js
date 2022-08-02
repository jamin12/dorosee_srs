const allRoles = {
  user: ['user'],
  superUser: ['user', 'superUser'],
  admin: ['user', 'superUser', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
