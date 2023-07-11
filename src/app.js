if (process.env.USER) require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const moviesRouter = require("./movies/movies.router");

app.use(cors());
app.use(express.json());

app.use("/movies", moviesRouter);



module.exports = app;
