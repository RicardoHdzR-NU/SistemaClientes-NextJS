import { pgPool } from "../../../utils/database";
import jwt from 'jsonwebtoken'
import { setSession } from "../../../utils/session";

export default function index(req, res){
    const {method} = req;

    switch (method){
        //Función que registra al usuario nuevo
        case 'POST':
            const name = req.body.body.name
            const email = req.body.body.email
            //encriptamos la contraseña
            const password = jwt.sign(req.body.body.password,`${process.env.SECRET}`)
            //revisamos si el usuario ya existe
            pgPool.query('SELECT user_id FROM usuarios WHERE name = $1 AND email = $2', [name, email], (error, results) =>{
                if (error) {
                    throw error
                };
                //si no existe, se hace el registro
                if(results.rowCount === 0){
                    pgPool.query('INSERT INTO usuarios (name, email, password, google) VALUES ($1, $2, $3, $4) RETURNING user_id', [name, email, password, false], (error, results1) => {
                        if (error) {
                            throw error
                        };
                        //guardamos el id y la sesión
                        const session = {type: 'user',
                        user_id: results1.rows[0].user_id}
                        setSession(res, session)
                        res.status(200).json({
                            error: false, 
                            message: 'Created new user',
                            user: results1.rows[0],
                        });
                    });
                }else{
                    res.status(400).json({
                        error: true, 
                        message: 'User already exists',
                        user: null,
                    });
                };
            }); 
        break;
        default:
            return res.status(400).json('invalid request')
    }

    
}