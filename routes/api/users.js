const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
// Load User model
const User =require('../../models/User');
// @route GET /api/users/test
// Tests  Users Route
// Public Route
router.get('/test', (req,res) => res.json({
  msg: "Users Works"
}));

// @route GET /api/users/register
// Tests  Register a user
// Public Route

router.post('/register', (req, res) => {
  User.findOne({email: req.body.email})
  .then(user => {
    if(user)
    {
      return res.status(400).json({email: 'Email Already exists'});
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200',  // Size
        r: 'pg',  // Rating
        d: 'mm'   // Default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        })
      })
    }
  })
});

// @route GET /api/users/login
// Loging User / Return JWT Token
// Public Route
router.post('/login', (req,res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find the user by Email
  User.findOne({email})
    .then(user => {
      // Verify for users
      if(!user){
        return res.status(404).json({email: 'User email doesn\'t exist'});
      }

      // Vertify Password of User
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch){
            res.json({msg: 'Success'});
          }
          else{
            return res.status(400).json({password: 'Passwod doesn\'t match'});
          }
        });
    });
});

module.exports = router;
