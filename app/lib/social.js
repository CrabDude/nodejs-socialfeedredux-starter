let _ = require('lodash')
let {getTweets} = require('./twitter')
let {getFBPosts} = require('./facebook')

async function getNewPosts(req, res) {
  let posts = await Promise.all([getTweets(req, res), getFBPosts(req, res)])
  return _.sortByOrder(_.flatten(posts), ['createdAt'], ['desc'])
}

module.exports = {getTweets, getFBPosts, getNewPosts}
