const express = require('express');

const router = express.Router();
const { verifySignUp } = require('../middleware');
const controller = require('../controllers/auth.controller');
const asyncRoute = require('../utils/asyncRoute');

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.post(
  '/signup',
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  asyncRoute(controller.signup)
);

router.post('/signin', asyncRoute(controller.signin));

module.exports = router;
