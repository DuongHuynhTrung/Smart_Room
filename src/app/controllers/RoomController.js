const asyncHandler = require("express-async-handler");
const RoomStatusEnum = require("../../enum/RoomEnum");
const Room = require("../models/Room");
const User = require("../models/User");
const UserMembershipEnum = require("../../enum/UserMembershipEnum");
const RoleEnum = require("../../enum/RoleEnum");
const NotificationTypeEnum = require("../../enum/NotificationTypeEnum");
const Notification = require("../models/Notification");

const createRoom = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.membership === UserMembershipEnum.NORMAL) {
      res.status(400);
      throw new Error(
        `Chỉ người dùng từ hạng ${UserMembershipEnum.SILVER} trở lên mới được đăng phòng`
      );
    }
    const room = new Room({
      ...req.body,
      user_id: req.user.id,
    });
    const result = await room.save();
    if (!result) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi tạo phòng");
    }

    // Create Notification
    const admin = await User.findOne({ role: RoleEnum.ADMIN });
    const notification = new Notification({
      receiver_id: admin._id,
      noti_describe:
        "Bạn có một bài đăng phòng cần được kiểm duyệt trước khi công khai với mọi người",
      noti_title: "Duyệt bài đăng phòng",
      noti_type: NotificationTypeEnum.CENSOR_ROOM_POSTED,
    });
    await notification.save();

    _io.emit(`new-noti-${admin._id}`, notification);

    res.status(201).json(result);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const getAllRooms = asyncHandler(async (req, res) => {
  try {
    if (req.user.roleName !== RoleEnum.ADMIN) {
      res.status(403);
      throw new Error(
        "Chỉ có Admin có quyền truy xuất thông tin tất cả giao dịch"
      );
    }
    const rooms = await Room.find().populate("user_id").exec();
    if (!rooms) {
      res.status(400);
      throw new Error("Có lỗi xảy ra khi Admin truy xuất tất cả phòng");
    }
    res.status(200).json(rooms);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const getAllActiveRooms = asyncHandler(async (req, res) => {
  try {
    const rooms = await Room.find({
      status: RoomStatusEnum.RoomStatusEnum.ACTIVE,
    })
      .populate("user_id")
      .exec();
    if (!rooms) {
      res.status(400);
      throw new Error("Có lỗi xảy ra khi Admin truy xuất tất cả phòng");
    }
    res.status(200).json(rooms);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const updateRoom = asyncHandler(async (req, res) => {
  try {
    const { room_id } = req.body;
    const room = await Room.findById(room_id);
    if (!room) {
      res.status(404);
      throw new Error("Không tìm thấy phòng");
    }
    if (room.user_id.toString() !== req.user.id.toString()) {
      res.status(403);
      throw new Error("Bạn không có quyền chỉnh sửa phòng này");
    }
    Object.assign(room, req.body);
    const result = await room.save();
    if (!result) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi cập nhật phòng");
    }
    res.status(200).json(result);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const getRoomsByUserId = asyncHandler(async (req, res) => {
  try {
    const { user_id } = req.params;
    const rooms = await Room.find({ user_id });
    if (!rooms) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi truy xuất danh sách phòng");
    }
    res.status(200).json(rooms);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const getRoomsById = asyncHandler(async (req, res) => {
  try {
    const { room_id } = req.params;
    const room = await Room.findById(room_id);
    if (!room) {
      res.status(404);
      throw new Error("Không tìm thấy phòng");
    }
    res.status(200).json(room);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const updateRoomStatusForUser = asyncHandler(async (req, res) => {
  try {
    const { room_id, room_status } = req.params;
    const room = await Room.findById(room_id);
    if (!room) {
      res.status(404);
      throw new Error("Không tìm thấy phòng");
    }
    if (room.status === RoomStatusEnum.RoomStatusEnum.UNDER_REVIEW) {
      res.status(403);
      throw new Error("Phòng đang chờ kiểm duyệt");
    } else if (room.status === RoomStatusEnum.RoomStatusEnum.REJECTED) {
      res.status(403);
      throw new Error("Phòng đã bị từ chối");
    }
    if (
      req.user.roleName != RoleEnum.ADMIN &&
      room.user_id.toString() !== req.user.id.toString()
    ) {
      res.status(403);
      throw new Error("Bạn không có quyền cập nhật phòng này");
    }
    room.status = room_status;
    await room.save();

    res.status(200).json(room);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const changeRoomStatusByAdmin = asyncHandler(async (req, res) => {
  try {
    const { room_id, room_status } = req.params;
    if (req.user.roleName !== RoleEnum.ADMIN) {
      res.status(403);
      throw new Error("Chỉ có Admin có quyền kiểm duyệt phòng");
    }
    const room = await Room.findById(room_id);
    if (!room) {
      res.status(404);
      throw new Error("Không tìm thấy phòng");
    }
    room.status = room_status;

    if (room_status === RoomStatusEnum.RoomStatusEnum.ACTIVE) {
      // Create Notification
      const notification = new Notification({
        receiver_id: room.user_id,
        noti_describe:
          "Xin chúc mừng phòng bạn vừa đăng đã vượt qua quá trình kiểm duyệt và đã được công khai.",
        noti_title: "Kiểm duyệt thành công",
        noti_type: NotificationTypeEnum.CENSORSHIP_SUCCESSFUL,
      });
      await notification.save();

      _io.emit(`new-noti-${room.user_id}`, notification);
    } else {
      const { reason_rejected } = req.body;
      if (reason_rejected == undefined || reason_rejected == "") {
        res.status(400);
        throw new Error("Lý do từ chối không được để trống");
      }
      room.reason_rejected = reason_rejected;

      // Create Notification
      const notification = new Notification({
        receiver_id: room.user_id,
        noti_describe:
          "Phòng bạn vừa đăng không đạt yêu cầu kiểm duyệt. Vui lòng chỉnh sửa và đăng lại.",
        noti_title: "Kiểm duyệt không thành công",
        noti_type: NotificationTypeEnum.CENSORSHIP_FAILED,
      });
      await notification.save();

      _io.emit(`new-noti-${room.user_id}`, notification);
    }

    await room.save();
    res.status(200).json(room);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const deleteRoom = asyncHandler(async (req, res) => {
  try {
    const { room_id } = req.params;
    const room = await Room.findById(room_id);
    if (!room) {
      res.status(404);
      throw new Error("Không tìm thấy phòng");
    }
    if (
      req.user.roleName != RoleEnum.ADMIN &&
      room.user_id.toString() !== req.user.id.toString()
    ) {
      res.status(403);
      throw new Error("Bạn không có quyền xóa phòng này");
    }
    const result = await room.remove();
    if (!result) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi xóa phòng");
    }
    res.status(200).send("Xóa phòng thành công");
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  createRoom,
  updateRoom,
  getAllRooms,
  getRoomsById,
  getRoomsByUserId,
  updateRoomStatusForUser,
  getAllActiveRooms,
  changeRoomStatusByAdmin,
  deleteRoom,
};
