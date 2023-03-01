var express = require('express');
const { default: mongoose } = require('mongoose');
const User = require('../model/User');
var router = express.Router();

// Add new User
router.post('/new-user', async function (req, res) {
  try {
    const user = new User(req.body)
    const savedUser = await user.save()

    if (!savedUser) {
      return res.status(404).json({ message: "Unable to Save user!" })
    }

    res.status(200).json(savedUser)
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }

});

// Get all users
router.get('/', async function (req, res) {
  try {
    const allUsers = await User.find().exec()
    if (!allUsers) {
      res.status(404).json({ message: "Unable to retrieve users" })
    }
    res.status(200).json(allUsers)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
})

module.exports = router;
