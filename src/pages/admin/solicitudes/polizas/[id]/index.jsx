import React, {useEffect, useState} from 'react'
import { Container, Table, Button, Modal, Row } from 'react-bootstrap'
import _Navbar1 from "../../../../components/_Navbar1";
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
      user_id: null
    }
  })
  const [polizaEdit, setPolizaEdit] = useState({})
  const [polizaError, setPolizaError] = useState({})

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
    const results = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/solicitudes/polizas/`)
    await formatDates(results.data.polizas)
    setPolizas(results.data.polizas)
  }

  async function formatDates(polizas) {
    polizas.forEach(element => {
      const date1 = parseISO(element.fecha_inicio)
      const date2 = parseISO(element.fecha_fin)
      const date3 = parseISO(element.fecha_solicitud)
      element.fecha_inicio = format(date1, 'MM/dd/yyyy')
      element.fecha_fin = format(date2, 'MM/dd/yyyy')
      element.fecha_solicitud = format(date3, 'MM/dd/yyyy')
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

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  async function handleShow (poliza_id) {
    setShow(true);
    setPolizaEdit(poliza_id);
  }

  const handleRenovation = async () => {
    const polizaDetails = {
      inicio: new Date(polizaEdit.fecha_inicio),
      fin: new Date(polizaEdit.fecha_fin),
    }
    console.log(polizaDetails)
    const result = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/poliza/${polizaEdit.poliza_id}`, {
      body: polizaDetails
    })
    setPolizaError(result.data);
    if(!polizaError.error){
      const deletion = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/poliza/${polizaEdit.poliza_id}`)
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
            <th>Id de Renovacion</th>
            <th><Container><Row>Fecha de Inicio</Row>
            <Row>mm/dd/yyyy</Row></Container></th>
            <th><Container><Row>Fecha de Fin</Row>
            <Row>mm/dd/yyyy</Row></Container></th>
            <th><Container><Row>Fecha de Solicitud</Row>
            <Row>mm/dd/yyyy</Row></Container></th>
            <th># de Poliza</th>
            <th>Aprobación</th>
          </tr>
        </thead>
        <tbody>
          {polizas.map((poliza) => (
            <tr key={poliza.renovacion_id}>
              {Object.values(poliza).map((val, index) => (
                <td key={index}>{val}</td>
              ))}
              <td>
                <Button variant='primary' onClick={() => handleShow(poliza)}>Aprobar Solicitud</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            Confirmación de solicitud
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">Num. de Poliza: {polizaEdit.poliza_id}</Row>
          <Row className="mb-3">Fecha de inicio: {polizaEdit.fecha_inicio}</Row>
          <Row className="mb-3">Fecha de Fin: {polizaEdit.fecha_fin}</Row>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleRenovation}>
              Aprobar solicitud
          </Button>
          {polizaError.error ? <Row>{polizaError.message}</Row> 
          : <Row>{polizaError.message}</Row>}
        </Modal.Footer>
      </Modal>
    </Container>
    
  )
}