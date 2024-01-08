import { pgPool } from "../../../../utils/database";

export default (req, res) => {
    const {method} = req

    switch (method){
        case 'GET' : 
            const query = req.query;
            const {id} = query
            console.log(id)
            pgPool.query('SELECT vehiculo_id, tipo_vehiculo, marca, modelo, color, placa, conductor, conductores, poliza_id, user_id FROM vehiculos', (error, results) => {
                if (error) {
                    throw error;
                };
                res.status(200).json({
                    error: false, 
                    message: 'vehiculos encontrados',
                    vehiculos: results.rows,
                });
            });
            break;
        default:
            return res.status(400).json('invalid request')
    }
}