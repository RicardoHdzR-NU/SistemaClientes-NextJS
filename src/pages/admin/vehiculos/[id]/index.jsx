import React, {useEffect, useState} from 'react'
import { Container, Table, Button } from 'react-bootstrap'
import _Navbar from '../../../components/_Navbar1'
import axios from 'axios'
import { useRouter } from "next/router";

//export default function index({ vehiculos, usuario }) {
export default function index() {  
  const router = useRouter()
  const id = router.query.id;
  //console.log('id: ', id)
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

    //console.log('session: ', session.data)
    if(session.data !== null){
        //console.log('sesión existente: ', session.data)
        if(session.data.type != 'admin'){
            //console.log('el tipo de sesion es distinta, redirigiendo')
            router.push('/')
        }else{
            setSession(session)
        }
        //router.push(`/user/${session.data.id}`)
        
    }
    else{
        //console.log('no hay sesión')
        router.push('/')
    }
    
  }

  const fetchVehiculos = async () =>{
    //console.log('id: ', id)
    const results = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/vehiculos/`)
    //console.log('vehiculos: ', results.data.vehiculos) 
    setVehiculos(results.data.vehiculos)
    
  }

  const getAdmin = async () =>{
    //console.log('id: ', id)
    const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/${id}`)
    //console.log('usuario: ', result.data.user)  
    setAdmin(result.data.admin)
    
  }

  if (session.data.admin_id != null && admin.admin_id ){
    if(session.data.admin_id != admin.admin_id){
      router.push('/')
    }
  }

  useEffect(() =>{
    //console.log('ejecutamos use effect')
    if(session.data.admin_id == null){
        //console.log('obtenemos la sesion')
        sessionHandler()
    }
    getAdmin()
    
    /*if(!id){
        id = router.query.id
    }*/
    if(vehiculos.length == 0){
      //console.log('obtenemos los vehiculos')
      fetchVehiculos()
    }
  },[vehiculos, id])

  return (
    <Container>
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
      
    </Container>
    
  )
}