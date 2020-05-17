const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

afterAll(async () => {   
    await connection.truncate('ongs');     
    await connection.migrate.latest();
    await connection.destroy();
});

describe ('/sessions', () => {
    it('should be able to login into', async () => {
        const ong = await request(app)
        .post('/ongs')
        .send({
                name: "APAE",
                email: "contato@contato.com",
                whatsapp: "10912345678",
                city: "São Paulo",
                uf: "SP"                
            });

       const response = await request(app)   
        .post('/sessions')
        .send({
            id: ong.body.id
        });
        
        expect(response.body.name).toBe('APAE');
    });
});
