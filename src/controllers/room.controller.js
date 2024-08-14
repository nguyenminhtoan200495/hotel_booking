const db = require('../models');

const { room: Room, booking: Booking } = db;
const { Op } = db.Sequelize;

const { getAvailableRoomsService } = require('../services/room.service');

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.json(rooms);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findByPk(id);
    if (room) {
      res.json(room);
    } else {
      res.status(404).send({ message: 'Room Not Found' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getAvailableRooms = async (req, res) => {
  try {
    const availableRooms = await getAvailableRoomsService();

    return res.status(200).json({
      success: true,
      data: availableRooms,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

const createRoom = async (req, res) => {
  const { type, description, image, quantity, price } = req.body;
  try {
    const room = await Room.create({
      type,
      description,
      image,
      quantity,
      price,
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const updateRoom = async (req, res) => {
  const { id } = req.params;
  const { type, description, image, quantity, price } = req.body;
  try {
    const room = await Room.findByPk(id);
    if (room) {
      await room.update({ type, description, image, quantity, price });
      res.json(room);
    } else {
      res.status(404).send({ message: 'Room Not Found' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findByPk(id);
    if (room) {
      await room.destroy();
      res.send({ message: 'Room Deleted' });
    } else {
      res.status(404).send({ message: 'Room Not Found' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  getAvailableRooms,
  createRoom,
  updateRoom,
  deleteRoom,
};
