const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../util/auth-helpers')
const should = chai.should()
const expect = chai.expect
const db = require('../../models')
const passport = require('../../config/passport')
const httpStatusCodes = require('../../util/httpStatusCodes')
const loginUser = {
  userName: '@user1',
  name: 'user1',
  password: '12345678',
  email: 'user1@example.com'
}
const normalUser = {
  userName: '@user2',
  name: 'user2',
  password: '12345678',
  email: 'user2@example.com'
}
const dummyStory = {
  id: 'this-is-a-test-story-abcdef123456',
  title: 'This is a test story',
  code: 'abcdef123456',
  content: 'Here is the test content.',
  userId: 1
}
const dummyStory2 = {
  id: 'this-is-a-test-story2-abcdef456789',
  title: 'This is a test story2',
  code: 'abcdef456789',
  content: 'Here is the test content.',
  userId: 2
}

describe('# story requests', () => {
  context('# POST', () => {

    describe('/api/story', () => {
      before(async () => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

        await db.Story.create(dummyStory)
      })

      it(' - storyId is blank', (done) => {
        request(app)
          .post('/api/story')
          .send({ storyId: ' ' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.BAD_REQUEST)
          .end((err, res) => {
            if (err) return done(err)
            return done()
          })
      })

      it(' - story not found', (done) => {
        request(app)
          .post('/api/story')
          .send({ storyId: 'fake-story-id-123456789012' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.NOT_FOUND)
          .end((err, res) => {
            if (err) return done(err)
            return done()
          })
      })

      it(' - successfully', (done) => {
        request(app)
          .post('/api/story')
          .send({ storyId: 'this-is-a-test-story-abcdef123456' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.OK)
          .end((err, res) => {
            if (err) return done(err)
            res.body.data.story.title.should.equal('This is a test story')
            return done()
          })
      })

      after(async () => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
      })
    })

    describe('/api/story/add', () => {
      before(async () => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

        const rootUser = await db.User.create(loginUser)

        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, "getUser"
        ).returns({ id: 1, Followings: [] })

      })

      it(' - content is blank', (done) => {
        request(app)
          .post('/api/story/add')
          .send({ content: ' ' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.BAD_REQUEST)
          .end((err, res) => {
            if (err) return done(err)
            return done()
          })
      })

      it(' - successfully', (done) => {
        request(app)
          .post('/api/story/add')
          .send({ content: 'This is a test content.' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.OK)
          .end((err, res) => {
            if (err) return done(err)
            db.Story.findOne({ where: { userId: 1 } }).then(story => {
              story.content.should.equal('This is a test content.')
              return done()
            })
          })
      })

      after(async () => {
        this.getUser.restore()
        this.authenticate.restore()
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
      })
    })

    describe('/api/story/claps', () => {
      before(async () => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        await db.Clap.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

        await db.User.create(loginUser)
        await db.User.create(normalUser)
        await db.Story.create(dummyStory)
      })

      it(' - storyId is blank', (done) => {
        request(app)
          .post('/api/story/claps')
          .send({ storyId: ' ' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.BAD_REQUEST)
          .end((err, res) => {
            if (err) return done(err)
            return done()
          })
      })

      it(' - story not found', (done) => {
        request(app)
          .post('/api/story/claps')
          .send({ storyId: 'fake-story-id-123456789012' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.NOT_FOUND)
          .end((err, res) => {
            if (err) return done(err)
            return done()
          })
      })

      it(' - successfully', (done) => {
        request(app)
          .post('/api/story/claps')
          .send({ storyId: 'this-is-a-test-story-abcdef123456' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.OK)
          .end((err, res) => {
            if (err) return done(err)
            expect(res.body.data).to.be.empty
            return done()
          })
      })

      after(async () => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        await db.Clap.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
      })
    })

    describe('/api/story/responses', () => {
      before(async () => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

        await db.User.create(loginUser)
        await db.Story.create(dummyStory)
      })

      it(' - storyId is blank', (done) => {
        request(app)
          .post('/api/story/responses')
          .send({ storyId: ' ' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.BAD_REQUEST)
          .end((err, res) => {
            if (err) return done(err)
            return done()
          })
      })

      it(' - story not found', (done) => {
        request(app)
          .post('/api/story/responses')
          .send({ storyId: 'fake-story-id-123456789012' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.NOT_FOUND)
          .end((err, res) => {
            if (err) return done(err)
            return done()
          })
      })

      it(' - successfully', (done) => {
        request(app)
          .post('/api/story/responses')
          .send({ storyId: 'this-is-a-test-story-abcdef123456' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.OK)
          .end((err, res) => {
            if (err) return done(err)
            expect(res.body.data.responses).to.be.empty
            return done()
          })
      })

      after(async () => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
      })
    })

    describe('/api/story/upload-file', () => {
      before(async () => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

        const rootUser = await db.User.create(loginUser)

        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, "getUser"
        ).returns({ id: 1, Followings: [] })

      })

      it(' - content is blank', (done) => {
        request(app)
          .post('/api/story/upload-file')
          .send({ content: ' ' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.BAD_REQUEST)
          .end((err, res) => {
            if (err) return done(err)
            return done()
          })
      })

      it(' - successfully', (done) => {
        request(app)
          .post('/api/story/upload-file')
          .send({ content: 'This is a test content.' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.OK)
          .end((err, res) => {
            if (err) return done(err)
            db.Story.findOne({ where: { userId: 1 } }).then(story => {
              story.content.should.equal('This is a test content.')
              return done()
            })
          })
      })

      after(async () => {
        this.getUser.restore()
        this.authenticate.restore()
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
      })
    })

  })

  context('# PUT', () => {
    describe('/api/story/edit', () => {
      before(async () => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

        const rootUser = await db.User.create(loginUser)

        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, "getUser"
        ).returns({ id: 1, Followings: [] })

        await db.Story.create(dummyStory)
        await db.User.create(normalUser)
        await db.Story.create(dummyStory2)
      })

      it(' - storyId is blank', (done) => {
        request(app)
          .put('/api/story/edit')
          .send({ storyId: ' ' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.BAD_REQUEST)
          .end((err, res) => {
            if (err) return done(err)
            return done()
          })
      })

      it(' - story not found', (done) => {
        request(app)
          .put('/api/story/edit')
          .send({ storyId: 'fake-story-id-123456789012' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.NOT_FOUND)
          .end((err, res) => {
            if (err) return done(err)
            return done()
          })
      })

      it(' - auth error', (done) => {
        request(app)
          .put('/api/story/edit')
          .send({ storyId: 'this-is-a-test-story2-abcdef456789' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.AUTH_ERROR)
          .end((err, res) => {
            if (err) return done(err)
            return done()
          })
      })

      it(' - successfully', (done) => {
        request(app)
          .put('/api/story/edit')
          .send({ storyId: 'this-is-a-test-story-abcdef123456', content: 'Content changed.' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.OK)
          .end((err, res) => {
            if (err) return done(err)
            db.Story.findByPk('this-is-a-test-story-abcdef123456').then(story => {
              story.content.should.equals('Content changed.')
              return done()
            })
          })
      })

      after(async () => {
        this.authenticate.restore()
        this.getUser.restore()
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
      })
    })
  })

  context('# DELETE', () => {
    describe('/api/story', () => {
      before(async () => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

        const rootUser = await db.User.create(loginUser)

        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, "getUser"
        ).returns({ id: 1, Followings: [] })

        await db.Story.create(dummyStory)
        await db.User.create(normalUser)
        await db.Story.create(dummyStory2)
      })

      it(' - storyId is blank', (done) => {
        request(app)
          .delete('/api/story')
          .send({ storyId: ' ' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.BAD_REQUEST)
          .end((err, res) => {
            if (err) return done(err)
            return done()
          })
      })

      it(' - story not found', (done) => {
        request(app)
          .delete('/api/story')
          .send({ storyId: 'fake-story-id-123456789012' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.NOT_FOUND)
          .end((err, res) => {
            if (err) return done(err)
            return done()
          })
      })

      it(' - auth error', (done) => {
        request(app)
          .put('/api/story/edit')
          .send({ storyId: 'this-is-a-test-story2-abcdef456789' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.AUTH_ERROR)
          .end((err, res) => {
            if (err) return done(err)
            return done()
          })
      })

      it(' - successfully', (done) => {
        request(app)
          .delete('/api/story')
          .send({ storyId: 'this-is-a-test-story-abcdef123456' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.OK)
          .end((err, res) => {
            if (err) return done(err)
            db.Story.findByPk('this-is-a-test-story-abcdef123456').then(story => {
              expect(story).to.be.null
              return done()
            })
          })
      })

      after(async () => {
        this.authenticate.restore()
        this.getUser.restore()
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
      })
    })
  })
})
