const mongoose = require("mongoose");
const { RoomStatusEnum } = require("../../enum/RoomEnum");

const roomSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
    },
    type: {
      type: String,
    },
    price: {
      type: Number,
    },
    category: {
      type: String,
    },
    area: {
      type: String,
    },
    description: {
      type: String,
    },
    objects: {
      type: [String],
    },
    environments: {
      type: [String],
    },
    utilities: {
      type: [String],
    },
    address: {
      type: String,
    },
    img_links: {
      type: [String],
    },
    status: {
      type: String,
      default: RoomStatusEnum.UNDER_REVIEW,
    },
    contact_fullname: {
      type: String,
    },
    contact_phone: {
      type: String,
    },
    contact_email: {
      type: String,
    },
    contact_address: {
      type: String,
    },
    reason_rejected: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);
