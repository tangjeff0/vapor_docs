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
  docs: {// array of Doc _ids
    type: Array,
    default: [],
  },
});

// use mongoose _id's as document ids
const DocSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'untitled',
  },
  contents: {// most recent state
    type: String,
    default: '',
  },
  collaborators: {
    type: Array,// array of user ids
    default: [],// initialize with req.user
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
    default: [],// update each time POST /doc/save
  },
});

const User = mongoose.model('User', UserSchema);
const Doc = mongoose.model('Doc', DocSchema);

module.exports = {
  User,
  Doc,
};
