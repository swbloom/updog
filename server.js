const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Pet = require('./models/pet.js');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;

const router = express.Router();

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/updog'

mongoose.connect(dbURL);

app.use(bodyParser.json());

app.use(express.static('public'));

router.route('/pets')
	.post((req, res) => {
		const pet = new Pet();
		console.log(req.body);
		pet.name = req.body.name; 
		pet.score = 0 // all pets start with a base score of 0
		pet.description = req.body.description;
		pet.photo = req.body.photo;

		pet.save((err, doc) => {
			if (err) {
				res
					.status(400)
					.send(err);
				return;
			}
			res.send(doc);
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
				res
					.status(400)
					.send(err);
				return;
			}
			res
				.status(200)
				.send(pets);
		});
});

router.route('/pets/:pet_id')
	.get((req, res) => {
		Pet.findById(req.params.pet_id, (err, pet) => {
			if (err) {
				res
					.status(400)
					.send(err);
				return;
			}
			res
				.status(200)
				.send(pet);
		});
	})
	.put((req, res) => {
		Pet.findById(req.params.pet_id, (err, pet) => {
			if (err) {
				res
					.status(400)
					.send(err);
				return;
			}
			
			Object.assign(pet, req.body, {score: pet.score += 1});
			
			pet.save((err, doc) => {
				if (err) {
					res
						.status(400)
						.send(err);
					return
				}
				res
					.status(200)
					.send(doc);
			});
		});
	})
	.delete((req, res) => {
		Pet.findByIdAndRemove(req.params.pet_id, (err, pet) => {
			if (err) {
				res
					.status(400)
					.send(err);
				return;
			}

			res
				.status(200)
				.send({ 
					message: 'Successfully deleted'
				});
		});
	});

router.route('/').get((req, res) => {
	res.send({ message: `What's up, dog?`});
});

app.use('/api', router);

app.listen(port);
console.log('Updog is wagging its tail on port ' + port);