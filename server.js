const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Pet = require('./models/pet.js');

mongoose.connect('mongodb://localhost:27017/updog');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

const router = express.Router();

router.use((req, res, next) => {
    console.log('middleware ->');
    next();
});

router.route('/pets')
    .post((req, res) => {
        const pet = new Pet();
        pet.name = req.body.name; 
        pet.score = 0; // all pets start with a base score of 0
        pet.description = req.body.description;
        pet.photo = req.body.photo;
    
        pet.save((err, doc) => {
            if (err) {
                res.send(err); 
            }

            res.json(doc);
        });
    })
    .get((req, res) => {
        const params = req.query;
        const results = Pet.find();

        if (params.order_by === 'score') {
            results.sort({
                score: -1
            });
        }

        results.exec((err, pets) => {
            if (err) {
                res.send(err);
            }

            res.json(pets);
        });
    });

router.route('/pets/:pet_id')
    .get((req, res) => {
        Pet.findById(req.params.pet_id, (err, pet) => {
            if (err) {
                res.send(err);
            } 

            res.json(pet);
        });
    })
    .put((req, res) => {
        Pet.findById(req.params.pet_id, (err, pet) => {
            if (err) {
                res.send(err);
            }
            
            pet.name = req.body.name;
            pet.score = req.body.score;
            pet.description = req.body.description;
            pet.photo = req.body.photo;

            pet.save((err, doc) => {
                if (err) {
                    res.send(err);
                }
                res.json(doc);
            });
        });
    })
    .delete((req, res) => {
        Pet.remove({
            _id: req.params.pet_id
        },  (err) => {
            if (err) {
                res.send(err);
            }
        });
        res.json({ message: 'Successfully deleted'});
    });

router.get('/', (req, res) => {
    res.json({ message: 'What\'s up, dog?'});
});

app.use('/api', router);

app.listen(port);
console.log('Updog is wagging its tail on port ' + port);