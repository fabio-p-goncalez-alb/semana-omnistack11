const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

afterAll(async () => {
    await connection.truncate('ongs');
    await connection.migrate.latest();
    await connection.destroy();
});


describe('POST /ongs', () => {
   

    it('should be able to create a new ONG', async () => {
        const response = await request(app)
            .post('/ongs')
            .send({
                    name: "APAE",
                    email: "contato@contato.com",
                    whatsapp: "20912345678",
                    city: "São Paulo",
                    uf: "SP"                
            });
        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toHaveLength(8);
    });
});

describe('GET /ongs', () => {
    it('should be able to list an existent ONG', async () => {
        const response = await request(app)
        .get('/ongs');
        
        const [ong]= response.body
        expect(ong).toHaveProperty('id');
        expect(200);
    });
});