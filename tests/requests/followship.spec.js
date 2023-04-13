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

describe('# followship requests', () => {
  context('# POST', () => {

    describe('/api/followship', () => {
      before(async () => {
        //取消FK的約束
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        //清除所有資料
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Followship.destroy({ where: {}, truncate: true, force: true })
        //恢復FK的約束
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

        //模擬登入資料
        const loginUser = {
          userName: '@root',
          name: 'root',
          password: '12345678',
          email: 'root@example.com'
        }
        const rootUser = await db.User.create(loginUser);

        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, "getUser"
        ).returns({ id: 1, Followings: [] });

        // 在測試資料庫中，新增 mock 資料
        await db.User.create({ userName: '@user1', name: 'user1', email: 'user1@example.com', password: '12345678' })
        await db.User.create({ userName: '@user2', name: 'user2', email: 'user2@example.com', password: '12345678' })

      })

      //沒有正確輸入followingId
      it(' - followingId is blank', (done) => {
        request(app)
          .post('/api/followship')
          .send('followingId= ')
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.BAD_REQUEST)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          })
      })

      //User資料庫內沒有該筆id
      it(' - followingUser not found', (done) => {
        request(app)
          .post('/api/followship')
          .send('followingId=100')
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.NOT_FOUND)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          })
      })

      //新增 POST /api/following
      it(' - successfully', (done) => {
        request(app)
          .post('/api/followship')
          .send('followingId=2')
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.OK)
          .end(function (err, res) {
            if (err) return done(err);
            // 檢查 Followship 資料裡，是否有 followerId=1, followingId = 2 的資料
            db.Followship.findByPk(1).then(followship => {
              followship.followerId.should.equal(1);
              followship.followingId.should.equal(2);
              return done();
            })
          })
      });

      after(async () => {
        // 清除登入及測試資料庫資料
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Followship.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })
    })
  })

  context('# DELETE', () => {

    describe('/api/followship', () => {
      before(async () => {
        //取消FK的約束
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        //清除所有資料
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Followship.destroy({ where: {}, truncate: true, force: true })
        //恢復FK的約束
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

        //模擬登入資料
        const loginUser = {
          userName: '@root',
          name: 'root',
          password: '12345678',
          email: 'root@example.com'
        }
        const rootUser = await db.User.create(loginUser);

        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, "getUser"
        ).returns({ id: 1, Followings: [] });

        // 在測試資料庫中，新增 mock 資料
        await db.User.create({ userName: '@user1', name: 'user1', email: 'user1@example.com', password: '12345678' })
        await db.User.create({ userName: '@user2', name: 'user2', email: 'user2@example.com', password: '12345678' })
        await db.Followship.create({ followerId: 1, followingId: 2 })

      })
      
      //沒有正確輸入followingId
      it(' - followingId is blank', (done) => {
        request(app)
          .delete('/api/followship')
          .send('followingId= ')
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.BAD_REQUEST)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          })
      });

      //資料庫內無要刪除的followship
      it(' - followship not found', (done) => {
        request(app)
          .delete('/api/followship')
          .send('followingId= 10')
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.NOT_FOUND)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          })
      });

      //刪除 DELETE /api/following
      it(' - successfully', (done) => {
        request(app)
          .delete('/api/followship')
          .send('followingId=2')
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.OK)
          .end(function (err, res) {
            if (err) return done(err);
            db.Followship.findByPk(1).then(followship => {
              expect(followship).to.be.null
              return done();
            })
          })
      });

      after(async () => {
        // 清除登入及測試資料庫資料
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Followship.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })
    })
  })
})
