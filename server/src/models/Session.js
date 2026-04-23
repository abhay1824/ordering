const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["INACTIVE", "ACTIVE", "CLOSED"],
      default: "INACTIVE",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    activatedAt: {
      type: Date,
    },
    closedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Ensure only one non-closed session per table at a time
sessionSchema.index(
  { tableNumber: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ["INACTIVE", "ACTIVE"] } } }
);

module.exports = mongoose.model("Session", sessionSchema);
