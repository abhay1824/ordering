const Session = require("../models/Session");
const crypto = require("crypto");

const getOrCreateSession = async (req, res, next) => {
  try {
    const { tableNumber } = req.body;

    if (!tableNumber) {
      return res.status(400).json({ message: "Table number is required." });
    }

    // Check for an existing ACTIVE session for this table
    let session = await Session.findOne({ tableNumber, status: "ACTIVE" });

    if (session) {
      return res.status(200).json(session);
    }

    // Check for an existing INACTIVE session for this table
    session = await Session.findOne({ tableNumber, status: "INACTIVE" });
    if (session) {
      return res.status(200).json(session);
    }

    // Create a new INACTIVE session
    const sessionId = crypto.randomBytes(16).toString("hex");
    try {
      session = await Session.create({
        tableNumber,
        sessionId,
        status: "INACTIVE",
        createdAt: new Date(),
      });

      req.io.emit("session:created", session);
      return res.status(201).json(session);
    } catch (error) {
      // If a duplicate key error occurs, it means another request just created the session
      if (error.code === 11000) {
        session = await Session.findOne({ tableNumber, status: { $in: ["INACTIVE", "ACTIVE"] } });
        return res.status(200).json(session);
      }
      throw error;
    }
  } catch (error) {
    return next(error);
  }
};

const updateSessionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["INACTIVE", "ACTIVE", "CLOSED"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid session status." });
    }

    const updates = { status };
    if (status === "ACTIVE") {
      updates.activatedAt = new Date();
    } else if (status === "CLOSED") {
      updates.closedAt = new Date();
    }

    const updatedSession = await Session.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedSession) {
      return res.status(404).json({ message: "Session not found." });
    }

    req.io.emit("session:updated", updatedSession);

    return res.status(200).json(updatedSession);
  } catch (error) {
    return next(error);
  }
};

const getSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 }).limit(50);
    return res.status(200).json(sessions);
  } catch (error) {
    return next(error);
  }
};

const getSessionStatus = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    return res.status(200).json(session);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getOrCreateSession,
  updateSessionStatus,
  getSessions,
  getSessionStatus,
};
