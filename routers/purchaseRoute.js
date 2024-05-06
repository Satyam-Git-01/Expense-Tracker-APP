const express = require("express");
const authenticatemiddleware = require("../middlewares/auth");

const {
  updateTransactionStatus,
  purchasePremium,
} = require("../controllers/purchaseMembershipController");

const router = express.Router();
router.get("/premiumMembership", authenticatemiddleware, purchasePremium);
router.post(
  "/updateTransactionStatus",
  authenticatemiddleware,
  updateTransactionStatus
);

module.exports = router;
