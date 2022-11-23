var createError = require('http-errors');
var express = require('express');
const session = require("express-session")
const MongoStore = require('connect-mongo');
const passport = require("passport")
var path = require('path');
const mongoose = require("mongoose")
require("dotenv").config()

var indexRouter = require('./routes/indexRouter')
var postsRouter = require('./routes/postsRouter');
var usersRouter = require('./routes/usersRouter');

var app = express();

mongoose.connect(process.env.DB_STRING)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ 
    mongoUrl: process.env.DB_STRING, 
    collection: 'sessions' 
  }),
  cookie: {
      maxAge: 1000 * 60 * 60 * 24
  }
}));

require("./passwordConfig/passport")

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.title = "Error"
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.user = false

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
