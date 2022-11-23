var express = require('express');
var router = express.Router();
const { isAdmin } = require('./authMiddleware');
const {
  users_get,
} = require("../controllers/usersController");

router.route("/")
  .get(isAdmin, users_get)

module.exports = router