var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments')


const cors = require('cors');
var app = express();

//dotenv
require('dotenv').config();

//sesion
const session = require('express-session');
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);


//passport
const passport = require('passport');


//jwt strategy
app.use(passport.initialize());
require('./db/passport')(passport)

//body parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//cors
app.use(cors({
  origin: 'https://chumbook.netlify.app', // React app runs here
  // origin: 'http://localhost:5173', // React app runs here
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true 
}));

//combine fe-be
app.use(express.static(path.join(__dirname, 'public')));






// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', passport.authenticate('jwt', {session: false}), postsRouter);
app.use('/comments',passport.authenticate('jwt', {session: false}), commentsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
