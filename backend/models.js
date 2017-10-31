const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.statics.findOrCreate = function(username, password, callback) {
  let message;
  User.findOne({username})
  .then(user => {
    if (user) {//login
      callback(null, user);
    }
    else {//create user
      User.create({
        username,
        password,
      })
      .then(resp => {
        callback(null, resp);
      })
      .catch(err => {
        message = 'Error creating user within findOrCreate static';
        callback(null, null);
      });
    }
  })
  .catch(err => {
    callback(null, null);
  });
};

const DocSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'untitled',
  },
  password: {
    type: String,
    required: true,
  },
  contents: {// most recent state
    type: String,
    default: '',
  },
  collaborators: {
    type: Array,// array of mongoose user ids
    default: [],// initialize with req.user.id upon POST /doc/new
  },
  created: {
    type: Date,
    default: new Date().getTime(),
  },
  last_edit: {
    type: Date,
    default: new Date().getTime(),// update each time POST /doc/save
  },
  revision_history: {
    type: Array,
    default: [],// push to upon each PUT /doc/:id
  },
});

const User = mongoose.model('User', UserSchema);
const Doc = mongoose.model('Doc', DocSchema);

module.exports = {
  User,
  Doc,
};
