import { pgPool } from "../../../utils/database";
import { setSession } from "../../../utils/session";


export default function index (req, res){
    const {method} = req;

    switch(method){
        case 'POST':
            const name = req.body.body.name
            const email = req.body.body.email
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

                    const session = results.rows[0]
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