// firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Adjust the path if needed

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://annapurna-3a298-default-rtdb.firebaseio.com", // Use your database URL
});

module.exports = admin;
