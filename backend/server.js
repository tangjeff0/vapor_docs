const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

const User = require('./models').User;
const routes = require('./routes');

mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});

const app = express();
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


// passport 
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username, password }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password !== password) { return done(null, false); }
      return done(null, user);
    });
  }
));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/user/new', (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
  })
    .then(resp => {
      console.log('\nPOST /user/new successful', {message: 'user created!', user: resp});
      res.json({message: 'user created!', user: resp});
    })
    .catch(err => {
      console.log('\nPOST /user/new unsuccessful :( Error:', err);
      res.json({message: 'user failed to create: ' + err});
    });
});

app.post('/user/login', passport.authenticate('local', (req, res) => {
  res.json({message: 'localStrategy authenticated!', user: req.user});
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!');
});
