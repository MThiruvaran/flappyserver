const express = require("express");

const router = express.Router();

const scoreBoardController = require("../controller/scoreBoard");

router.get("/score-board", scoreBoardController.getScoreBoard);

module.exports = router;
