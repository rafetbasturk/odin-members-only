const User = require("../models/userModel");
const async = require("async");

const users_get = (req, res, next) => {
  async.parallel(
    {
      users(cb) {
        User.find().sort({createdAt: -1}).exec(cb)
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      res.render('users/index', {
        title: 'All Users',
        user: req.user || false,
        users: results.users,
      })
    }
  )
}

module.exports = {
  users_get,
}