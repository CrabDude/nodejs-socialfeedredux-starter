let Twitter = require('twitter')

function twitterMiddleware(config) {
  return (req, res, next) => {
    if (req.user.twitter && req.user.twitter.token && req.user.twitter.secret) {
      req.twitter = new Twitter({
        consumer_key: config.auth.twitter.consumerKey,
        consumer_secret: config.auth.twitter.consumerSecret,
        access_token_key: req.user.twitter.token,
        access_token_secret: req.user.twitter.secret,
      })
    }
    next()
  }
}

module.exports = twitterMiddleware
