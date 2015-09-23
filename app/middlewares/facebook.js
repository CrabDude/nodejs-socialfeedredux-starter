let FB = require('fb')

function facebookMiddleware(config) {
  return (req, res, next) => {
    if (req.user.facebook && req.user.facebook.token) {
      req.facebook = Object.create(FB)
      req.facebook.token = req.user.facebook.token
    }

    next()
  }
}

module.exports = facebookMiddleware
