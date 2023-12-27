import {NextApiRequest, NextApiResponse} from 'next'
 
export default function index(req, res){
    return res.status(400).json('Invalid Request');
}