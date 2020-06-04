const bcrypt = require('bcryptjs')

module.exports = {
  register: async (req, res) => {
    const { username, password, isAdmin } = req.body
    console.log(req.body)
    const db = req.app.get('db')

    const result = await db.get_user([username])
    const existingUser = result[0]

    //if the username exists we send username taken. if it doesnt exist we dont send anything back and we move on.
    if (existingUser) {
      res.status(409).send('Username taken')
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const registeredUser = await db.register_user([isAdmin, username, hash])
    const user = registeredUser[0]

    req.session.user = {
      isAdmin: user.isAdmin,
      id: user.id,
      username: user.username
    }
    res.status(201).send(req.session.user) //i am not getting isAdmin in postman but in my console.log i am
  },

  login: async (req, res) => {
    const { username, password } = req.body
    const db = req.app.get('db')

    const foundUser = await db.get_user([username])
    const user = foundUser[0]

    if (!user) {
      res.status(401).send('User not found')
    }

    const isAuthenticated = bcrypt.compareSync(password, user.hash)
    if (!isAuthenticated) {
      res.status(403).send('Incorrect password')
    }

    req.session.user = {
      isAdmin: user.isAdmin,
      id: user.id,
      username: user.username
    }
    res.status(200).send(req.session.user)
  },

  logout: async (req, res) => {
    req.session.destroy()
    return res.status(200).send('You have logged out')
  }

}