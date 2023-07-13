if (process.env.USER) require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const moviesRouter = require("./movies/movies.router");
const reviewsRouter = require("./reviews/reviews.router");
const theatersRouter = require("./theaters/theaters.router")

app.use(cors());
app.use(express.json());

app.use("/movies", moviesRouter);
app.use("/reviews", reviewsRouter);
app.use("/theaters", theatersRouter);

//404 handler
app.use((req, res, next) => {
    next({
      status: 404,
      message: `not found: ${req.originalUrl}`
    })
  })
  
  //error handler
  app.use((error, req, res, next) => {
    const{ status = 500, message= "Internal server error" } = error;
    console.log(error)
    res.status(status).json({ error: message })
  })



module.exports = app;
