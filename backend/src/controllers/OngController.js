
const generateUniqueId = require('../utils/generateUniqueId');
const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const ongs = await connection('ongs').select('*');
    
        return response.json(ongs);
    },

    async create(request, response) {

        const { name, email, whatsapp, city, uf } = request.body;

        const id = generateUniqueId();

        await connection('ongs').insert({
            id,
            name,
            email,
            whatsapp,
            city,
            uf
        })

        return response.json({ id });
    },

    async delete(request,response){
        const { id } = request.params;
        id.id = request.headers.authorization;
        const ongs = await connection('ongs')
            .select('id')
            .first();

        if (ongs.id.id !==  id.id) {
            return response.status(401).json({ error: 'Operation not permitted.'});
        };

        await connection('ongs').delete();

        return response.status(204).send();
    }
};