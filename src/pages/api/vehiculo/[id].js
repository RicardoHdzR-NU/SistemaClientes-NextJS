import { pgPool } from "../../../utils/database";

export default (req, res) => {
    const {method} = req
    const query = req.query;
    const {id} = query
    switch (method){
        //Función que registra un request de cambio de conductores
        case 'POST': 
            const prin = req.body.body.principal;
            const ad1 = req.body.body.ad1;
            const ad2 = req.body.body.ad2;
            const hoy = new Date(Date.now());
            pgPool.query('INSERT INTO actualizaciones_conductores (conductor_principal, conductor_ad1, conductor_ad2, fecha_solicitud, vehiculo_id) VALUES($1, $2, $3, $4, $5)', [prin, ad1, ad2, hoy, id], (error, results) =>{
                if (error) {
                    throw error;
                };
                res.status(200).json({
                    error: false, 
                    message: 'Su solicitud para renovación ha sido recibida, se le notificará más adelante',
                });
            })
            break;
        //Función que actualiza los conductores a partir de una request de cambio
        case 'PUT': 
            const _prin = req.body.body.principal;
            const _ad1 = req.body.body.ad1;
            const _ad2 = req.body.body.ad2;
            const conductores = [_ad1, _ad2]
            pgPool.query('UPDATE vehiculos SET conductor = $1, conductores = $2 WHERE vehiculo_id = $3', [_prin, conductores, id], (error, results) =>{
                if (error) {
                    throw error;
                };
                res.status(200).json({
                    error: false, 
                    message: 'Se ha actualizado la información de vehiculos',
                });
            })
            break;
        //Función que elimina una request de cambio de conductores una vez se ha actualizado
        case 'DELETE':
            pgPool.query('DELETE FROM actualizaciones_conductores WHERE vehiculo_id = $1', [id], (error,results) =>{
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