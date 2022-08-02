const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const mainRoutes = require('./main.routes');
const fileRoutes = require('./file.routes');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: authRoutes
  },
  {
    path: '/user',
    route: userRoutes
  },
  {
    path: '/file',
    route: fileRoutes
  },
  {
    path: '/main',
    route: mainRoutes,
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
