/* global describe, it, before */

const app = require('../backend/server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { User, Doc } = require('../backend/models');

const expect = chai.expect;
chai.use(chaiHttp);

const chaireq = chai.request(app);
const agent = chai.request.agent(app);
let id;

describe('Create a new Doc while logged in', () => {
  
  before(done => {
    User.remove()
    .then(function() {
      return Doc.remove();
    })
    .then(function() {
      done();
    });
  });

  describe('register', () => {
    it('should register a user', (done) => {
      chaireq
        .post('/user/new')
        .send({
          username: 'testJefe',
          password: 'baseball',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.user).to.be.an('object').with.any.keys('username', 'password');
          expect(res);
          done();
        });
    });
  });

  describe('login', () => {
    it('should login with local strategy', (done) => {
      agent
        .post('/user/login')
        .send({
          username: 'testJefe',
          password: 'baseball',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.user).to.be.an('object').that.includes.any.keys('username', 'password');
          done();
        });
    });
  });

  describe('create a doc', () => {
    it('should create a doc with the logged in user as the first collaborator', (done) => {
      agent
        .post('/doc/new')
        .send({
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.doc).to.be.an('object');
          expect(res.body.doc).to.have.property('title', 'untitled');
          expect(res.body.doc.collaborators).to.be.an('array').with.length(1);
          id = res.body.doc._id;
          done();
        });
    });
  });

  describe('get all docs', () => {
    it('should return an array of 1 doc', (done) => {
      agent
        .get('/doc')
        .end((err, res) => {
          expect(res.body.docs).to.be.an('array').with.length(1);
          done();
        });
    });
  });

  describe('update the text of a doc', () => {
    it('should return an array of 1 doc', (done) => {
      agent
        .put('/doc/' + id)
        .send({
          contents: 'updated contents',
        })
        .end((err, res) => {
          expect(res.body.doc.contents).to.equal('updated contents');
          done();
        });
    });
  });


});
