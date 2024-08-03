module.exports = (sequelize, Sequelize) => {
  const Room = sequelize.define('rooms', {
    type: {
      type: Sequelize.STRING,
      allowNull: false, // Không cho phép giá trị null
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    image: {
      type: Sequelize.BLOB, // Hoặc Sequelize.STRING nếu bạn lưu đường dẫn hình ảnh
      allowNull: true,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  return Room;
};
