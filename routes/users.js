var express = require('express');
const { default: mongoose } = require('mongoose');
const User = require('../model/User');
var router = express.Router();


/* GET users listing. */
router.post('/', async function (req, res) {
  try {
    const user = new User(req.body)
    const savedUser = await user.save()
    res.json(savedUser)

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
