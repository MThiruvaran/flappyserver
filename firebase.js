const admin = require("firebase-admin");
const serviceAccount = require("./flappy-85673-firebase-adminsdk-ptpzn-f560178555.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
