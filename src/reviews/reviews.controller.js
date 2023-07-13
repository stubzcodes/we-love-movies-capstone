const reviews = require("../db/seeds/03_reviews");
const knex = require("../db/connection");
const service = require("./reviews.service");

async function reviewExists(req, res, next) {
    const { reviewId } = req.params;
  
    const review = await knex("reviews")
      .select("*")
      .where({ "reviews.review_id": reviewId })
      .first();
  
    if (review) {
      res.locals.review = review;
      next();
    } else {
      res.status(404).json({ error: "Review cannot be found." });
    }
  }

async function update(req, res) {
    const updatedReview = {
        ...res.locals.review,
        ...req.body.data,
        review_id: res.locals.review.review_id,
      };
      console.log("hi, dad!")
    const data = await service.update(updatedReview);
    res.json({ data });

  }

  async function destroy(req, res) {
    const { reviewId } = req.params;
    await service.delete(reviewId);
    res.sendStatus(204);

  }
  

  module.exports = {
    update: [reviewExists, update],
    delete: [reviewExists, destroy]
  };