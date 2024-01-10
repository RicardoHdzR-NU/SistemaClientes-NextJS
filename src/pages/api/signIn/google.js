import { pgPool } from "../../../utils/database";
import { setSession } from "../../../utils/session"
export default function google(req, res){
    const {method} = req;

    switch (method){
        //Función que registra al nuevo usuario de Google
        case 'POST':
            const name = req.body.body.name
            const email = req.body.body.email

            pgPool.query('SELECT user_id FROM usuarios WHERE name = $1 AND email = $2', [name, email], (error, results) =>{
                if (error) {
                    throw error
                };
                //si no existe, se hace el registro
                if(results.rowCount === 0){
                    pgPool.query('INSERT INTO usuarios (name, email, google) VALUES ($1, $2, $3, $4) RETURNING id', [name, email, true], (error, results1) => {
                        if (error) {
                            throw error
                        };
                        const session = {type: 'user',
                        user_id: results1.rows[0].user_id}
                        setSession(res, session)
                        //guardamos el id y la sesión
                        res.json({
                            error: false, 
                            message: 'Created new user',
                            user: results1.rows[0],
                        });
                    });
                }else{
                    res.json({
                        error: true, 
                        message: 'User already exists',
                        user: results.rows[0],
                    });
                };
            }); 
        break;
        default:
            return res.status(400).json('invalid request')
    }
}