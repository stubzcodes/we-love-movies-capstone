// const movies = require("../db/seeds/01_movies");
const knex = require("../db/connection");

function list(req, res) {
  const { is_showing } = req.query;

  if (is_showing === "true") {
    knex("movies as m")
      .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
      .select("m.*")
      .where({ "mt.is_showing": true })
      .groupBy("m.movie_id")
      .then((movies) => {
        res.json({ data: movies });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  } else {
    knex("movies")
      .select("*")
      .then((movies) => {
        res.json({ data: movies });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
}

function movieExists(req, res, next) {
  const { movieId } = req.params;

  const movie = knex("movies")
    .select("*")
    .where({ "movies.movie_id": movieId })
    .first();

  if (movie) {
    res.locals.movie = movie;
    next();
  } else {
    res.status(404).json({ error: "Movie not found." });
  }
}

async function read(req, res, next) {
  const { movieId } = req.params;

  try {
    const movie = await knex("movies")
      .select("*")
      .where({ movie_id: movieId })
      .first();

    if (movie) {
      res.json({ data: movie });
    } else {
      next({ status: 404, message: "Movie not found" });
    }
  } catch (error) {
    next(error);
  }
}

async function getTheatersByMovieId(req, res) {
  const { movieId } = req.params;

  try {
    const theaters = await knex("theaters as t")
      .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
      .select("t.*")
      .where({ "mt.movie_id": movieId });

    res.json({ data: theaters });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "No theaters showing this movie." });
  }
}

async function getReviewsByMovieId(req, res) {
  const { movieId } = req.params;

  try {
    const reviews = await knex("reviews as r")
      .join("critics as c", "r.critic_id", "c.critic_id")
      .select("*")
      .where({ "r.movie_id": movieId });

      const formattedReviews = reviews.map((review) => ({
        review_id: review.review_id,
        content: review.content,
        score: review.score,
        created_at: review.created_at,
        updated_at: review.updated_at,
        critic_id: review.critic_id,
        movie_id: review.movie_id,
        critic: {
          critic_id: review.critic_id,
          preferred_name: review.preferred_name,
          surname: review.surname,
          organization_name: review.organization_name,
          created_at: review.critic_created_at,
          updated_at: review.critic_updated_at,
        },
      }));

    res.json({ data: formattedReviews });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "No reviews for this movie." });
  }
}

module.exports = {
  list,
  read: [movieExists, read],
  getTheatersByMovieId: [movieExists, getTheatersByMovieId],
  getReviewsByMovieId: [movieExists, getReviewsByMovieId],
};
