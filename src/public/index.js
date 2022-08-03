const express = require('express');
const templateRoutes = require('./template.routes');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: templateRoutes
  },
];

const devRoutes = [
  // routes available only in development mode
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
