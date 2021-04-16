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
    await db.collection("scores").add(data);
    res.redirect("/score-board");
  } catch (error) {
    console.log(error);
  }
};
