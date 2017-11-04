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
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
      if (err) { return done(err, null); }
      return done(null, user); //register
    });
  }
));

app.get('/', function (req, res) {
  res.send('hello world');
});

app.use(routes(passport));

const server = app.listen(3000, function () {
  console.log('\nBackend server for Electron App running on port 3000!\n');
});

const io = require('socket.io').listen(server);

io.on('connect', onConnect);

function onConnect(socket) {

  const rooms = io.sockets.adapter.rooms;
  const colors = ['red', 'dodgerblue', 'green', 'magenta', 'cyan', 'purple'];
  socket.on('connection', (room) => {
    socket.join(room);
    if (rooms[room].currentContentState) {
      socket.emit('state update', rooms[room].currentContentState);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('change doc', (contents) => {
    if(io.sockets.adapter.rooms[contents.room]) {
      var socketIdArray = Object.keys(rooms);
      const selectedColor = colors[socketIdArray.indexOf(contents.socketId)];
      contents.userObj = {};
      if(contents.data) {
        contents.userObj[contents.socketId] = {color: selectedColor, top: contents.data.loc.top, left: contents.data.loc.left, right: contents.data.loc.right};
      }
      socket.to(contents.room).emit('change doc', contents);
      rooms[contents.room].currentContentState = contents.content;
    }
  });

}

module.exports = server;
