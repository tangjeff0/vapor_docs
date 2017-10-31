/* global describe, it, before */

const server = require('../backend/server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { User, Doc } = require('../backend/models');

const expect = chai.expect;
chai.use(chaiHttp);

const notAgent = chai.request(server);
const agent = chai.request.agent(server);
let docId0;

describe('Milestone 2 Tests', () => {

  before(done => {
    User.remove()
    .then(function() {
      return Doc.remove();
    })
    .then(function() {
      done();
    });
  });

  describe('POST /user/findOrCreate', () => {

    it('should return a user bc none exists yet', (done) => {
      agent.post('/user/findOrCreate')
        .send({
          username: 'testJefe',
          password: 'baseball',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.user).to.be.an('object').with.any.keys('username', 'password');
          done();
        });
    });

    it('should login with same passwords', (done) => {
      agent.post('/user/findOrCreate')
        .send({
          username: 'testJefe',
          password: 'baseball',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('should return a message bc passwords do not match', (done) => {
      agent.post('/user/findOrCreate')
        .send({
          username: 'testJefe',
          password: 'football',
        })
        .end((err, res) => {
          expect(res.body).to.be.an('object').that.is.empty;
          expect(res).to.have.status(200);
          done();
        });
    });

  });

  describe('POST /doc/new', () => {
    it('should create a doc with the logged in user as the first collaborator', (done) => {
      agent
        .post('/doc/new')
        .send({
          password: 'khalid',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.doc).to.be.an('object');
          expect(res.body.doc).to.have.property('title', 'untitled');
          expect(res.body.doc.collaborators).to.be.an('array').with.length(1);
          docId0 = res.body.doc._id;
          done();
        });
    });
  });

  describe('GET /docs', () => {
    it('should not return anything bc not logged in', (done) => {
      notAgent.get('/docs')
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'gotta be logged in fa dat ;)');
          done();
        });
    });

    it('should return an array of 1 doc', (done) => {
      agent.get('/docs')
        .end((err, res) => {
          expect(res.body.docs).to.be.an('array').with.length(1);
          done();
        });
    });
  });

  describe('PUT /doc/:id', () => {
    it('should return 1 doc with updated contents', (done) => {
      agent.put('/doc/' + docId0)
        .send({
          contents: 'updated contents',
        })
        .end((err, res) => {
          expect(res.body.doc.contents).to.equal('updated contents');
          done();
        });
    });
  });

  describe('GET /doc/:id', () => {
    it('should return a doc bc user is in the collaborator array', (done) => {
      agent.get('/doc/' + docId0)
        .end((err, res) => {
          expect(res.body.doc.contents).to.equal('updated contents');
          done();
        });
    });
    it('should not return a doc if user is not a collaborator', (done) => {
      Doc.create({
        password: 'ravedotio',
        collaborators: ['partysquad'],
      })
      .then(resp => {
        agent.get('/doc/' + resp.id)
          .end((err, res) => {
            expect(res.body).to.have.property('message', 'sorry, you are not yet a collaborator on this doc :(');
            done();
          });
      });
    });
  });


});
