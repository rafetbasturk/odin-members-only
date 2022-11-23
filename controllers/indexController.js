const User = require("../models/userModel");
const { genPassword } = require("../passwordConfig/passHelpers");
const { body, validationResult } = require("express-validator");

const signup_get = (req, res) => {
  res.render('index/signup', {
    title: 'Sign up for free',
    fname: "",
    lname: "",
    username: "",
    password: "",
    confirm: "",
    admin: true,
    errors: {},
    user: req.user || false
  });
}

const signup_post = [
  body("fname", "First name is required and should be at least 2 characters.")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("lname", "Last Name required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "Email required")
    .trim()
    .isEmail()
    .escape(),
  body('password', "Password must be at least 5 characters")
    .isLength({ min: 5 })
    .escape(),
  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  body("admin").escape(),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.render("index/signup", {
        title: "Sign Up",
        ...req.body,
        user: req.user || false,
        errors: errors.array()
      });
      return
    }

    User.find().then(result => {
      const userExist = result.some(user => user.username === req.body.username)
      if (userExist) {
        return next({ message: "User already exists!" })
      }
      else {
        const saltHash = genPassword(req.body.password);

        const newUser = new User({
          fname: req.body.fname,
          lname: req.body.lname,
          username: req.body.username,
          membershipStatus: req.body.admin === "on" ? "club" : "",
          admin: req.body.admin === "on" ? true : false,
          ...saltHash
        });

        newUser.save(err => {
          if (err) {
            return next(err)
          }
          res.redirect('/signin');
        })
      }
    }).catch(err => console.log(err))
  }
]

const signin_get = (req, res) => {
  res.render('index/signin', {
    title: 'sign in',
    errors: {},
    user: false,
    username: ""
  });
}

const signin_failure = (req, res) => {
  res.render("error", {
    title: "Error",
    message: "Wrong password",
    user: req.user || false,
    error: {
      status: 401,
    }
  })
}

const club_get = (req, res) => {
  res.render("index/club", {
    title: "Join the club",
    user: req.user,
    errors: {}
  })
}

const club_post = [
  body("secret", "Secret is required to join the club!")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.render("index/club", {
        title: "Join the club",
        user: req.user || false,
        errors: errors.array()
      });
      return
    }

    if (req.body.secret === process.env.SECRET) {
      User.findByIdAndUpdate(req.user._id, { membershipStatus: "club" })
        .then(result => {
          res.redirect("/posts")
        })
        .catch(err => next(err))
    }
    else {
      res.render("error", {
        title: "Error",
        message: "Wrong secret phrase",
        user: req.user || false,
        error: {
          status: 401,
        }
      })
    }
  }
]

const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/posts');
  });
}

module.exports = {
  signup_get,
  signup_post,
  signin_get,
  signin_failure,
  club_get,
  club_post,
  logout,
}