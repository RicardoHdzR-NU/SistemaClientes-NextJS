
import { getSession } from "../../utils/session";

export default async function session(req, res){
    const {method} = req;

    switch(method){
        case 'GET':
            const token = getSession(req);
            //console.log('token: ', token);
            res.json(token)
        break;
        default:
            return res.json('Invalid request')
    }
    
}