const express = require('express');
const mongoose = require('mongoose');
const uri = "mongodb+srv://mxderouet:<password>@cluster0.2qyyr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');
const path = require('path');

mongoose.connect(uri,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log(error.message, 'Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/stuff', stuffRoutes);
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/api/auth/signup', (req, res, next) => {
  console.log('sign up');
    res.status(201).json({
      message: 'User created!'
    });
    next();
});

app.use('/api/auth/loggin', (req, res, next) => {
  console.log('loggin');
  res.status(201).json({
    message: 'User Logged!'
  });
  next();
})

module.exports = app;