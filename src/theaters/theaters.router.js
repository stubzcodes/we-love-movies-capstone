const controller = require("./theaters.controller")
const methodNotAllowed = require("../errors/methodNotAllowed");
const router = require("express").Router();

router.route("/")
    .get(controller.list)
    .all(methodNotAllowed);

module.exports = router;