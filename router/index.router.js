const router = require("express").Router();
const controller = require("../controller/index.controller");

router.get("/", controller.index);

module.exports = router;