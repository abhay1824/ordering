const express = require("express");
const {
  createWaiterCall,
  getWaiterCalls,
  resolveWaiterCall,
} = require("../controllers/waiterCallController");

const router = express.Router();

router.post("/", createWaiterCall);
router.get("/", getWaiterCalls);
router.put("/:id/resolve", resolveWaiterCall);

module.exports = router;
