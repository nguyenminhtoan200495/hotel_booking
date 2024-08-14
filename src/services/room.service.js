const db = require('../models');

const { room: Room, booking: Booking } = db;
const { Op } = db.Sequelize;

const getAvailableRoomsService = async () => {
  try {
    // Find all rooms with at least one booking in the future
    const bookedRooms = await Booking.findAll({
      where: {
        endDate: { [Op.gt]: new Date() }, // endDate greater than the current date
      },
      attributes: ['roomId'],
    });

    // Get the list of booked room IDs
    const bookedRoomIds = bookedRooms.map((booking) => booking.roomId);

    // Find all rooms that are not in the list of booked rooms
    const availableRooms = await Room.findAll({
      where: {
        id: { [Op.notIn]: bookedRoomIds },
      },
    });

    return availableRooms;
  } catch (error) {
    throw new Error(`Error fetching available rooms: ${error.message}`);
  }
};

module.exports = {
  getAvailableRoomsService,
};
