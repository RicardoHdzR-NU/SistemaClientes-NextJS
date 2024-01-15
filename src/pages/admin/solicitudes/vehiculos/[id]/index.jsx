import React, {useEffect, useState} from 'react'
import { Container, Table, Button, Modal, Row, Form } from 'react-bootstrap'
import _Navbar from '../../../../components/_Navbar1'
import axios from 'axios'
import { useRouter } from "next/router";
import { format, parseISO } from 'date-fns';

export default function index() {  
  //objeto router que maneja la navegación
  const router = useRouter()
  //Obtenemos el id a partir de hacer un query de la URL y buscar el [id]
  const id = router.query.id;
  //Hooks de los vehiculos y el admin
  const [vehiculos, setVehiculos] = useState([])
  const [allVehiculos, setAllVehiculos] = useState([])
  const [admin, setAdmin] = useState({
    admin_id: null,
    name: null
  })
  //Hook de la sesión
  const [session, setSession] = useState({
    data: {
      type: 'admin',
      user_id: null
    }
  })
  //Hoks que ayudan a hacer el request de aprovación
  const [editConductores, setEditConductores] = useState({})
  const [conductoresError, setConductoresError] = useState({})

  //Hook que captura el filtro a utilizar
  const [query, setQuery] = useState('')
  
  //Función que obtiene los datos de la sesión
  const sessionHandler = async () => {
    const session = await axios.get(`/api/session`)
    //si la información de la sesión y la página no coinciden, redirigimos a la página raíz
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
  //Obtenemos la información de los vehiculos
  const fetchVehiculos = async () =>{
    const results = await axios.get(`/api/admin/solicitudes/vehiculos/`)
    if(results.data.vehiculos.length == 0){
      setVehiculos([0])
    }else{
      await formatDates(results.data.vehiculos)
      setVehiculos(results.data.vehiculos)
      setAllVehiculos(results.data.vehiculos)
    } 
  }

  //funcionalidad de filtro de datos
  const filterQuery = (query) => {
    let filterData = vehiculos;
    if (query) {
      filterData = vehiculos.filter(vhcl =>
        vhcl.actualizacion_id.toString().includes(query) ||
        vhcl.conductor_principal.includes(query) ||
        vhcl.conductor_ad1.includes(query) ||
        vhcl.conductor_ad2.includes(query) ||
        vhcl.vehiculo_id.toString().includes(query) ||
        vhcl.fecha_solicitud.includes(query)
      )
      setVehiculos(filterData)
    } else {
      setVehiculos(allVehiculos)
    }
  }
  //Obtenemos la información del admin
  const getAdmin = async () =>{
    const result = await axios.get(`/api/admin/${id}`)
    setAdmin(result.data.admin)
  }

  //Función que da formato a las fechas
  async function formatDates(data) {
    data.forEach(element => {
      const date = parseISO(element.fecha_solicitud)
      element.fecha_solicitud = format(date, 'MM/dd/yyyy')
    });
  }

  //Hooks y funciones que manejan el modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  async function handleShow (conductores_id) {
    setShow(true);
    setEditConductores(conductores_id);
  }

  //Función que maneja el request de actualización de conductores
  const handleConductoresUpdate = async () => {
    const updatedConductores = {
      principal: editConductores.conductor_principal,
      ad1: editConductores.conductor_ad1,
      ad2: editConductores.conductor_ad2
    }
    const result = await axios.put(`/api/vehiculo/${editConductores.vehiculo_id}`, {
      body: updatedConductores
    })
    setConductoresError(result.data);
    if(!conductoresError.error){
      const deletion = await axios.delete(`/api/vehiculo/${editConductores.vehiculo_id}`)
    }
  }

  //Hook que se ejecuta al cargar la página, ejecuta las funcioens de sesión, admin y vehiculos
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
            <th>Id de Actualizacion</th>
            <th>Conductor Principal</th>
            <th>Conductor Ad. 1</th>
            <th>Conductor Ad. 2</th>
            <th># de Vehiculo</th>
            <th>Fecha de Solicitud</th>
            <th>Aprobación</th>
          </tr>
        </thead>{vehiculos[0] == 0 ? <tbody></tbody> : 
        
        <tbody>
          {vehiculos.map((vehiculo) => (
            <tr key={vehiculo.actualizacion_id}>
              {Object.values(vehiculo).map((val, index) => (
                <td key={index}>{val}</td>
              ))}
              <td>
                <Button variant='primary' onClick={() => handleShow(vehiculo)}>Aprobar Solicitud</Button>
              </td>
            </tr>
          ))}
        </tbody>}
      </Table>
      </div>}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            Confirmación de cambio
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">Num. de Vehiculo: {editConductores.vehiculo_id}</Row>
          <Row className="mb-3">Conductor Principal: {editConductores.conductor_principal}</Row>
          <Row className="mb-3">Conductor Adicional 1: {editConductores.conductor_ad1}</Row>
          <Row className="mb-3">Conductor Adicional 2: {editConductores.conductor_ad2}</Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleConductoresUpdate}>
              Aprobar cambio
          </Button>
          {conductoresError.error ? <Row>{conductoresError.message}</Row> 
          : <Row>{conductoresError.message}</Row>}
        </Modal.Footer>
      </Modal>
    </Container>
    
  )
}