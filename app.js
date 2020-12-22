var createError = require('http-errors');

const passport = require('passport');
const cookieSession = require('cookie-session')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var hotelRouter = require('./routes/hotel');
// require('/passport-setup')
var hbs = require('express-handlebars')
var app = express();
var fileUpload = require('express-fileUpload')
var db = require('./config/connection')
var session=require('express-session')
// view engine setup
app.use(cookieSession({
  name: 'tuto-session',
  keys: ['key1', 'key2']
}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/', partialsDir: __dirname + '/views/partials/' }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
app.use(session({secret:"hash",cookie:{maxAge:6000000}}))
app.use(passport.initialize());
app.use(passport.session());
db.connect((err) => {
  if (err) console.log("connection error" + err);
  else console.log("database connected successfully 27");

})
app.use('/', usersRouter);
app.use('/admin', adminRouter);
app.use('/hotel', hotelRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
