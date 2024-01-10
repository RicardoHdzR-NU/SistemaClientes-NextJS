import { pgPool } from "../../../utils/database";

export default (req, res) => {

    const {method} = req;

    switch (method){
        //Función que regresa un usuario
        case 'GET':
            const query = req.query;
            const {id} = query
            pgPool.query('SELECT user_id, name, email, picturegoogle, google, pictureuser  FROM usuarios WHERE user_id = $1', [id], (error, results) => {
                if (error) {
                    throw error;
                };
                res.status(200).json({
                    error: false, 
                    message: 'usuario encontrado',
                    user: results.rows[0],
                });
            });
            break;
        default:
            return res.status(400).json('invalid request')
    }
}