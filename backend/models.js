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
  .then((err, user) => {
    if (err) { callback(err, null); } // error
    else if (!user) {
      User.create({
        username,
        password,
      })
      .then(resp => { callback(null, resp); }) // register
      .catch(err => { callback(err, null); }); // error
    }
    else if (password !== user.password) { // invalid password
      callback("Password's do not match.", null);
    }
    else { callback(null, user) } // return user
  });
}

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
