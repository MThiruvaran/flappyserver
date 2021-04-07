const express = require("express");
const detailsController = require("../controller/details");

const router = express.Router();

router.get("/get-details", detailsController.getDetailsPage);
router.post("/player-details", detailsController.saveDetails);

module.exports = router;
