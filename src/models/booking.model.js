// models/booking.model.js

module.exports = (sequelize, Sequelize) => {
  const Booking = sequelize.define('bookings', {
    customerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    roomId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'rooms',
        key: 'id',
      },
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'pending',
    },
  });

  return Booking;
};
