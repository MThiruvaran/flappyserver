const db = require("../firebase");

exports.getDetailsPage = (req, res, next) => {
  res
    .status(200)
    .render("details", { pageTitle: "Details", path: "/player/details" });
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
