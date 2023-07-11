const movies = require("../db/seeds/01_movies");

function list(req, res) {
    res.json({ data: movies });
}

module.exports = {
    list,
};