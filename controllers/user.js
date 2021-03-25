const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    // bcrypt will hash the password for security reasons
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'User created!' }))
          .catch(error => res.status(400).json({ error }));
      })
    .catch(error => res.status(500).json({ errror }));
};

exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'User not found!' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Wrong credentials!' });
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  { userId: user._id },
                  // we provide a Token hashed with a secret key that will be checked during auth
                  process.env.JWT_SECRET_KEY,
                  // the token will last maximum 24h
                  { expiresIn: '24h' }
                )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };