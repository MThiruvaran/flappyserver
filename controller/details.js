const db = require("../firebase");
const url = require("url");
exports.getDetailsPage = (req, res, next) => {
  const urlParts = url.parse(req.url, true);
  score = parseInt(urlParts.query.score);
  res.status(200).render("details", {
    pageTitle: "Details",
    path: "/player/details",
    score,
  });
};

exports.saveDetails = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const score = parseInt(req.body.score);

  const data = {
    name,
    email,
    score,
  };

  try {
    const scoreRef = await db.collection("scores").add(data);
    const score = await db.collection("scores").doc(scoreRef.id).get();
    const scoreData = score.data();
    res.redirect(`/score-board?score=${scoreData.score}`);
  } catch (error) {
    console.log(error);
  }
};
