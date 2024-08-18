const db = require('../models');

const { booking: Booking } = db;
const { Op } = require('../models').Sequelize;

const findOverlappingBookings = async (roomIds, startDate, endDate) =>
  Booking.findAll({
    where: {
      roomId: roomIds,
      [Op.or]: [
        { startDate: { [Op.lt]: endDate, [Op.gt]: startDate } },
        { endDate: { [Op.gt]: startDate, [Op.lt]: endDate } },
      ],
    },
    attributes: ['roomId'],
  });

const findBookingsForCancellation = async (bookingIds, customerId) =>
  Booking.findAll({
    where: {
      id: bookingIds,
      customerId,
    },
  });

const bookRoomsService = async (roomIds, startDate, endDate, customerId) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    throw new Error('Start date must be before end date.');
  }

  const overlappingBookings = await findOverlappingBookings(
    roomIds,
    start,
    end
  );
  const unavailableRoomIds = overlappingBookings.map(
    (booking) => booking.roomId
  );

  if (unavailableRoomIds.length > 0) {
    throw new Error(
      `Rooms ${unavailableRoomIds.join(', ')} are already booked during the selected dates.`
    );
  }

  const bookingsToCreate = roomIds.map((roomId) => ({
    roomId,
    customerId,
    startDate: start,
    endDate: end,
    status: 'confirmed',
  }));

  return Booking.bulkCreate(bookingsToCreate);
};

const cancelBookingService = async (bookingIds, customerId) => {
  const bookings = await findBookingsForCancellation(bookingIds, customerId);

  if (bookings.length === 0) {
    throw new Error(
      'No bookings found or you do not have permission to cancel these bookings.'
    );
  }

  await Promise.all(
    bookings.map((booking) => booking.update({ status: 'cancelled' }))
  );
  return bookings;
};

module.exports = {
  bookRoomsService,
  cancelBookingService,
  findOverlappingBookings,
  findBookingsForCancellation,
};
