import { pgPool } from "../../../../../utils/database";

export default (req, res) => {
    const {method} = req

    switch (method){
        case 'GET' : 
            const query = req.query;
            const {id} = query
            console.log(id)
            pgPool.query('SELECT actualizacion_id, conductor_principal, conductor_ad1, conductor_ad2, vehiculo_id, fecha_solicitud FROM actualizaciones_conductores', (error, results) => {
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