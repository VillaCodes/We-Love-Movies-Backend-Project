const router = require("express").Router();
const controller = require("./reviews.controller");
const methodNotAllowed = require("../db/errors/methodNotAllowed");

router.route("/:reviewId")
.get(controller.read)
.put(controller.put)
.delete(controller.delete)
.all(methodNotAllowed)

router.route("/").all(methodNotAllowed)


module.exports = router;

