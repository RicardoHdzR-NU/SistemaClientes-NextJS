import { NextApiRequest, NextApiResponse } from "next";
import { destroySession } from "../../utils/session";
import { redirect } from "next/navigation";

export default async function logout(req, res){

  const {method} = req;

  switch(method){
    case 'GET':
      destroySession(res)
      res.json({message: 'session destroyed'})
      
    break;
    default:
      return res.json('Invalid request')
  }
    
}