const express = require('express');

const User = require('./models').User;
const Doc = require('./models').Doc;

module.exports = (passport) => {

  const router = express.Router();

  router.post('/user/new', (req, res) => {
    User.create({
      username: req.body.username,
      password: req.body.password,
    })
      .then(resp => {
        res.json({message: 'user created!', user: resp});
      })
      .catch(err => {
        res.json({message: 'user failed to create: ' + err});
      });
  });

  router.post('/user/login', passport.authenticate('local'), (req, res) => {
    res.json({message: 'localStrategy authenticated!', user: req.user});
  });

  // optional auth wall would be here

  router.post('/doc/new', (req, res) => {
    Doc.create({
      collaborators: [req.user],
    })
      .then(resp => {
        res.json({doc: resp});
      })
      .catch(err => {
        res.json({error_message: err});
      });
  });

  router.get('/doc', (req, res) => {
    Doc.find().sort({last_edited: -1})
      .then(resp => {
        res.json({docs: resp});
        /* console.log('\nPOST /doc/new successful'); */
      })
      .catch(err => {
        /* console.log('\nPOST /doc/new unsuccessful :('); */
      });
  });

  return router;
};
