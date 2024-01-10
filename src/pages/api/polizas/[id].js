import { pgPool } from "../../../utils/database";

export default (req, res) => {
    const {method} = req

    switch (method){
        //Obtenemos la unformación de las polizas y la regresamos
        case 'GET' : 
            const query = req.query;
            const {id} = query
            pgPool.query('SELECT poliza_id, tipo_poliza, fecha_inicio, fecha_fin, archivo FROM polizas WHERE usuario = $1 ORDER BY poliza_id ASC', [id], (error, results) => {
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