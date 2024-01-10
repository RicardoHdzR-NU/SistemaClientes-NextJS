import { pgPool } from "../../../utils/database";
import { setSession } from "../../../utils/session";


export default function index (req, res){
    const {method} = req;

    switch(method){
        //Registramos al usuario
        case 'POST':
            const name = req.body.body.name
            const email = req.body.body.email
            //buscamos el usuario
            pgPool.query('SELECT user_id FROM usuarios WHERE name = $1 AND email = $2', [name, email], (error, results) =>{
                if (error) {
                    throw error
                }
                //si el usuario no existe regresamos null
                if(results.rowCount === 0){
                    res.status(400).json({
                        error: true, 
                        message: 'Log In failed',
                        user: null,
                    }); 
                }else{
                    const session = {type: 'user',
                    user_id: results.rows[0].user_id}
                    //guardamos el id del usuario en a sesión
                    setSession(res, session)
                    //regresamos el id del usuario
                    res.status(200).json({
                        error: false, 
                        message: 'Log In success',
                        user: results.rows[0],
                    }); 
                }
            });
        break;
        default:
            return res.status(400).json('invalid request');
    }
}