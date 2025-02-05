const express = require("express");
const vnPayRouter = express.Router();

const {
  createAddFundsPaymentUrl,
  VNPayReturn,
  createUpMemberShipPaymentUrl,
} = require("../app/controllers/VNPayController");
const { validateToken } = require("../app/middleware/validateTokenHandler");

vnPayRouter
  .route("/create_add_funds")
  .post(validateToken, createAddFundsPaymentUrl);

vnPayRouter
  .route("/create_up_membership/:membership")
  .post(validateToken, createUpMemberShipPaymentUrl);

vnPayRouter.get("/vnpay_return", VNPayReturn);

module.exports = vnPayRouter;
