const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe ('INCIDENTS', () => {

    afterAll(async () => {
        await connection.truncate('incidents');
        await connection.truncate('ongs');
        await connection.migrate.latest();
        await connection.destroy();
    });

    it('Should be able to create a new Incident', async () => {
        const ong = await request(app)
        .post('/ongs')
        .send({
                name: "APAE",
                email: "contato@contato.com",
                whatsapp: "30912345678",
                city: "São Paulo",
                uf: "SP"                
            });

        const response = await request(app)
            .post('/incidents')
            .set('authorization', ong.body.id)
            .send({
                title: "Caso 1",
	            description: "Detalhes do caso",
	            value: "123"
            });
            
        expect(response.body).toHaveProperty('id');
        expect.objectContaining({
            id : expect.any(Number)
        });   

    });

    it('should be able to list an existent Incident', async () => {
        const response = await request(app)
        .get('/incidents?page=1');
        const [ incident ] = response.body;
        expect(incident).toHaveProperty('ong_id')
        expect(incident.ong_id).toHaveLength(8);
        expect(200);
    });

});