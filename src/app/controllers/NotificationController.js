const Notification = require("../models/Notification");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

/**
 * @desc Get all notifications
 * @route GET /api/notifications
 * @access Private
 */
const getAllNotificationsOfUser = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id });

    if (!notifications || notifications.length === 0) {
      res.status(404);
      throw new Error("No notifications found");
    }

    res.status(200).json(notification);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Get a single notification by ID
 * @route GET /api/notifications/:id
 * @access Private
 */
const getNotificationById = asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      res.status(404);
      throw new Error("Notification not found");
    }

    res.status(200).json(notification);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Create a new notification
 * @route POST /api/notifications
 * @access Private
 */
const createNotification = asyncHandler(async (req, res) => {
  const { description, user_id, type } = req.body;

  if (!description || !type || !user_id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const user = await User.findById(user_id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const newNotification = new Notification({
    user_id,
    description,
    type,
  });

  try {
    const createdNotification = await newNotification.save();
    res.status(201).json(createdNotification);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Update all notifications to 'read' for a user
 * @route PUT /api/notifications/:id
 * @access Private
 */
const updateAllNotificationIsRead = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id });
    if (!notifications || notifications.length === 0) {
      res.status(404);
      throw new Error("User doesn't have notifications");
    }

    await Notification.updateMany(
      { user_id: req.user.id },
      { $set: { is_read: true } }
    );

    res.status(200).json(await this.getAllNotificationsOfUser(req, res));
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Update a single notification to 'read'
 * @route PUT /api/notifications/:id
 * @access Private
 */
const updateNotificationIsRead = asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      res.status(404);
      throw new Error("Notification not found");
    }

    notification.is_read = true;
    const updatedNotification = await notification.save();
    res.status(200).json(updatedNotification);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Update all notifications to 'seen' for a user
 * @route PUT /api/notifications/:id
 * @access Private
 */
const updateAllNotificationIsSeen = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id });
    if (!notifications || notifications.length === 0) {
      res.status(404);
      throw new Error("User doesn't have notifications");
    }

    await Notification.updateMany(
      { user_id: req.user.id },
      { $set: { is_new: false } }
    );

    res.status(200).json(await Notification.find({ user_id: req.user.id }));
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Update a single notification to 'seen'
 * @route PUT /api/notifications/:id
 * @access Private
 */
const updateNotificationIsSeen = asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      res.status(404);
      throw new Error("Notification not found");
    }

    notification.is_new = false;
    const updatedNotification = await notification.save();
    res.status(200).json(updatedNotification);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Update all notifications to 'seen' for a user
 * @route PUT /api/notifications/:id
 * @access Private
 */
const deleteAllNotificationOfUser = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id });
    if (!notifications || notifications.length === 0) {
      res.status(404);
      throw new Error("User doesn't have notifications");
    }

    await Notification.deleteMany({ user_id: req.user.id });

    res.status(200).json({ message: "All Notification Deleted" });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Update a single notification to 'seen'
 * @route PUT /api/notifications/:id
 * @access Private
 */
const deleteNotification = asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      res.status(404);
      throw new Error("Notification not found");
    }

    await Notification.findByIdAndDelete(req.params.id);

    await res.status(200).json({ message: "Notification Deleted" });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  getAllNotificationsOfUser,
  getNotificationById,
  createNotification,
  updateAllNotificationIsRead,
  updateNotificationIsRead,
  updateAllNotificationIsSeen,
  updateNotificationIsSeen,
  deleteAllNotificationOfUser,
  deleteNotification,
};
