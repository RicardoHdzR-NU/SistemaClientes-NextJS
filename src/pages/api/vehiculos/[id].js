import { pgPool } from "../../../utils/database";

export default (req, res) => {
    const {method} = req

    switch (method){
        //Obtenemos la información de los vehiculos a partir del id del usuario
        case 'GET' : 
            const query = req.query;
            const {id} = query
            pgPool.query('SELECT vehiculo_id, tipo_vehiculo, marca, modelo, color, placa, conductor, conductores, poliza_id FROM vehiculos WHERE user_id = $1 ORDER BY vehiculo_id ASC', [id], (error, results) => {
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