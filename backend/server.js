const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const User = require('./models').User;
const routes = require('./routes');

mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});

const app = express();
app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat',
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  save: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

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
    User.findOrCreate(username, password, function (err, user) {
      if (err) { return done(err, null); } // error
      else {
        return done(null, user); //register
      }
    });
  }
));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/socket.html');
});

app.use(routes(passport));

const server = app.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!\n');
});

const io = require('socket.io').listen(server);

io.on('connect', onConnect);

function onConnect(socket) {

  const colorAssignment = ['blue', 'red', 'yellow', 'green', 'purple', 'cyan'];

  // console.log("IS IT GETTING IN?", socket);
  const rooms = io.sockets.adapter.rooms;
  socket.on('connection', (room) => {
    // add new cursor color to beginning of all text editors
    //on join they should be updated on what
    socket.join(room);
    console.log("new user joined", rooms[room]);
    if(rooms[room]['currentContentState']) {
      socket.emit('state update', rooms[room]['currentContentState']);
    }
    socket.emit('color assign', colorAssignment[rooms[room]['length']]);
  });

  socket.on('disconnect', () => {
    // remove that cursor from all editors
    console.log('user disconnected');
  });

  socket.on('change doc', (contents) => {
    // chnage doc across all editors
    if(io.sockets.adapter.rooms[contents.room]) {
      io.sockets.in(contents.room).emit('change doc', contents.content);
      rooms[contents.room]['currentContentState'] = contents.content;
    }

  });

}

module.exports = server;
