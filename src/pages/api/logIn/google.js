import { NextApiRequest, NextApiResponse} from "next";
import { pgPool } from "../../../utils/database";
import { setSession } from "../../../utils/session";


export default function index (req, res){
    const {method} = req;

    switch(method){
        case 'POST':
            const name = req.body.body.name
            const email = req.body.body.email
            //console.log('nombre: ',name)
            //console.log('email: ', email)
            pgPool.query('SELECT user_id FROM usuarios WHERE name = $1 AND email = $2', [name, email], (error, results) =>{
                if (error) {
                    throw error
                }
                if(results.rowCount === 0){
                    console.log('el usuario no existe');
                    res.status(400).json({
                        error: true, 
                        message: 'Log In failed',
                        user: null,
                    }); 
                }else{
                    //console.log('usuario ya existente: ');
                    //console.log(results.rows[0]);
                    const session = results.rows[0]
                    setSession(res, session)
                    //guardamos el id del usuario en a sesión
                    //req.session.user = results.rows[0];
                    //console.log(req.session);
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