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
    console.log(req.body);
    // we retrieve the sauce 
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            console.log(sauce);
            // this is the like & dislike logic
            switch (req.body.like) {
                // 1 is for like
                case 1: 
                    console.log(1);
                    if (!sauce.userLiked.includes(req.body.userId)) {
                        console.log('ICI LIKE');
                        debugger
                        sauce.userLiked.push(req.body.userId);
                        sauce.likes +=1;
                        console.log('LIKED', sauce.userLiked, sauce.likes);
                    }
                // 0 is a for reset
                case 0:
                    if (!sauce.userLiked.includes(req.body.userId)) {
                        sauce.userLiked.push(req.body.userId);
                        sauce.likes -=1;
                        console.log('LIKED', userLiked);
                    }
                    if (!sauce.userDisliked.includes(req.body.userId)) {
                        sauce.userDisliked.push(req.body.userId);
                        sauce.dislikes +=1;
                        console.log('DISLIKED', userDisliked);
                    }
                    break;
                // -1 is for dislike    
                case -1:
                    console.log(-1);
                    if (!sauce.userDisliked.includes(req.body.userId)) {
                        sauce.userDisliked.push(req.body.userId);
                        sauce.dislikes -=1;
                        console.log('DISLIKED', userDisliked);
                    }
                    break;
                default: 
                    console.log('wrong value');
                    break;
            }
            sauce.userId = req.body.userId;
            Sauce.updateOne({ _id: req.params.id }, { ...sauce.like, ...sauce.dislike, ...sauce.userDisliked, ...sauce.userLiked, ...sauce.userId, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Object modified!'}))
            .then(() => console.log(sauce))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
}