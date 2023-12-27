import { NextApiRequest, NextApiResponse } from "next";
import { pgPool } from "../../../utils/database";


export default function google(req, res){
    const {method} = req;

    switch (method){
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
                        console.log('usuario nuevo: ');
                        console.log(results1.rows[0]);
                        //guardamos el id
                        /*req.session.user = results.rows[0];
                        console.log(req.session);*/
                        
                        res.json({
                            error: false, 
                            message: 'Created new user',
                            user: results1.rows[0],
                        });
                    });
                }else{
                    console.log('el usuario ya existe')
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