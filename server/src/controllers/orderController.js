const Order = require("../models/Order");

const calculateTotal = (items) =>
  items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

const createOrder = async (req, res, next) => {
  try {
    const { items, tableNumber } = req.body;

    if (!tableNumber) {
      return res.status(400).json({ message: "Table number is required." });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must include at least one item." });
    }

    const totalPrice = calculateTotal(items);
    const estimatedPrepTimeMins = Math.max(
      10,
      items.reduce((sum, item) => sum + Number(item.quantity) * 4, 0)
    );

    const order = await Order.create({
      tableNumber: String(tableNumber),
      items,
      totalPrice,
      status: "Pending",
      placedAt: new Date(),
      estimatedPrepTimeMins,
    });

    req.io.emit("order:created", order);

    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Preparing", "Completed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status." });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    req.io.emit("order:updated", updatedOrder);

    return res.status(200).json(updatedOrder);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
