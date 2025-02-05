const asyncHandler = require("express-async-handler");
let $ = require("jquery");
const moment = require("moment");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const NotificationType = require("../../enum/NotificationTypeEnum");
const RoleEnum = require("../../enum/RoleEnum");
const User = require("../models/User");
const PaymentMethodEnum = require("../../enum/PaymentMethodEnum");
const TransactionTypeEnum = require("../../enum/TransactionTypeEnum");

const createAddFundsPaymentUrl = asyncHandler(async (req, res) => {
  try {
    if (req.user.roleName !== RoleEnum.CUSTOMER) {
      res.status(403);
      throw new Error("Chỉ có khách hàng có quyền thực hiện nạp tiền");
    }
    process.env.TZ = "Asia/Ho_Chi_Minh";

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let tmnCode = process.env.vnp_TmnCode;
    let secretKey = process.env.vnp_HashSecret;
    let vnpUrl = process.env.vnp_Url;
    let returnUrl = process.env.vnp_ReturnUrl;
    let orderId = moment(date).format("DDHHmmss");
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;

    let locale = "vn";
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = `${req.user.id} ${
      TransactionTypeEnum.ADD_FUNDS
    } ${new Date().getTime()}`;
    vnp_Params["vnp_OrderType"] = TransactionTypeEnum.ADD_FUNDS;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    res.status(200).json({ vnpUrl });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const createUpMemberShipPaymentUrl = asyncHandler(async (req, res) => {
  try {
    if (req.user.roleName !== RoleEnum.CUSTOMER) {
      res.status(403);
      throw new Error(
        "Chỉ có khách hàng có quyền thực hiện nâng hạng thành viên"
      );
    }
    process.env.TZ = "Asia/Ho_Chi_Minh";

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let tmnCode = process.env.vnp_TmnCode;
    let secretKey = process.env.vnp_HashSecret;
    let vnpUrl = process.env.vnp_Url;
    let returnUrl = process.env.vnp_ReturnUrl;
    let orderId = moment(date).format("DDHHmmss");
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;

    let locale = "vn";

    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = `${req.user.id} ${
      req.params.membership
    } ${new Date().getTime()}`;
    vnp_Params["vnp_OrderType"] = "UpMembership";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    res.status(200).json({ vnpUrl });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const VNPayReturn = asyncHandler(async (req, res) => {
  try {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    let tmnCode = process.env.vnp_TmnCode;
    let secretKey = process.env.vnp_HashSecret;

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    if (secureHash === signed && vnp_Params["vnp_ResponseCode"] === "00") {
      const vnp_Amount = vnp_Params["vnp_Amount"];
      const vnp_OrderInfo = vnp_Params["vnp_OrderInfo"];
      const user_id = vnp_OrderInfo.split("+")[0];
      const vnp_OrderType = vnp_OrderInfo.split("+")[1];
      if (vnp_OrderType === TransactionTypeEnum.ADD_FUNDS) {
        const user = await User.findById(user_id);
        user.account_balance += Number.parseInt(vnp_Amount);
        await user.save();

        // create transaction
        const transaction = new Transaction({
          user_id: user_id,
          payment_method: PaymentMethodEnum.VNPAY,
          amount: vnp_Amount,
          transaction_type: TransactionTypeEnum.ADD_FUNDS,
          transaction_code: Date.now(),
        });
        await transaction.save();

        // Create Notification
        const notification = new Notification({
          receiver_id: user_id,
          noti_describe:
            "Giao dịch thanh toán của bạn đã hoàn tất. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!",
          noti_title: "Thanh toán thành công",
          noti_type: NotificationType.PAYMENT_SUCCESSFUL,
        });
        await notification.save();

        _io.emit(`new-noti-${user_id}`, notification);
        _io.emit(`user-info-${user_id}`, user);
      } else {
        const membership = vnp_OrderInfo.split("+")[1];

        const user = await User.findById(user_id);
        user.membership = membership;
        await user.save();

        // create transaction
        const transaction = new Transaction({
          user_id: user_id,
          payment_method: PaymentMethodEnum.VNPAY,
          amount: vnp_Amount,
          transaction_type: TransactionTypeEnum.UP_MEMBERSHIP,
          transaction_code: Date.now(),
        });
        await transaction.save();

        // Create Notification
        const notification = new Notification({
          receiver_id: user_id,
          noti_describe: `Chúc mừng! Tài khoản của bạn đã được nâng cấp thành công lên gói thành viên ${membership}`,
          noti_title: "Tài khoản của bạn đã được nâng cấp",
          noti_type: NotificationType.UP_MEMBERSHIP,
        });
        await notification.save();

        _io.emit(`new-noti-${user_id}`, notification);
        _io.emit(`user-info-${user_id}`, user);
      }

      res.render("success_vnpay", {
        vnp_TransactionNo: vnp_Params["vnp_TransactionNo"],
      });
    } else {
      res.render("error_vnpay", {
        vnp_TransactionNo: vnp_Params["vnp_TransactionNo"],
      });
    }
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = {
  createAddFundsPaymentUrl,
  createUpMemberShipPaymentUrl,
  VNPayReturn,
};
