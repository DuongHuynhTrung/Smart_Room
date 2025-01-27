const mongoose = require("mongoose");
const UserRankEnum = require("../../enum/UserRankEnum");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      maxLength: 255,
    },
    dob: {
      type: Date,
    },
    email: {
      type: String,
      maxLength: 255,
    },
    phone_number: {
      type: String,
      maxLength: 10,
    },
    country: {
      type: String,
    },
    gender: {
      type: String,
    },
    password: {
      type: String,
    },
    avatar_url: {
      type: String,
    },
    rank: {
      type: String,
      default: UserRankEnum.NORMAL,
    },
    role: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
