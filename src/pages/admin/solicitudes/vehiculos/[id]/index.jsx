import React, {useEffect, useState} from 'react'
import { Container, Table, Button, Modal, Row } from 'react-bootstrap'
import _Navbar from '../../../../components/_Navbar1'
import axios from 'axios'
import { useRouter } from "next/router";
import { format, parseISO } from 'date-fns';
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
  const [editConductores, setEditConductores] = useState({})
  const [conductoresError, setConductoresError] = useState({})
  
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
    const results = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/solicitudes/vehiculos/`)
    await formatDates(results.data.vehiculos)
    setVehiculos(results.data.vehiculos)
    
  }

  const getAdmin = async () =>{
    const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/${id}`)
    setAdmin(result.data.admin)
    
  }

  async function formatDates(data) {
    data.forEach(element => {
      const date = parseISO(element.fecha_solicitud)
      element.fecha_solicitud = format(date, 'MM/dd/yyyy')
    });
  }

  if (session.data.admin_id != null && admin.admin_id ){
    if(session.data.admin_id != admin.admin_id){
      router.push('/')
    }
  }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  async function handleShow (conductores_id) {
    setShow(true);
    setEditConductores(conductores_id);
  }

  const handleConductoresUpdate = async () => {
    const updatedConductores = {
      principal: editConductores.conductorPrincipal,
      ad1: editConductores.conductorAd1,
      ad2: editConductores.conductorAd2
    }
    const result = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/vehiculo/${editConductores.vehiculo_id}`, {
      body: updatedConductores
    })
    setConductoresError(result.data);
    if(!conductoresError.error){
      const deletion = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/vehiculos/${editConductores.vehiculo_id}`)
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
            <th>Id de Actualizacion</th>
            <th>Conductor Principal</th>
            <th>Conductor Ad. 1</th>
            <th>Conductor Ad. 2</th>
            <th># de Vehiculo</th>
            <th>Fecha de Solicitud</th>
            <th>Aprobación</th>
          </tr>
        </thead>
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
        </tbody>
      </Table>
      </div>}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            Confirmación de cambio
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">Num. de Vehiculo: {editConductores.vehiculo_id}</Row>
          <Row className="mb-3">Conductor Principal: {editConductores.conductorPrincipal}</Row>
          <Row className="mb-3">Conductor Adicional 1: {editConductores.conductorAd1}</Row>
          <Row className="mb-3">Conductor Adicional 2: {editConductores.conductorAd2}</Row>
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