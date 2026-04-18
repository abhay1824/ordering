require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL?.split(",") || "*",
      },
    });

    io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);
      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });

    app.set("io", io);

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
