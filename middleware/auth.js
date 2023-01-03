const { ensureAuthenticated } = require('../util/auth-helpers')
const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    return next()
  }
  return res.status(401).json({ status: 'unauthorized' })
}

module.exports = {
  authenticated
}
