const UserSchema = require('../models/UserSchema');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ msg: 'Username and password are required' });

  if (password.length < 8) {
    return res
      .status(400)
      .json({ msg: 'Password should be at least 8 characters long' });
  }

  const user = await UserSchema.findOne({ username });
  if (user) return res.status(400).json({ msg: 'User already exists' });

  const newUser = new UserSchema({ username, password });
  bcrypt.hash(password, 7, async (err, hash) => {
    // fucntion saves hashed password & user info in db
    if (err)
      return res.status(400).json({ msg: 'error while saving the password' });

    newUser.password = hash;
    const savedUserRes = await newUser.save();

    if (savedUserRes)
      return res.status(200).json({ msg: 'user is successfully saved' });
  });
});

router.post(`/login`, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ msg: 'Something missing' });
  }

  const user = await UserSchema.findOne({ username: username }); // finding user in db
  if (!user) {
    return res.status(400).json({ msg: 'User not found' });
  }

  const matchPassword = await bcrypt.compare(password, user.password); // compares input with stored password
  if (matchPassword) {
    const userSession = { username: user.username }; // creating user session to keep user logged in
    req.session.user = userSession; // attach user session to session object from express-session

    return res
      .status(200)
      .json({ msg: 'You have logged in successfully', userSession }); // attach user session id to the response. It will be transfer in the cookies
  } else {
    return res.status(400).json({ msg: 'Invalid credential' });
  }
});

router.delete(`/logout`, async (req, res) => {
  req.session.destroy((error) => {
    if (error) throw error;

    res.clearCookie('session-id');
    res.status(200).send('Logout Success');
  });
});

// Check if user already us authorized.
router.get('/isAuth', async (req, res) => {
  if (req.session.user) {
    return res.json(req.session.user);
  } else {
    return res.status(401).json('unauthorize');
  }
});

module.exports = router;
