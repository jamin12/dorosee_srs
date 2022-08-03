var express = require("express");
var path = require("path");
var app = express();

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/view/login.html"));
  // res.render('/views/index.html',{title: 'Hey'});
});

module.exports = app;