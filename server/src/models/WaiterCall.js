const mongoose = require("mongoose");

const waiterCallSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Resolved"],
      default: "Pending",
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WaiterCall", waiterCallSchema);
