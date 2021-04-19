const db = require("../firebase");
const url = require("url");
exports.getScoreBoard = async (req, res, next) => {
  const urlParts = url.parse(req.url, true);
  score = parseInt(urlParts.query.score);
  try {
    const scoreSnapshot = await db
      .collection("scores")
      .orderBy("score", "desc")
      .limit(10)
      .get();
    let scoreArray = [];
    scoreSnapshot.forEach((doc) => {
      scoreArray.push(doc.data());
    });
    res.status(200).render("scoreBoard", {
      pageTitle: "Score Board",
      path: "/score-board",
      data: scoreArray,
      yourScore: null || score,
    });
  } catch (error) {
    console.log(error);
  }
};
