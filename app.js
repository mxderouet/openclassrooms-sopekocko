const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const uri = "mongodb+srv://mxderouet:<password>@cluster0.2qyyr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const Thing = require('./models/thing');

mongoose.connect(uri,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log(error.message, 'Connexion à MongoDB échouée !'));


const app = express();

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

app.post('/api/stuff', (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
    ...req.body
  });
  thing.save()
    .catch((error) => { console.log(error.message)})
    .then(() => res.status(201).json({ message: 'Object saved!'}))
    .catch(error => res.status(400).json({ error }));
});

app.get('/api/stuff', (req, res, next) => {
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
});

app.get('/api/stuff/:id', (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

app.put('/api/stuff/:id', (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Object updated !'}))
    .catch(error => res.status(400).json({ error }));
});

app.delete('/api/stuff/:id', (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Object deleted !'}))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;