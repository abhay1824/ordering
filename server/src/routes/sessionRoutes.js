const express = require("express");
const {
  getOrCreateSession,
  updateSessionStatus,
  getSessions,
  getSessionStatus,
  getSessionBill,
} = require("../controllers/sessionController");

const router = express.Router();

router.post("/", getOrCreateSession);
router.get("/", getSessions);
router.get("/status/:sessionId", getSessionStatus);
router.get("/status/:sessionId/bill", getSessionBill);
router.put("/:id", updateSessionStatus);

module.exports = router;
