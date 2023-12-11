const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../Middleware/fetchUser')

const JWT_SECRET = "WebTokenSignedBy@teamLightning"

//ROUTE : 1 :- Create a user using POST "/api/auth/signup" . No Login required
router.post('/signup', [
      body('name', 'Name must be of atleast 3 characters').isLength({ min: 3 }),
      body('email', "It doesn't looks like a correct Email").isEmail(),
      body('password', 'Password must be of atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
      let success = false;
      const result = validationResult(req);
      if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });      //Return Bad request if there are error
      }
      //Check if same email is registered
      try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                  return res.status(400).json({ success, error: "Sorry This email is already Registered" });
            }
            const salt = await bcrypt.genSalt(10);
            const securePassword = await bcrypt.hash(req.body.password, salt);
            //Create a new user
            user = await User.create({
                  name: req.body.name,
                  password: securePassword,
                  email: req.body.email,
            });
            const data = {
                  user: {
                        id: user.id
                  }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authToken })
      }
      catch (error) {
            console.error(error.message);
            res.status(500).send("Something Went Wrong")
      }

})

//ROUTE : 2 :- Authenticate a user
router.post('/login', [
      body('email', "It doesn't looks like a correct Email").isEmail(),
      body('password', "Password can't be blank").exists(),
], async (req, res) => {
      let success = false;
      const result = validationResult(req);
      if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });      //Return Bad request if there are error
      }

      const { email, password } = req.body;
      try {
            let user = await User.findOne({ email });
            if (!user) {
                  return res.status(400).json({ success, errors: "Please try to login with correct credentials" });
            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                  return res.status(400).json({ success, errors: "Please try to login with correct credentials" });
            }

            const payload = {
                  user: {
                        id: user.id
                  }
            }
            const authToken = jwt.sign(payload, JWT_SECRET);
            success = true;
            res.json({ success, authToken })
      }
      catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server Error");
      }
})

//ROUTE : 3 :- Get Logged in user data using POST "/api/auth/user" . Login Required
router.post('/user', fetchUser, async (req, res) => {
      try {
            userId = req.user.id;
            const user = await User.findById(userId).select("-password")
            res.send(user)
            console.log(user);
      }
      catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server Error");
      }
})

module.exports = router