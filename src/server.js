const express = require("express");
const app = express();
const db = require("./db.js");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const createUserEndpoints = require("./api/userApi");
const createContactEndpoints = require("./api/contactApi");

const HTTP_PORT = process.env.PORT || 8000;

app.listen(HTTP_PORT, () => {
  console.log("Server running on :", HTTP_PORT);
});

app.get("/", (req, res, next) => {
  res.json({ message: "ok" });
});

createUserEndpoints(app, db);
createContactEndpoints(app, db);

// // Default response for any other request
// app.use("*", function (req, res) {
//   console.log("Sending the default response", req.path);
//   res.status(404);
//   res.send();
// });
