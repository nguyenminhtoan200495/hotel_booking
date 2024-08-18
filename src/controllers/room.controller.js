const db = require('../models');

const { room: Room } = db;

const { getAvailableRoomsService } = require('../services/room.service');

const getAllRooms = async (req, res) => {
  const rooms = await Room.findAll();
  res.json(rooms);
};

const getRoomById = async (req, res) => {
  const { id } = req.params;
  const room = await Room.findByPk(id);
  if (room) {
    res.json(room);
  }
  res.status(404).send({ message: 'Room Not Found' });
};

const getAvailableRooms = async (req, res) => {
  const availableRooms = await getAvailableRoomsService();
  return res.status(200).json({
    success: true,
    data: availableRooms,
  });
};

const createRoom = async (req, res) => {
  const { type, description, image, quantity, price } = req.body;
  const room = await Room.create({
    type,
    description,
    image,
    quantity,
    price,
  });
  res.status(201).json(room);
};

const updateRoom = async (req, res) => {
  const { id } = req.params;
  const { type, description, image, quantity, price } = req.body;
  const room = await Room.findByPk(id);
  if (room) {
    await room.update({ type, description, image, quantity, price });
    res.json(room);
  }
  res.status(404).send({ message: 'Room Not Found' });
};

const deleteRoom = async (req, res) => {
  const { id } = req.params;
  const room = await Room.findByPk(id);
  if (room) {
    await room.destroy();
    res.send({ message: 'Room Deleted' });
  }
  res.status(404).send({ message: 'Room Not Found' });
};

module.exports = {
  getAllRooms,
  getRoomById,
  getAvailableRooms,
  createRoom,
  updateRoom,
  deleteRoom,
};
