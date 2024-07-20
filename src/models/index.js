const Sequelize = require('sequelize');
const config = require('../config/db.config');

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.model')(sequelize, Sequelize);
db.role = require('./role.model')(sequelize, Sequelize);
db.room = require('./room.model')(sequelize, Sequelize);
db.booking = require('./booking.model')(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: 'user_roles',
});
db.user.belongsToMany(db.role, {
  through: 'user_roles',
});

db.user.hasMany(db.room, { as: 'rooms' });
db.room.belongsTo(db.user, {
  foreignKey: 'adminId',
  as: 'admin',
});

db.booking.belongsTo(db.room, { foreignKey: 'roomId' });
db.room.hasMany(db.booking, { foreignKey: 'roomId' });

db.user.hasMany(db.booking, { foreignKey: 'customerId', as: 'bookings' }); // Sử dụng 'id' ngầm định
db.booking.belongsTo(db.user, { foreignKey: 'customerId', as: 'customer' });

db.ROLES = ['user', 'admin', 'moderator'];

module.exports = db;
