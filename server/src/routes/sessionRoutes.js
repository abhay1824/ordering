const express = require("express");
const {
  getOrCreateSession,
  updateSessionStatus,
  getSessions,
  getSessionStatus,
} = require("../controllers/sessionController");

const router = express.Router();

router.post("/", getOrCreateSession);
router.get("/", getSessions);
router.get("/status/:sessionId", getSessionStatus);
router.put("/:id", updateSessionStatus);

module.exports = router;
