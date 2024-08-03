const db = require('../models');

const { room: Room, booking: Booking } = db;
const { Op } = db.Sequelize;

const bookRooms = async (req, res) => {
  const { roomIds, startDate, endDate } = req.body;
  const customerId = req.userId;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    return res.status(400).json({
      success: false,
      message: 'Start date must be before end date.',
    });
  }

  try {
    // Tìm các booking mà rơi vào khoảng thời gian đã chọn
    const bookedRooms = await Booking.findAll({
      where: {
        roomId: roomIds,
        [Op.or]: [
          { startDate: { [Op.lt]: end, [Op.gt]: start } }, // Booking bắt đầu trước và kết thúc sau
          { endDate: { [Op.gt]: start, [Op.lt]: end } }, // Booking kết thúc sau và bắt đầu trước
        ],
      },
      attributes: ['roomId'], // Chỉ lấy roomId
    });

    // Tạo một mảng các roomId đã được đặt
    const bookedRoomIds = bookedRooms.map((booking) => booking.roomId);

    // Lọc ra các phòng không khả dụng
    const unavailableRoomIds = roomIds.filter((id) =>
      bookedRoomIds.includes(id)
    );

    if (unavailableRoomIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Rooms ${unavailableRoomIds.join(', ')} are already booked during the selected dates.`,
      });
    }

    // Tạo các booking mới cho các phòng đã chọn
    const bookings = await Booking.bulkCreate(
      roomIds.map((roomId) => ({
        roomId,
        customerId, // Thêm customerId vào booking
        startDate: start,
        endDate: end,
        status: 'confirmed',
      }))
    );

    return res.status(201).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Error booking rooms:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

const cancelBooking = async (req, res) => {
  const { bookingIds } = req.body; // Nhận mảng bookingIds từ body của yêu cầu
  // const customerId = req.userId; // Giả định rằng bạn đã xác thực người dùng và có customerId trong req.user

  try {
    // Tìm tất cả booking theo mảng bookingIds và customerId để đảm bảo người dùng có quyền hủy
    const bookings = await Booking.findAll({
      where: {
        id: bookingIds,
        // customerId, // Chỉ cho phép người dùng hủy booking của chính họ
      },
    });

    // Kiểm tra xem có booking nào không
    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          'No bookings found or you do not have permission to cancel these bookings.',
      });
    }

    // Cập nhật trạng thái của từng booking thành 'cancelled'
    await Promise.all(
      bookings.map((booking) => {
        // Tạo bản sao và cập nhật trạng thái
        const updatedBooking = JSON.parse(JSON.stringify(booking.toJSON()));
        updatedBooking.status = 'cancelled';
        return Booking.update(updatedBooking, {
          where: { id: booking.id },
        }); // Cập nhật đối tượng trong cơ sở dữ liệu
      })
    );

    await Promise.all(
      bookings.map((booking) => booking.update({ status: 'cancelled' }))
    );

    return res.status(200).json({
      success: true,
      message: 'Bookings cancelled successfully.',
      data: bookings, // Trả về thông tin các booking đã hủy
    });
  } catch (error) {
    console.error('Error cancelling bookings:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

module.exports = {
  bookRooms,
  cancelBooking,
};
