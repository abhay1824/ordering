const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: true,
      trim: true,
    },
    items: {
      type: [orderItemSchema],
      validate: [(items) => items.length > 0, "Order must have at least one item."],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Completed"],
      default: "Pending",
    },
    placedAt: {
      type: Date,
      default: Date.now,
    },
    estimatedPrepTimeMins: {
      type: Number,
      default: 20,
      min: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
