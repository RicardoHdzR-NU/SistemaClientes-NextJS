import jwt from "jsonwebtoken";
import { pgPool } from "../../../../utils/database";
import { setSession } from "../../../../utils/session";

export default function index (req, res){
    const {method} = req

    switch(method){
        case 'POST':
            //console.log(req.body)
            const email = req.body.body.email
            //console.log(process.env.SECRET)
            const password = req.body.body.password
            //console.log(email)
            //console.log(password)
            //buscamos el usuario
            pgPool.query('SELECT admin_id FROM admins WHERE nombre = $1 AND password = $2', [email, password], (error, results) =>{
                if (error) {
                    throw error
                }
                //si el usuario no existe regresamos null
                if(results.rowCount === 0){
                    //console.log('el usuario no existe'); 
                    res.status(400).json({
                        error: true, 
                        message: 'Log in failure',
                        user: null,
                    }); 
                }else{
                    //console.log('usuario ya existente: ');
                    //console.log(results.rows[0]);
                    //guardamos el id del usuairo en la sesón
                    //req.session.user = results.rows[0];
                    //console.log(req.session);
                    const session = {type: 'admin',
                    admin_id: results.rows[0].admin_id}
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