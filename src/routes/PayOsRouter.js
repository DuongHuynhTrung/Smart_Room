const express = require("express");
const payOsRouter = express.Router();

const {
  createAddFundsPayOsUrl,
  createUpMembershipPayOsUrl,
  payOsCallBack,
  createPostRoomPayOsUrl,
} = require("../app/controllers/PayOsController");
const { validateToken } = require("../app/middleware/validateTokenHandler");

payOsRouter.post("/create_add_funds", validateToken, createAddFundsPayOsUrl);
payOsRouter.post("/create_post_room", validateToken, createPostRoomPayOsUrl);
payOsRouter.post(
  "/create_up_membership/:membership",
  validateToken,
  createUpMembershipPayOsUrl
);
payOsRouter.post("/callback", payOsCallBack);

module.exports = payOsRouter;
