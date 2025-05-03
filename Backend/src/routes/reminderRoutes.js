const express = require("express");
const router = express.Router();
const controller = require("../controllers/reminderController");

router.get("/employer/:id", controller.getByEmployer);
router.get("/jobseeker/:id", controller.getByJobseeker); // ← Add this line

module.exports = router;
