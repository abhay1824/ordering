const WaiterCall = require("../models/WaiterCall");

const createWaiterCall = async (req, res, next) => {
  try {
    const { tableNumber } = req.body;

    if (!tableNumber) {
      return res.status(400).json({ message: "Table number is required." });
    }

    const waiterCall = await WaiterCall.create({
      tableNumber: String(tableNumber),
      status: "Pending",
      requestedAt: new Date(),
    });

    req.io.emit("waiter:called", waiterCall);
    return res.status(201).json(waiterCall);
  } catch (error) {
    return next(error);
  }
};

const getWaiterCalls = async (req, res, next) => {
  try {
    const calls = await WaiterCall.find().sort({ createdAt: -1 });
    return res.status(200).json(calls);
  } catch (error) {
    return next(error);
  }
};

const resolveWaiterCall = async (req, res, next) => {
  try {
    const call = await WaiterCall.findByIdAndUpdate(
      req.params.id,
      { status: "Resolved" },
      { new: true, runValidators: true }
    );

    if (!call) {
      return res.status(404).json({ message: "Waiter call not found." });
    }

    req.io.emit("waiter:resolved", call);
    return res.status(200).json(call);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createWaiterCall,
  getWaiterCalls,
  resolveWaiterCall,
};
