require("dotenv").config();
require("../database/index.dbconnect")();
const express = require("express");
const app = express();
const router = require("../router/index.router");

app.use(express.json());

app.use(router);

module.exports = app;