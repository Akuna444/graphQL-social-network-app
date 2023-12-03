const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const feedRoutes = require("./routes/feed");
const { error } = require("console");

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  const statusCode = error?.statusCode || 500;
  const message = error.message;
  res.status(statusCode).json({
    message,
  });
});
mongoose
  .connect(
    "mongodb+srv://akuna444:lYlyqPjkwCsbU51A@cluster0.ex41jje.mongodb.net/social-net"
  )
  .then((result) => {
    app.listen(8080);
    console.log("App Started");
  })
  .catch((err) => {
    console.log(err);
  });
