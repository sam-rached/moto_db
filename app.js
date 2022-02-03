const express = require("express");
const app = express();
const connection = require("./db-config");
const cors = require("cors");
const router = require("./routes/index.routes");

const port = process.env.PORT || 8000;

connection.connect((err) => {
  if (err) {
    console.error("error connecting" + err.stack);
  } else {
    console.log("connected as id" + connection.threadId);
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`Server listening port ${port}`);
});

module.exports = app;
