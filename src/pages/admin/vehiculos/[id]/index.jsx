import React, {useEffect, useState} from 'react'
import { Container, Table, Form } from 'react-bootstrap'
import _Navbar from '../../../components/_Navbar1'
import axios from 'axios'
import { useRouter } from "next/router";

export default function index() {  
  //Objeto router que maneja la navegación
  const router = useRouter()
  //Obtenemos el id al hacer un query a la ruta buscando el [id]
  const id = router.query.id;
  //Hooks para capturar los vehiculos y el admin
  const [vehiculos, setVehiculos] = useState([])
  const [allVehiculos, setAllVehiculos] = useState([])
  const [admin, setAdmin] = useState({
    admin_id: null,
    name: null
  })
  //Hook para capturar la sesión
  const [session, setSession] = useState({
    data: {
      type: 'admin',
      user_id: null
    }
  })

  //Hook que captura el filtro a utilizar
  const [query, setQuery] = useState('')
  
  //Función para manejar la sesión
  const sessionHandler = async () => {
    const session = await axios.get(`/api/session`)
    //redirigimos a la pagina raiz si la pagina no coincide con la información de la sesión
    if(session.data !== null){
        if(session.data.type != 'admin'){
            router.push('/')
        }else if(session.data.admin_id != id){
            router.push('/')
        }else{
            setSession(session)
        }
    }
    else{
        router.push('/')
    }
  }

  //Obtenemos los vehiculos
  const fetchVehiculos = async () =>{
    const results = await axios.get(`/api/admin/vehiculos/`)
    if(results.data.vehiculos.length == 0){
      setVehiculos([0])
    }else{
      setVehiculos(results.data.vehiculos)
      setAllVehiculos(results.data.vehiculos)
    }
  }

  //funcionalidad de filtro de datos
  const filterQuery = (query) => {
    let filterData = vehiculos;
    if (query) {
      filterData = vehiculos.filter(vhcl =>
        vhcl.vehiculo_id.toString().includes(query) ||
        vhcl.tipo_vehiculo.includes(query) ||
        vhcl.marca.includes(query) ||
        vhcl.modelo.includes(query) ||
        vhcl.color.includes(query) ||
        vhcl.placa.includes(query) ||
        vhcl.conductor.includes(query) ||
        vhcl.conductores[0].includes(query) ||
        vhcl.conductores[1].includes(query) ||
        vhcl.poliza_id.toString().includes(query) ||
        vhcl.user_id.toString().includes(query)
      )
      setVehiculos(filterData)
    } else {
      setVehiculos(allVehiculos)
    }
  }
  //Obtenemos la información del Admin
  const getAdmin = async () =>{
    const result = await axios.get(`/api/admin/${id}`)
    setAdmin(result.data.admin)
  }

  //Hook que se ejecuta al cargar la página, obtiene la 
  //información de la sesión, el admin y los vehiculos
  useEffect(() =>{
    if(id != undefined && admin.admin_id == null){
      getAdmin()
    }
    if(session.data.admin_id == null && admin.admin_id != null){
        sessionHandler()
    }
    if(vehiculos.length == 0){
      fetchVehiculos()
    }
  },[vehiculos, id])

  useEffect(() => {
    filterQuery(query)
  }, [query])

  return (
    <Container>
      {session.data.admin_id != null &&
      <div>
      <_Navbar user={admin}/>
      <div className='flex justify-between'>
        <Form className='mb-3 px-2 py-2 border-rounded'>
          <Form.Label>Filtro</Form.Label>
          <Form.Control type='text' onChange={(e) => setQuery(e.target.value)}></Form.Control>
        </Form>
      </div>
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
        </thead>{vehiculos[0] == 0 ? <tbody></tbody> :
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
        </tbody>}
      </Table>
      </div>}
    </Container>
    
  )
}