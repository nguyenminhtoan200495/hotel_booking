const {
  bookRoomsService,
  cancelBookingService,
} = require('../services/booking.service');

const bookRooms = async (req, res) => {
  const { roomIds, startDate, endDate } = req.body;
  const customerId = req.userId;
  const bookings = await bookRoomsService(
    roomIds,
    startDate,
    endDate,
    customerId
  );
  res.status(201).json({ success: true, data: bookings });
};

const cancelBooking = async (req, res) => {
  const { bookingIds } = req.body;
  const customerId = req.userId;
  const cancelledBookings = await cancelBookingService(bookingIds, customerId);
  res.status(200).json({
    success: true,
    message: 'Bookings cancelled successfully.',
    data: cancelledBookings,
  });
};

module.exports = {
  bookRooms,
  cancelBooking,
};
