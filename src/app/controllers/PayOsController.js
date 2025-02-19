const asyncHandler = require("express-async-handler");
const RoleEnum = require("../../enum/RoleEnum");
const Transaction = require("../models/Transaction");
const PayOS = require("@payos/node");
const User = require("../models/User");
const PaymentMethodEnum = require("../../enum/PaymentMethodEnum");
const TransactionTypeEnum = require("../../enum/TransactionTypeEnum");
const NotificationTypeEnum = require("../../enum/NotificationTypeEnum");
const Notification = require("../models/Notification");
const UserMembershipEnum = require("../../enum/UserMembershipEnum");
const TempTransaction = require("../models/TempTransaction");
const Room = require("../models/Room");
const TempRoom = require("../models/TempRoom");
const { RoomTypeEnum, RoomStatusEnum } = require("../../enum/RoomEnum");
const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUMS_KEY
);

const createAddFundsPayOsUrl = asyncHandler(async (req, res) => {
  try {
    if (req.user.roleName !== RoleEnum.CUSTOMER) {
      res.status(403);
      throw new Error("Chỉ có khách hàng có quyền thanh toán giao dịch");
    }

    const requestData = {
      orderCode: Date.now(),
      amount: req.body.amount,
      description: `Nạp tiền vào tài khoản`,
      cancelUrl: "https://smart-room-rental.vercel.app/history",
      returnUrl: "https://smart-room-rental.vercel.app/history",
    };
    const paymentLinkData = await payos.createPaymentLink(requestData);

    // Create temp Transaction
    const tempTransaction = new TempTransaction({
      orderCode: requestData.orderCode,
      user_id: req.user.id,
      type: TransactionTypeEnum.ADD_FUNDS,
    });
    await tempTransaction.save();
    res.status(200).json({ paymentUrl: paymentLinkData.checkoutUrl });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const createUpMembershipPayOsUrl = asyncHandler(async (req, res) => {
  try {
    if (req.user.roleName !== RoleEnum.CUSTOMER) {
      res.status(403);
      throw new Error("Chỉ có khách hàng có quyền thanh toán giao dịch");
    }
    const membership = req.params.membership;
    const requestData = {
      orderCode: Date.now(),
      amount: req.body.amount,
      description: `Nâng cấp lên hạng ${membership}`,
      cancelUrl: "https://smart-room-rental.vercel.app/account",
      returnUrl: "https://smart-room-rental.vercel.app/account",
    };
    const paymentLinkData = await payos.createPaymentLink(requestData);
    const tempTransaction = new TempTransaction({
      orderCode: requestData.orderCode,
      user_id: req.user.id,
      type: TransactionTypeEnum.UP_MEMBERSHIP,
      membership: membership,
    });
    await tempTransaction.save();
    res.status(200).json({ paymentUrl: paymentLinkData.checkoutUrl });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const createPostRoomPayOsUrl = asyncHandler(async (req, res) => {
  try {
    if (req.user.roleName !== RoleEnum.CUSTOMER) {
      res.status(403);
      throw new Error("Chỉ có khách hàng có quyền thanh toán đăng phòng");
    }
    const requestData = {
      orderCode: Date.now(),
      amount: req.body.amount,
      description:
        req.body.type === RoomTypeEnum.LOOKING_FOR_ROOMMATES
          ? "Đăng tìm bạn ở ghép"
          : "Đăng phòng cho thuê",
      cancelUrl: "https://smart-room-rental.vercel.app/account",
      returnUrl: "https://smart-room-rental.vercel.app/account",
    };
    const paymentLinkData = await payos.createPaymentLink(requestData);

    const tempRoom = new TempRoom({
      ...req.body,
      user_id: req.user.id,
      orderCode: requestData.orderCode,
    });
    await tempRoom.save();

    const tempTransaction = new TempTransaction({
      orderCode: requestData.orderCode,
      user_id: req.user.id,
      type: req.body.type,
    });
    await tempTransaction.save();
    res.status(200).json({ paymentUrl: paymentLinkData.checkoutUrl });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// @desc Create a new transaction
// @route POST /api/transactions
// @access private (Admin only)
const payOsCallBack = asyncHandler(async (req, res) => {
  try {
    const code = req.body.code;
    if (code == "00") {
      const { amount, orderCode } = req.body.data;
      const tempTransaction = await TempTransaction.findOne({
        orderCode: orderCode,
      });
      const user = await User.findById(tempTransaction.user_id);
      if (tempTransaction.type == TransactionTypeEnum.ADD_FUNDS) {
        user.account_balance += amount;
        await user.save();

        // create transaction
        const transaction = new Transaction({
          user_id: user._id,
          payment_method: PaymentMethodEnum.PayOS,
          amount: amount,
          transaction_type: TransactionTypeEnum.ADD_FUNDS,
          transaction_code: orderCode,
        });
        await transaction.save();

        // Create Notification
        const notification = new Notification({
          receiver_id: user._id,
          noti_describe:
            "Giao dịch thanh toán của bạn đã hoàn tất. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!",
          noti_title: "Thanh toán thành công",
          noti_type: NotificationTypeEnum.PAYMENT_SUCCESSFUL,
        });
        await notification.save();

        _io.emit(`new-noti-${user._id}`, notification);
        _io.emit(`user-info-${user._id}`, user);
      } else if (tempTransaction.type == TransactionTypeEnum.UP_MEMBERSHIP) {
        user.membership = tempTransaction.membership;
        await user.save();

        // create transaction
        const transaction = new Transaction({
          user_id: user._id,
          payment_method: PaymentMethodEnum.PayOS,
          amount: amount,
          transaction_type: TransactionTypeEnum.UP_MEMBERSHIP,
          transaction_code: orderCode,
        });
        await transaction.save();

        // Create Notification
        const notification = new Notification({
          receiver_id: user._id,
          noti_describe: `Chúc mừng! Tài khoản của bạn đã được nâng cấp thành công lên gói thành viên ${user.membership}`,
          noti_title: "Tài khoản của bạn đã được nâng cấp",
          noti_type: NotificationTypeEnum.UP_MEMBERSHIP,
        });
        await notification.save();

        _io.emit(`new-noti-${user._id}`, notification);
        _io.emit(`user-info-${user._id}`, user);
      } else {
        const tempRoom = await TempRoom.findOne({ orderCode: orderCode });
        const room = new Room({
          ...tempRoom._doc,
          status: RoomStatusEnum.UNDER_REVIEW,
        });
        await room.save();

        // create transaction
        const transaction = new Transaction({
          user_id: user._id,
          payment_method: PaymentMethodEnum.PayOS,
          amount: amount,
          transaction_type: tempTransaction.type,
          transaction_code: orderCode,
        });
        await transaction.save();

        // remove temp room
        await tempRoom.remove();

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
      }

      // Remove temp Transaction
      await tempTransaction.remove();

      const admin = await User.findOne({ role: RoleEnum.ADMIN });
      // Create Notification
      const notificationAdmin = new Notification({
        receiver_id: admin._id,
        noti_describe:
          "Một giao dịch mới vừa được thực hiện. Vui lòng kiểm tra chi tiết giao dịch vừa tạo.",
        noti_title: "Có giao dịch mới phát sinh",
        noti_type: NotificationTypeEnum.NEW_TRANSACTION,
      });
      await notificationAdmin.save();

      _io.emit(`new-noti-${admin._id}`, notificationAdmin);

      res.status(200).send("Success");
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  createAddFundsPayOsUrl,
  createUpMembershipPayOsUrl,
  createPostRoomPayOsUrl,
  payOsCallBack,
};
