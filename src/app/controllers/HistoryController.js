const asyncHandler = require("express-async-handler");
const History = require("../models/History");
const User = require("../models/User");

const createHistory = asyncHandler(async (req, res) => {
  try {
    const { user_id, title, description } = req.body;
    if (!user_id || !title || !description) {
      res.status(400);
      throw new Error("Vui lòng cung cấp đầy đủ thông tin");
    }

    const user = await User.findById(user_id);
    if (!user) {
      res.status(404);
      throw new Error("Không tìm thấy người dùng");
    }

    const history = new History({ user_id, title, description });
    const result = await history.save();
    if (!result) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi tạo lịch sử");
    }

    res.status(201).json(result);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const getHistories = asyncHandler(async (req, res) => {
  try {
    const histories = await History.find().populate("user_id").exec();
    if (!histories) {
      res.status(404);
      throw new Error("Không tìm thấy lịch sử");
    }
    res.status(200).json(histories);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const getHistoriesByUserId = asyncHandler(async (req, res) => {
  try {
    const { user_id } = req.params;
    const histories = await History.find({ user_id });
    if (!histories) {
      res.status(404);
      throw new Error("Không tìm thấy lịch sử");
    }
    res.status(200).json(histories);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const getHistoriesById = asyncHandler(async (req, res) => {
  try {
    const { history_id } = req.params;
    const history = await History.findById(history_id).populate("user_id");
    if (!history) {
      res.status(404);
      throw new Error("Không tìm thấy lịch sử");
    }
    res.status(200).json(history);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const deleteHistory = asyncHandler(async (req, res) => {
  try {
    const { history_id } = req.params;
    const history = await History.findById(history_id);
    if (!history) {
      res.status(404);
      throw new Error("Không tìm thấy lịch sử");
    }

    await history.remove();
    res.status(200).send("Xóa lịch sử thành công");
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  createHistory,
  getHistoriesByUserId,
  getHistoriesById,
  getHistories,
  deleteHistory,
};
