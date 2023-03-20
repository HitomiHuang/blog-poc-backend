function NotFoundException (msg) {
  this.name = 'NotFoundException'
  this.message = msg
}
NotFoundException.prototype = new Error()
NotFoundException.prototype.constructor = NotFoundException

function AuthErrorException (msg) {
  this.name = 'AuthErrorException'
  this.message = msg
}
AuthErrorException.prototype = new Error()
AuthErrorException.prototype.constructor = AuthErrorException

function InputErrorException (msg) {
  this.name = 'InputErrorException'
  this.message = msg
}
InputErrorException.prototype = new Error()
InputErrorException.prototype.constructor = InputErrorException

function UploadFailedException (msg) {
  this.name = 'UploadFailedException'
  this.message = msg
}
UploadFailedException.prototype = new Error()
UploadFailedException.prototype.constructor = UploadFailedException

function EmailOrPasswordWrongException (msg) {
  this.name = 'EmailOrPasswordWrongException'
  this.message = msg
}
EmailOrPasswordWrongException.prototype = new Error()
EmailOrPasswordWrongException.prototype.constructor = EmailOrPasswordWrongException

module.exports = { NotFoundException, AuthErrorException, InputErrorException, UploadFailedException, EmailOrPasswordWrongException }
