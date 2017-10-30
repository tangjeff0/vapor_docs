const express = require('express');

const { User, Doc } = require('./models');

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

  router.use((req, res, next) => {
    if (!req.user) res.json({message: 'gotta be logged in fa dat ;)'});
    else next();
  });

  router.post('/doc/new', (req, res) => {
    if (!req.body.password) res.json({message: 'doc needs a password!'});
    else {
      Doc.create({
        password: req.body.password,
        collaborators: [req.user.id],
      })
      .then(resp => {
        res.json({doc: resp});
      })
      .catch(err => {
        res.json({error_message: err});
      });
    }
  });

  router.get('/docs', (req, res) => {
    Doc.find().sort({last_edited: -1})
      .then(resp => {
        res.json({docs: resp});
      })
      .catch(err => {
        res.json({error_message: err});
      });
  });

  router.get('/doc/:id', (req, res) => {
    Doc.findById(req.params.id)
      .then(resp => {
        if (resp.collaborators.indexOf(req.user.id) === -1) {
          res.json({message: 'sorry, you are not yet a collaborator on this doc :('});
        }
        else {
          res.json({doc: resp});
        }
      })
      .catch(err => {
        res.json({error_message: err});
      });
  });

  router.put('/doc/:id', (req, res) => {
    Doc.findById(req.params.id)
      .then(doc => {
        doc.contents = req.body.contents;
        doc.save(err => {
          if (!err) res.json({doc});
        });
      })
      .catch(err => {
        res.json({error_message: err});
      });
  });


  return router;
};
