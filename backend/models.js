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
  User.findOne({ username })
  .then(user => {
    if (!user) {
      User.create({
        username,
        password,
      })
      .then(resp => { callback(null, resp); }) // register
      .catch(err => { callback(err, null); }); // error
    }
    else if (password !== user.password) { // invalid password
      callback("Passwords do not match.", null);
    }
    else { // user authenticated, pass user
      callback(null, user);
    }
  })
  .catch(err => {
    callback(err, null);
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
  created_at: {
    type: Number,
    default: new Date().getTime(),
  },
  contents: {// most recent state
    type: String,
    default: '',
  },
  last_edit: {
    type: Number,
    default: new Date().getTime(),// update each time POST /doc/save
  },
  collaborators: {
    type: Array,// array of mongoose user ids
    default: [],// initialize with req.user.id upon POST /doc/new
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
