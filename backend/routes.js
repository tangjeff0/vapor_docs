const express = require('express');
const router = express.Router();

const User = require('./models').User;
const Doc = require('./models').Doc;

router.post('/doc/new', (req, res) => {
  Doc.create()
    .then(resp => {
      console.log('\nPOST /doc/new successful');
    })
    .catch(err => {
      console.log('\nPOST /doc/new unsuccessful :(');
    });
});

module.exports = router;
