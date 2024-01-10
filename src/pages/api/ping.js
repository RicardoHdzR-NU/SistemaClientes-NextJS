import { pgPool } from '../../utils/database';
 
export default async function ping(req, res){
  const {method} = req;
    //request simple para saber si está funcionando bien el API
    switch(method){
      case 'GET':
        const response = await pgPool.query("SELECT NOW()");

        res.json({message: 'pong', time: response.rows[0].now});
      break;
      default:
        res.json('Invalid Request')
    }

 
}