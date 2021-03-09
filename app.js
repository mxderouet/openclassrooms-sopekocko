const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const uri = "mongodb+srv://mxderouet:<password>@cluster0.2qyyr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

mongoose.connect(uri,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log(error.message, 'Connexion à MongoDB échouée !'));

const app = express();

app.use('/api/stuff', stuffRoutes);
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.post('/api/auth/signup', (req, res) => {
    res.status(201).json({
      message: 'User created!'
    });
});

app.use('/api/auth/loggin', (req, res, next) => {
  console.log('loggin');
  res.status(201).json({
    message: 'User Logged!'
  });
})

module.exports = app;