import { pgPool } from "../../../utils/database";

export default (req, res) => {
    const {method} = req
    const query = req.query;
    const {id} = query
    //console.log(id)
    switch (method){
        
        case 'GET' : 
            
            //console.log(id)
            pgPool.query('SELECT poliza_id, tipo_poliza, fecha_inicio, fecha_fin, archivo, usuario FROM polizas WHERE poliza_id = $1', [id], (error, results) => {
                if (error) {
                    throw error;
                };
                //console.log(results.rows)
                res.status(200).json({
                    error: false, 
                    message: 'poliza encontradas',
                    poliza: results.rows[0],
                });
            });
            break;
        case 'POST': 
            const prin = req.body.body.principal;
            const ad1 = req.body.body.ad1;
            const ad2 = req.body.body.ad2;
            pgPool.query('INSERT INTO actualizaciones_conductores (conductor_principal, conductor_ad1, conductor_ad2, vehiculo_id) VALUES($1, $2, $3, $4)', [prin, ad1, ad2, id], (error, results) =>{
                if (error) {
                    throw error;
                };
                res.status(200).json({
                    error: false, 
                    message: 'Su solicitud para renovación ha sido recibida, se le notificará más adelante',
                });
            })
            break;
        default:
            return res.status(400).json('invalid request')
    }
}