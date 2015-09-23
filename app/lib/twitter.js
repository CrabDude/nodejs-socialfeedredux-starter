let _ = require('lodash')

async function getTweets(req, res) {
  if (!req.twitter) return []

  let options = {}
  let tweets = []

  // TODO: Pass since_id
  let [tweets] = req.twitter.promise.get('statuses/home_timeline', options)

  if (tweets.length) {
    tweets = tweets.map(mapTweet)
    tweets = _.sortByOrder(tweets, ['createdAt'], ['desc'])
  }
  return tweets
}

function mapTweet(tweet) {
  return {
    id: tweet.id_str,
    image: tweet.user.profile_image_url,
    text: tweet.text,
    name: tweet.user.name,
    username: '@'+tweet.user.screen_name,
    liked: tweet.favorited,
    network: {
      icon: 'twitter',
      name: 'Twitter',
      class: 'btn-info'
    },
    createdAt: Date.parse(tweet.created_at)
  }
}

module.exports = {getTweets}
