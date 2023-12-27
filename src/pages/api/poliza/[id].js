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
            pgPool.query('SELECT fecha_inicio, fecha_fin from polizas WHERE poliza_id = $1' , [id], (error, results) => {
                if (error) {
                    throw error;
                };
                const inicio = new Date(req.body.body.inicio);
                const fin = new Date(req.body.body.fin);
                if(inicio < results.rows[0].fecha_inicio || fin < results.rows[0].fecha_inicio || fin < inicio){
                    res.status(200).json({
                        error: true, 
                        message: 'Alguna o ambas fechas introducidas son incorrectas, revise que la fecha de Inicio y Fin no sean anteriores al día de hoy y que la fecha de Fin on sea anterior a la de Inicio',
                    });
                }else{
                    pgPool.query('INSERT INTO renovaciones (fecha_inicio, fecha_fin, poliza_id) VALUES($1, $2, $3)', [inicio, fin, id], (error, results) =>{
                        if (error) {
                            throw error;
                        };
                        res.status(200).json({
                            error: false, 
                            message: 'Su solicitud para renovación ha sido recibida, se le notificará más adelante',
                        });
                    })
                }
            });
            break;
        default:
            return res.status(400).json('invalid request')
    }
}