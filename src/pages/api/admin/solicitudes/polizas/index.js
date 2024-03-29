import { pgPool } from "../../../../../utils/database";

export default (req, res) => {
    const {method} = req

    switch (method){
        case 'GET' : 
            pgPool.query('SELECT renovacion_id, fecha_inicio, fecha_fin, fecha_solicitud, poliza_id FROM renovaciones', (error, results) => {
                if (error) {
                    throw error;
                };
                res.status(200).json({
                    error: false, 
                    message: 'polizas encontradas',
                    polizas: results.rows,
                });
            });
            break;
        default:
            return res.status(400).json('invalid request')
    }
}