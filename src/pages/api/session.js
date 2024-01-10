import { getSession } from "../../utils/session";

export default async function session(req, res){
    const {method} = req;
    //Obtenemos la información de la sesión y la regresamos
    switch(method){
        case 'GET':
            const token = getSession(req);
            res.json(token)
        break;
        default:
            return res.json('Invalid request')
    }
    
}