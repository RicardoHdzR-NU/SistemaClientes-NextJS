import React, {useEffect, useState} from 'react'
import { Container, Table } from 'react-bootstrap'
import _Navbar from '../../../components/_Navbar1'
import axios from 'axios'
import { useRouter } from "next/router";

export default function index() {  
  const router = useRouter()
  const id = router.query.id;
  const [vehiculos, setVehiculos] = useState([])
  const [admin, setAdmin] = useState({})
  const [session, setSession] = useState({
    data: {
      type: 'admin',
      user_id: null
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

  const fetchVehiculos = async () =>{
    const results = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/vehiculos/`)
    setVehiculos(results.data.vehiculos)
    
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
    if(vehiculos.length == 0){
      fetchVehiculos()
    }
  },[vehiculos, id])

  return (
    <Container>
      {session.data.admin_id != null &&
      <div>
      <_Navbar user={admin}/>
      <Table bordered hover >
        <thead>
          <tr>
            <th># de Vehiculo</th>
            <th>Tipo de Vehiculo</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Color</th>
            <th>Placa</th>
            <th>Conductor</th>
            <th>Conductores Adicionales</th>
            <th>Poliza</th>
            <th># de Usuario</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((vehiculo) => (
            <tr key={vehiculo.vehiculo_id}>
              {Object.values(vehiculo).map((val, index) => (
                <td key={index}>{Array.isArray(val)? 
                <div>{val[0]}<br/>
                {val[1]}</div>
                :
                val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      </div>}
    </Container>
    
  )
}