var express = require('express');
const passport = require('passport');
var router = express.Router();
const {
  signup_get,
  signup_post,
  signin_get,
  signin_failure,
  club_get,
  club_post,
  logout,
} = require('../controllers/indexController');

router.get('/', (req, res) => {
  res.redirect("/posts")
});

router.route("/club")
  .get(club_get)
  .post(club_post)

router.route("/signup")
  .get(signup_get)
  .post(signup_post)

router.route("/signin")
  .get(signin_get)
  .post(passport.authenticate('local', { failureRedirect: '/signin-failure', successRedirect: "/posts" }))

router.get('/signin-failure', signin_failure)

router.get("/logout", logout)

module.exports = router;