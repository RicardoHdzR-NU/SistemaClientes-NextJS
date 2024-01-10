import { destroySession } from "../../utils/session";

export default async function logout(req, res){

  const {method} = req;

  switch(method){
    //Destruimos la sesión y regresamos un mensaje de confirmación
    case 'GET':
      destroySession(res)
      res.json({message: 'session destroyed'})
      
    break;
    default:
      return res.json('Invalid request')
  }
    
}