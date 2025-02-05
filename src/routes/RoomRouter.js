const express = require("express");
const roomRouter = express.Router();

const {
  createRoom,
  updateRoom,
  getAllRooms,
  getRoomsById,
  getRoomsByUserId,
  updateRoomStatusForUser,
  getAllActiveRooms,
  changeRoomStatusByAdmin,
  deleteRoom,
} = require("../app/controllers/RoomController");

const {
  validateToken,
  validateTokenAdmin,
  validateTokenCustomer,
} = require("../app/middleware/validateTokenHandler");

roomRouter.post("/", validateTokenCustomer, createRoom);
roomRouter.put("/", validateTokenCustomer, updateRoom);
roomRouter.get("/", validateToken, getAllRooms);
roomRouter.get("/active", getAllActiveRooms);
roomRouter.get("/user/:user_id", getRoomsByUserId);
roomRouter.get("/:room_id", getRoomsById);
roomRouter.put(
  "/status/:room_id/:room_status",
  validateToken,
  updateRoomStatusForUser
);
roomRouter.put(
  "/admin/status/:room_id/:room_status",
  validateTokenAdmin,
  changeRoomStatusByAdmin
);
roomRouter.delete("/:room_id", validateToken, deleteRoom);

module.exports = roomRouter;
