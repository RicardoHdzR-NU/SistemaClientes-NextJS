import { pgPool } from "../../../../utils/database";

export default (req, res) => {
    const {method} = req

    switch (method){
        case 'GET' : 
            const query = req.query;
            const {id} = query
            console.log(id)
            pgPool.query('SELECT poliza_id, tipo_poliza, fecha_inicio, fecha_fin, archivo, usuario FROM polizas', (error, results) => {
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