require("dotenv").config();
const cluster = require("cluster");
const os = require("os");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const controller = require("./modules");

const app = express();
const cpus = os.cpus().length;

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database has Connected");
  })
  .catch((err) => {
    console.log("Error : " + err);
  });

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(controller);
app.use("/", (req, res) => {
  res.json({ message: "Home Route" });
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port no " + process.env.PORT);
});
