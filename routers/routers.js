const express = require('express');
const router = express.Router();
const controller = require('../controller/userController')

router.post("/sign-up", controller.addUser);
router.post("/login", controller.loginUser);

router.post("/user-Detail", controller.userDate);


module.exports = router;