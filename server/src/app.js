const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const waiterCallRoutes = require("./routes/waiterCallRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const errorHandler = require("./utils/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",") || "*",
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/products", productRoutes);
app.use("/api/orders", (req, res, next) => {
  req.io = app.get("io");
  next();
}, orderRoutes);
app.use(
  "/api/waiter-calls",
  (req, res, next) => {
    req.io = app.get("io");
    next();
  },
  waiterCallRoutes
);
app.use(
  "/api/sessions",
  (req, res, next) => {
    req.io = app.get("io");
    next();
  },
  sessionRoutes
);

app.use(errorHandler);

module.exports = app;
