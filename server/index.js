require('dotenv').config()
const massive = require('massive'),
  express = require('express'),
  session = require('express-session'),
  app = express(),
  port = 4000,
  { CONNECTION_STRING, SESSION_SECRET } = process.env,
  authCtrl = require('./controllers/authController'),
  treasureCtrl = require('./controllers/treasureController'),
  auth = require('./middleware/authMiddleware')

app.use(express.json())

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
)

app.post('/auth/register', authCtrl.register)

app.post('/auth/login', authCtrl.login)

app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)

app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)

app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);

app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)


massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
}).then((dbInstance) => {
  app.set('db', dbInstance)
  console.log('BIG D...B')
  app.listen(port, () =>
    console.log(`Loving on port ${port}`)
  )
})


