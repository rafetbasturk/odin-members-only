module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  }
  else {
    res.status(401).json({ msg: "You are not authorized to see this page." })
  }
}

module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    next()
  }
  else {
    res.status(401).render("error", {
      title: "Error",
      user: req.user || false,
      message: "You are not authorized to see this page.",
      error: {}
    })
  }
}