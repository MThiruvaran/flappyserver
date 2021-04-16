const path = require("path");
const express = require("express");
const app = express();

const cron = require("node-cron");
const nodemailer = require("nodemailer");

const db = require("./firebase");

const port = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.set("views", "views");

const detailsRoutes = require("./router/details");
const scoreBoardRoutes = require("./router/scoreBoard");
const errorController = require("./controller/error");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "thiruvaran00@gmail.com",
    pass: "@NeverGiveup329",
  },
});

const getScores = async () => {
  const scoresRef = db.collection("scores");
  const snapshot = await scoresRef.get();
  let scoreArray = [];
  snapshot.forEach((doc) => {
    scoreArray.push(doc.data());
  });
  const topScore = scoreArray.reduce(
    (acc, value) => {
      if (acc.score < value.score) {
        acc = value;
        return acc;
      } else {
        return acc;
      }
    },
    { score: 0 }
  );
  return topScore;
};

cron.schedule("59 23 * * saturday", async () => {
  try {
    const topScorer = await getScores();
    const mailOptions = {
      from: "thiruvaran00@gmail.com",
      to: "joxergame@gmail.com",
      subject: "this an auto generated email don't reply",
      text: `the top score of this week is ${topScorer.score} and that is scored by ${topScorer.name} and his email address is: ${topScorer.email}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/", (req, res, next) => {
  res.status(200).render("game", {
    pageTitle: "Game",
    path: "/",
  });
});

app.use("/details", detailsRoutes);
app.use(scoreBoardRoutes);

app.use(errorController.get404);

app.listen(port, () => console.log("server listening to the port: ", port));
