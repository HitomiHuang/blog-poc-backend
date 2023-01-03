function UserNotFoundException (msg) {
  this.name = 'UserNotFoundException'
  this.message = msg
}
UserNotFoundException.prototype = new Error()
UserNotFoundException.prototype.constructor = UserNotFoundException

module.exports = { UserNotFoundException }
