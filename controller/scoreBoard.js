const db = require("../firebase");

exports.getScoreBoard = async (req, res, next) => {
  try {
    const scoreSnapshot = await db
      .collection("scores")
      .orderBy("score", "desc")
      .get();
    let scoreArray = [];
    scoreSnapshot.forEach((doc) => {
      scoreArray.push(doc.data());
    });
    res
      .status(200)
      .render("scoreBoard", {
        pageTitle: "Score Board",
        path: "/score-board",
        data: scoreArray,
      });
  } catch (error) {
    console.log(error);
  }
};
