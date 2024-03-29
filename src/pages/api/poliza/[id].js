import { pgPool } from "../../../utils/database";

export default (req, res) => {
    const {method} = req
    const query = req.query;
    const {id} = query
    switch (method){
        //Registramos el request de la renovación de poliza
        case 'POST': 
            pgPool.query('SELECT fecha_inicio, fecha_fin from polizas WHERE poliza_id = $1' , [id], (error, results) => {
                if (error) {
                    throw error;
                };
                const inicio = new Date(req.body.body.inicio);
                const fin = new Date(req.body.body.fin);
                const hoy = new Date(Date.now());
                if(inicio < results.rows[0].fecha_inicio || fin < results.rows[0].fecha_inicio || fin < inicio){
                    res.status(200).json({
                        error: true, 
                        message: 'Alguna o ambas fechas introducidas son incorrectas, revise que la fecha de Inicio y Fin no sean anteriores al día de hoy y que la fecha de Fin on sea anterior a la de Inicio',
                    });
                }else{
                    pgPool.query('INSERT INTO renovaciones (fecha_inicio, fecha_fin, fecha_solicitud, poliza_id) VALUES($1, $2, $3, $4)', [inicio, fin, hoy, id], (error, results) =>{
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
        //Actualizamos la poliza a partir de una solicitud de renovación
        case 'PUT':
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
                    pgPool.query('UPDATE polizas SET fecha_inicio = $1, fecha_fin = $2 WHERE poliza_id = $3', [inicio, fin, id], (error, results) =>{
                        if (error) {
                            throw error;
                        };
                        res.status(200).json({
                            error: false, 
                            message: 'Se ha actualizado la poliza',
                        });
                    })
                }
            });
            break;
        //Eliminamos la solicitud una vez que actualizamos la poliza
        case 'DELETE':
            pgPool.query('DELETE FROM renovaciones WHERE poliza_id = $1', [id], (error,results) =>{
                if (error) {
                    throw error;
                };
                res.status(200).json({
                    message: 'Se ha eliminado la solicitud',
                });
            })
            break;
        default:
            return res.status(400).json('invalid request')
    }
}