import jwt from "jsonwebtoken";
import { pgPool } from "../../../utils/database";
import { setSession } from "../../../utils/session";

export default function index (req, res){
    const {method} = req

    switch(method){
        //Registramos al usuario
        case 'POST':
            const email = req.body.body.email
            const password = jwt.sign(req.body.body.password, `${process.env.SECRET}`)
            //buscamos el usuario
            pgPool.query('SELECT user_id FROM usuarios WHERE email = $1 AND password = $2', [email, password], (error, results) =>{
                if (error) {
                    throw error
                }
                //si el usuario no existe regresamos null
                if(results.rowCount === 0){ 
                    res.status(400).json({
                        error: true, 
                        message: 'Log in failure',
                        user: null,
                    }); 
                }else{
                    //guardamos el id del usuairo en la sesión
                    const session = {type: 'user',
                    user_id: results.rows[0].user_id}
                    setSession(res, session)
                    //regresamos el id
                    res.json({
                        error: false, 
                        message: 'Log in success',
                        user: results.rows[0],
                    }); 
                }
            });
        break;
        default:
            return res.status(400).json('Invalid request');
    }
}