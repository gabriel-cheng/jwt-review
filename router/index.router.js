const router = require("express").Router();
const controller = require("../controller/index.controller");
const middleware = require("../middlewares/index.middlewares");

router.delete("/users/delete/:id", controller.deleteUser);
router.put("/users/update/password/:id", controller.updateUserPassword);
router.patch("/users/update/:id", controller.updateUser);
router.post("/users/register", controller.registerNewUser);
router.get("/users/:id", controller.findUserById);
router.post("/users/login", controller.userLogin);
router.get("/users", middleware.checkAdminToken, controller.index);

module.exports = router;