const mongoose = require("mongoose");

const tempTransactionSchema = mongoose.Schema(
  {
    orderCode: {
      type: Number,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    membership: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TempTransaction", tempTransactionSchema);
