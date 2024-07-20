const express = require('express');

const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authJwt = require('../middleware/authJwtMiddleware');

router.post(
  '/book-rooms',
  [authJwt.verifyToken, authJwt.isAdmin],
  bookingController.bookRooms
);

router.post(
  '/cancel-booking',
  [authJwt.verifyToken, authJwt.isAdmin],
  bookingController.cancelBooking
);

module.exports = router;
