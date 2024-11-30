const app = require("./index");
const connect = require("./config/db");
const cors = require("cors");

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// const express = require("express");
// const path = require('path');
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(5000, async () => {
  await connect();
  console.log("Listening on the port 5000");
});
