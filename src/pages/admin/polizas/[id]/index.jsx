import React, {useEffect, useState} from 'react'
import { Container, Table, Row } from 'react-bootstrap'
import _Navbar1 from "../../../components/_Navbar1";
import axios from 'axios'
import { useRouter } from "next/router";
import { format, parseISO } from 'date-fns';


export default function index() {
  const router = useRouter()
  const id = router.query.id;
  const [polizas, setPolizas] = useState([])
  const [admin, setAdmin] = useState({})
  const [session, setSession] = useState({
    data: {
      type: 'admin',
      admin_id: null
    }
  })

  const sessionHandler = async () => {
        
    const session = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session`)
    if(session.data !== null){

        if(session.data.type != 'admin'){
            router.push('/')
        }else{
            setSession(session)
        } 
    }
    else{
        router.push('/')
    }
    
  }

  const fetchPolizas = async () =>{
    const results = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/polizas/`)
    await formatDates(results.data.polizas)
    setPolizas(results.data.polizas)
  }

  async function formatDates(polizas) {
    polizas.forEach(element => {
      const date1 = parseISO(element.fecha_inicio)
      const date2 = parseISO(element.fecha_fin)
      element.fecha_inicio = format(date1, 'MM/dd/yyyy')
      element.fecha_fin = format(date2, 'MM/dd/yyyy')
    });
  }

  const getAdmin = async () =>{
    const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/${id}`)  
    setAdmin(result.data.admin)
  }

  if (session.data.admin_id != null && admin.admin_id ){
    if(session.data.admin_id != admin.admin_id){
      router.push('/')
    }
  }

  useEffect(() =>{
    if(session.data.admin_id == null){
      sessionHandler()
    }
    getAdmin()
    if(polizas.length == 0){
      fetchPolizas()
    }
  },[polizas, id])

  return (
    <Container>
      {session.data.admin_id != null &&
      <div>
      <_Navbar1 user={admin}/>
      <Table bordered hover >
        <thead>
          <tr>
            <th># de Poliza</th>
            <th>Tipo de Poliza</th>
            <th><Container><Row>Fecha de Inicio</Row>
            <Row>mm/dd/yyyy</Row></Container></th>
            <th><Container><Row>Fecha de Fin</Row>
            <Row>mm/dd/yyyy</Row></Container></th>
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
      </div>}
      
    </Container>
    
  )
}