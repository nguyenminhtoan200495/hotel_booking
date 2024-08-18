const express = require('express');

const router = express.Router();
const roomController = require('../controllers/room.controller');
const authJwt = require('../middleware/authJwtMiddleware');
const asyncRoute = require('../utils/asyncRoute');

// Các route yêu cầu quyền admin
router.get(
  '/',
  [authJwt.verifyToken, authJwt.isAdmin],
  asyncRoute(roomController.getAllRooms)
);
router.get(
  '/available',
  [authJwt.verifyToken, authJwt.isAdmin],
  asyncRoute(roomController.getAvailableRooms)
);
router.get(
  '/:id',
  [authJwt.verifyToken, authJwt.isAdmin],
  asyncRoute(roomController.getRoomById)
);
router.post(
  '/',
  [authJwt.verifyToken, authJwt.isAdmin],
  asyncRoute(roomController.createRoom)
);
router.put(
  '/:id',
  [authJwt.verifyToken, authJwt.isAdmin],
  asyncRoute(roomController.updateRoom)
);
router.delete(
  '/:id',
  [authJwt.verifyToken, authJwt.isAdmin],
  asyncRoute(roomController.deleteRoom)
);

module.exports = router;
