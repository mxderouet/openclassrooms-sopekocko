const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    console.log('createSauce');
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet saved!'}))
      .catch(error => {
          console.log(error.message);
        return res.status(400).json({ error });
    });
};
  
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};
      
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Object modified!'}))
    .catch(error => res.status(400).json({ error }));
};
    
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Object deleted!'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
    
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    // we retrieve the sauce 
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            console.log(sauce);
            // this is the like & dislike logic
            switch (req.body.like) {
                // 1 is for like
                case 1: 
                    if (!sauce.usersLiked.includes(req.body.userId)) {
                        sauce.usersLiked.push(req.body.userId);
                        sauce.likes += 1;
                    }
                    break;
                // 0 is a for reset
                case 0:
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        const index = sauce.usersLiked.indexOf(req.body.userId);
                        sauce.usersLiked.splice(index, 1);
                        sauce.likes -= 1;
                    }
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        const index = sauce.usersDisliked.indexOf(req.body.userId);
                        sauce.usersDisliked.splice(index, 1);
                        sauce.dislikes -=1;
                    }
                    break;
                // -1 is for dislike    
                case -1:
                    if (!sauce.usersDisliked.includes(req.body.userId)) {
                        sauce.usersDisliked.push(req.body.userId);
                        sauce.dislikes += 1;
                    }
                    break;
                default: 
                    console.log('wrong value');
            }
            sauce.save()
            .then(() => res.status(200).json({ message: 'Object modified!'}))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => {
            console.log(error.message);
            return res.status(500).json({ error });
        });
}