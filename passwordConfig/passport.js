const passport = require("passport")
const User = require("../models/userModel")
const LocalStrategy = require("passport-local").Strategy
const { validPassword } = require("./passHelpers")

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ username })
      .then((user) => {
        if (!user) { return done(null, false) }

        const isValid = validPassword(password, user.hash, user.salt);

        if (isValid) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch((err) => {
        done(err);
      });
  })
)

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});