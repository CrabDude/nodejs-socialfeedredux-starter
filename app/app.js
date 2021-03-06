let path = require('path')
let Server = require('http').Server
let requireDir = require('require-dir')
let express = require('express')
let morgan = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let session = require('express-session')
let MongoStore = require('connect-mongo')(session)
let mongoose = require('mongoose')
let flash = require('connect-flash')
let passportMiddleware = require('./middlewares/passport')
let routes = requireDir('./routes', {recurse: true})
// TODO: let {getNewPosts} = require('./lib/social')

require('songbird')

class App {
  constructor(config) {
    let app = this.app = express()
    this.config = app.config = config

    passportMiddleware.configure(config.auth)
    app.passport = passportMiddleware.passport

    // set up our express middleware
    app.use(morgan('dev')) // log every request to the console
    app.use(cookieParser('ilovethenodejs')) // read cookies (needed for auth)
    app.use(bodyParser.json()) // get information from html forms
    app.use(bodyParser.urlencoded({ extended: true }))

    app.set('views', path.join(__dirname, '..', 'views'))
    app.set('view engine', 'ejs') // set up ejs for templating
    
    // TODO: Add browserify middleware with babelify transform

    this.sessionMiddleware = session({
      secret: 'ilovethenodejs',
      store: new MongoStore({db: 'socialfeedredux'}),
      resave: true,
      saveUninitialized: true
    })
    let initializedPassport = app.passport.initialize()
    let passportSessions = app.passport.session()

    // required for passport
    app.use(this.sessionMiddleware)
    // Setup passport authentication middleware
    app.use(initializedPassport)
    // persistent login sessions
    app.use(passportSessions)
    // Flash messages stored in session
    app.use(flash())

    // configure routes
    for (let key in routes) {
      routes[key](app)
    }
    this.server = Server(app)
    // TODO: this.setupIo()
  }

  async initialize(port) {
    await Promise.all([
      // start server
      this.server.promise.listen(port),
      // connect to the database
      mongoose.connect(this.config.database.url)
    ])
    
    return this
  }

  setupIo() {
    /**
     * TODO: Implement
     * 1. On connection, get all posts (getNewPosts)
     * 2. Emit posts on socket
     * 3. Poll social network on interval
     * 4. Clear interval on disconnect
     * 5. Only create one interval per session
     */
  }
}

module.exports = App
