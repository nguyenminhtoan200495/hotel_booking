const express = require('express');

const router = express.Router();
const roomController = require('../controllers/room.controller');
const authJwt = require('../middleware/authJwtMiddleware');

// Các route yêu cầu quyền admin
router.get(
  '/',
  [authJwt.verifyToken, authJwt.isAdmin],
  roomController.getAllRooms
);
router.get(
  '/:id',
  [authJwt.verifyToken, authJwt.isAdmin],
  roomController.getRoomById
);
router.post(
  '/',
  [authJwt.verifyToken, authJwt.isAdmin],
  roomController.createRoom
);
router.put(
  '/:id',
  [authJwt.verifyToken, authJwt.isAdmin],
  roomController.updateRoom
);
router.delete(
  '/:id',
  [authJwt.verifyToken, authJwt.isAdmin],
  roomController.deleteRoom
);

module.exports = router;
