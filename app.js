var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//add mongoose for mongodb
var mongoose = require('mongoose');
//add auth packages
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var routes = require('./routes/index');
var users = require('./routes/users');
var lists = require('./routes/lists');
var auth = require('./routes/auth');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

// add a passport config
app.use(session({
  secret: 'assignment2 auth',
  resave: true,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// get account model 
var Account = require('./models/account');
passport.use(Account.createStrategy());
passport.use(Account.createStrategy());
passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser);
passport.deserializeUser(Account.deserializeUser);




app.use('/', routes);
app.use('/users', users);
app.use('/lists', lists);
app.use('/auth', auth);
// connect to database
var db = mongoose.connection;
db.on('error', console.error.bind(console,  'DB Error: '));
db.once('open', function(callback) {
  console.log('Connected to mongodb');
});
//add a config
var configDb = require('./config/db.js');
mongoose.connect(configDb.url);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
