import React, {useEffect, useState} from 'react'
import { Container, Table, Button, Modal, Form } from 'react-bootstrap'
import _Navbar1 from "../../../components/_Navbar1";
import axios from 'axios'
import { useRouter } from "next/router";
import { format, parseISO } from 'date-fns';
//import SolicitudRenovacion from '../../components/SolicitudRenovacion';

export default function index() {
  const router = useRouter()
  const id = router.query.id;
  const [polizas, setPolizas] = useState([])
  const [admin, setAdmin] = useState({})
  const [session, setSession] = useState({
    data: {
      user_id: null
    }
  })

  //console.log(process.env.API_URL)

  const sessionHandler = async () => {
    /*const url = process.env.API_URL + '/session';
    console.log(url)*/
    const session = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session`)
    //console.log('session: ', session.data)
    if(session.data !== null){
      console.log('sesión existente: ', session.data)
      //router.push(`/user/${session.data.id}`)
      setSession(session)
    }
    else{
      //console.log('no hay sesión')
      router.push('/')
    }
  }

  const fetchPolizas = async () =>{
    /*const url = process.env.API_URL + '/polizas';
    console.log(url)*/
    const results = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/polizas/`)
    //console.log(results.data.polizas)
    await formatDates(results.data.polizas)
    setPolizas(results.data.polizas)
    //console.log(results)
  }

  async function formatDates(polizas) {
    polizas.forEach(element => {
      const date1 = parseISO(element.fecha_inicio)
      const date2 = parseISO(element.fecha_fin)
      element.fecha_inicio = format(date1, 'dd/MM/yyyy')
      element.fecha_fin = format(date2, 'dd/MM/yyyy')
    });
  }

  const getAdmin = async () =>{
    //console.log('id: ', id)
    const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/${id}`)  
    //console.log('usuario: ', result.data.user)
    setAdmin(result.data.admin)
  }

  if (session.data.user_id != null && admin.admin_id ){
    if(session.data.user_id != admin.admin_id){
      router.push('/')
    }
  }

  useEffect(() =>{
    //console.log(process.env.API_URL)
    if(session.data.user_id == null){
      sessionHandler()
    }
    getAdmin()
    if(polizas.length == 0){
      fetchPolizas()
    }
  },[polizas, id])

  return (
    <Container>
      <_Navbar1 user={admin}/>
      <Table bordered hover >
        <thead>
          <tr>
            <th># de Poliza</th>
            <th>Tipo de Poliza</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Fin</th>
            <th>Archivo</th>
            <th># de Usuario</th>
          </tr>
        </thead>
        <tbody>
          {polizas.map((poliza) => (
            <tr key={poliza.poliza_id}>
              {Object.values(poliza).map((val, index) => (
                <td key={index}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
    
  )
}