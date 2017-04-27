let request = require('supertest');

request = request('http://localhost:8080/api');

describe('Pets', () => {
    it('Gets an array of pets', async () => {
        const pets = await request.get('/pets')
        expect(pets.body).toBeInstanceOf(Array);
    });

    it('Orders pets by high score', async () => {
        const pets = await request.get('/pets?order_by=score');
        let correctOrder = true;
        pets.body.reduce((acc, pet) => {
            if (pet.score > acc.score) {
                correctOrder = false;
            } 
            return pet;
        });
        expect(correctOrder).toBe(true);
    });
});

