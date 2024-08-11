const {
  bookRoomsService,
  cancelBookingService,
} = require('../services/booking.service');

const bookRooms = async (req, res) => {
  const { roomIds, startDate, endDate } = req.body;
  const customerId = req.userId;
  try {
    const bookings = await bookRoomsService(
      roomIds,
      startDate,
      endDate,
      customerId
    );
    res.status(201).json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error booking rooms:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  const { bookingIds } = req.body;
  const customerId = req.userId;
  try {
    const cancelledBookings = await cancelBookingService(
      bookingIds,
      customerId
    );
    res.status(200).json({
      success: true,
      message: 'Bookings cancelled successfully.',
      data: cancelledBookings,
    });
  } catch (error) {
    console.error('Error cancelling bookings:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  bookRooms,
  cancelBooking,
};
