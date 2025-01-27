const express = require("express");
const {
  getAllNotificationsOfUser,
  getNotificationById,
  createNotification,
  updateAllNotificationIsRead,
  updateNotificationIsRead,
  updateAllNotificationIsSeen,
  updateNotificationIsSeen,
  deleteAllNotificationOfUser,
  deleteNotification,
} = require("../app/controllers/NotificationController");
const {
  validateTokenCustomer,
  validateTokenAdmin,
} = require("../app/middleware/validateTokenHandler");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - user_id
 *         - is_new
 *         - is_read
 *         - description
 *         - type
 *       properties:
 *         user_id:
 *           type: string
 *           description: "User ObjectId associated with the notification"
 *         is_new:
 *           type: boolean
 *           description: "Indicates if the notification is new"
 *           default: true
 *         is_read:
 *           type: boolean
 *           description: "Indicates if the notification has been read"
 *           default: false
 *         description:
 *           type: string
 *           description: "Description or content of the notification"
 *         type:
 *           type: string
 *           description: "Type of notification (e.g., new_plant, order_complete)"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: "Creation time of the notification"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: "Last update time of the notification"
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications of the logged-in user (Customer Only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications for the user
 *       500:
 *         description: Internal server error
 */
router.get("/", validateTokenCustomer, getAllNotificationsOfUser);

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Get a single notification by ID (Customer Only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification found
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", validateTokenCustomer, getNotificationById);

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a new notification (Admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: The notification type
 *               description:
 *                 type: string
 *                 description: The notification content
 *               user_id:
 *                 type: string
 *                 description: ID of the user to receive the notification
 *     responses:
 *       201:
 *         description: Notification created
 *       400:
 *         description: Bad request, missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/", validateTokenAdmin, createNotification);

/**
 * @swagger
 * /api/notifications/readAll:
 *   put:
 *     summary: Mark all notifications of a user as read (Customer Only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       404:
 *         description: User has no notifications
 *       500:
 *         description: Internal server error
 */
router.put("/readAll", validateTokenCustomer, updateAllNotificationIsRead);

/**
 * @swagger
 * /api/notifications/read/{id}:
 *   put:
 *     summary: Mark a single notification as read (Customer Only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID to be updated
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */
router.put("/read/:id", validateTokenCustomer, updateNotificationIsRead);

/**
 * @swagger
 * /api/notifications/seenAll:
 *   put:
 *     summary: Mark all notifications of a user as seen (Customer Only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as seen
 *       404:
 *         description: User has no notifications
 *       500:
 *         description: Internal server error
 */
router.put("/seenAll", validateTokenCustomer, updateAllNotificationIsSeen);

/**
 * @swagger
 * /api/notifications/seen/{id}:
 *   put:
 *     summary: Mark a single notification as seen (Customer Only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID to be updated
 *     responses:
 *       200:
 *         description: Notification marked as seen
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */
router.put("/seen/:id", validateTokenCustomer, updateNotificationIsSeen);

/**
 * @swagger
 * /api/notifications/deleteAll:
 *   delete:
 *     summary: Delete all notifications of a user (Customer Only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications deleted
 *       404:
 *         description: User has no notifications
 *       500:
 *         description: Internal server error
 */
router.delete("/deleteAll", validateTokenCustomer, deleteAllNotificationOfUser);

/**
 * @swagger
 * /api/notifications/delete/{id}:
 *   delete:
 *     summary: Mark a single notification (Customer Only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID to be updated
 *     responses:
 *       200:
 *         description: Notification marked as seen
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */
router.delete("/delete/:id", validateTokenCustomer, deleteNotification);

module.exports = router;
