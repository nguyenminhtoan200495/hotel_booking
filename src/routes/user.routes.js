const express = require('express');

const router = express.Router();
const { authJwt } = require('../middleware');
const controller = require('../controllers/user.controller');
const asyncRoute = require('../utils/asyncRoute');

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.get('/all', asyncRoute(controller.allAccess));

router.get('/user', [authJwt.verifyToken], asyncRoute(controller.userBoard));

router.get(
  '/mod',
  [authJwt.verifyToken, authJwt.isModerator],
  asyncRoute(controller.moderatorBoard)
);

router.get(
  '/admin',
  [authJwt.verifyToken, authJwt.isAdmin],
  asyncRoute(controller.adminBoard)
);

module.exports = router;
