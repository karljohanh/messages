const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserSchema = require('../models/UserSchema');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: 'Username and password are required.' });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ msg: 'Password should be at least 8 characters long.' });
  }

  const user = await UserSchema.findOne({ username }); // finding user in db
  if (user) {
    return res.status(400).json({ msg: 'User already exist' });
  }

  const newUser = new UserSchema({ username, password });

  bcrypt.hash(password, 7, async (err, hash) => {
    if (err) {
      return res.status(400).json({ msg: 'Error while saving the password.' });
    }

    newUser.password = hash;
    const savedUserRes = await newUser.save();

    if (savedUserRes) {
      return res.status(200).json({ msg: 'User is saved.' });
    }
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ msg: 'Incorrect username or password.' });
  }

  const user = await UserSchema.findOne({ username: username });
  if (!user) {
    return res.status(400).json({ msg: 'User not found' });
  }

  //Compare password with saved hash-password
  const matchPassword = await bcrypt.compare(password, user.password);
  if (matchPassword) {
    const userSession = { username: user.username }; // create user session to keep user logged in
    req.session.user = userSession; // attach user session to session object from express-session

    return res
      .status(200)
      .json({ msg: 'Logged in successfully.', userSession });
  } else {
    return res.status(400).json({ msg: 'Invalid credentials.' });
  }
});

router.get('/isAuth', async (req, res) => {
  if (req.session.user) {
    return res.json(req.session.user);
  } else res.status(401).json('unauthorize');
});

module.exports = router;
