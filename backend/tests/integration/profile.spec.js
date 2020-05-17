const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

afterAll(async () => {   
    await connection.truncate('ongs');     
    await connection.migrate.latest();
    await connection.destroy();
});


describe ('/profile', () => {
    it('should be able to show incidents of the profile', async () => {
        const ong = await request(app)
        .post('/ongs')
        .send({
                name: "APAE",
                email: "contato@contato.com",
                whatsapp: "10912345678",
                city: "São Paulo",
                uf: "SP"                
            });
            
        await request(app)
        .post('/incidents')
        .set('authorization', ong.body.id)
        .send({
            title: "Caso 1",
	        description: "Detalhes do caso",
	        value: "123"
        });

        const response = await request(app)   
        .get('/profile')
        .set('authorization', ong.body.id);
               
        const [ profile ] = response.body;
        expect( profile ).toHaveProperty('ong_id');
        expect(profile.ong_id).toHaveLength(8);
    });
});