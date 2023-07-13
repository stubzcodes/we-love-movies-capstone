// const reviews = require("../db/seeds/03_reviews");
const controller = require("./reviews.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const router = require("express").Router();


router.route("/:reviewId")
    .put(controller.update)
    .delete(controller.delete)
    .all(methodNotAllowed);

module.exports = router;
