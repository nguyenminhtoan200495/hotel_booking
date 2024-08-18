const express = require('express');

const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authJwt = require('../middleware/authJwtMiddleware');
const asyncRoute = require('../utils/asyncRoute');

router.post(
  '/book-rooms',
  [authJwt.verifyToken, authJwt.isAdmin],
  asyncRoute(bookingController.bookRooms)
);

router.post(
  '/cancel-booking',
  [authJwt.verifyToken, authJwt.isAdmin],
  asyncRoute(bookingController.cancelBooking)
);

module.exports = router;
