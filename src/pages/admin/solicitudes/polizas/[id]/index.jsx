import React, {useEffect, useState} from 'react'
import { Container, Table, Button, Modal, Row, Form } from 'react-bootstrap'
import _Navbar1 from "../../../../components/_Navbar1";
import axios from 'axios'
import { useRouter } from "next/router";
import { format, parseISO } from 'date-fns';

export default function index() {
  //Objeto router que se encarga de la navegación
  const router = useRouter()
  //Obtenemos el id al hacer un query al URL y leer el [id]
  const id = router.query.id;
  //Hooks que captural las polizas y al admin
  const [polizas, setPolizas] = useState([])
  const [allPolizas, setAllPolizas] = useState([])
  const [admin, setAdmin] = useState({
    admin_id: null,
    name: null
  })
  //Hook que captura la sesión
  const [session, setSession] = useState({
    data: {
      type: 'admin',
      user_id: null
    }
  })
  //Hooks que ayudan a manejar las requests de actualización
  const [polizaEdit, setPolizaEdit] = useState({})
  const [polizaError, setPolizaError] = useState({})

  //Hook que captura el filtro a utilizar
  const [query, setQuery] = useState('')

  //Función que obtiene la información de la sesión
  const sessionHandler = async () => {
        
    const session = await axios.get(`/api/session`)
    if(session.data !== null){
        //si la información de la sesión y la de la página no coinciden lo regresa a la página raíz
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

  //Obtenemos la informacipin de las polizas
  const fetchPolizas = async () =>{
    const results = await axios.get(`/api/admin/solicitudes/polizas/`)
    if(results.data.polizas.length == 0){
      setPolizas([0])
    }else{
      await formatDates(results.data.polizas)
      setPolizas(results.data.polizas)
      setAllPolizas(results.data.polizas)
    }
  }

  //funcionalida de filtro de datos
  const filterQuery = (query) => {
    let filterData = polizas;
    if(query){
      filterData = polizas.filter(plz => 
        plz.renovacion_id.toString().includes(query) ||
        plz.fecha_inicio.includes(query) ||
        plz.fecha_fin.includes(query) ||
        plz.fecha_solicitud.includes(query) ||
        plz.poliza_id.toString().includes(query)
      )
      setPolizas(filterData)
    }else{
      setPolizas(allPolizas)
    }
  }

  //Función para darle formato a las fechas
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
  //Obtenemos la información del admin
  const getAdmin = async () =>{
    const result = await axios.get(`/api/admin/${id}`)  
    setAdmin(result.data.admin)
  }

  //Hookas y función que manejan el modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  async function handleShow (poliza_id) {
    setShow(true);
    setPolizaEdit(poliza_id);
  }

  //Función que maneja la actualización de las polizas
  const handleRenovation = async () => {
    const polizaDetails = {
      inicio: new Date(polizaEdit.fecha_inicio),
      fin: new Date(polizaEdit.fecha_fin),
    }
    const result = await axios.put(`/api/poliza/${polizaEdit.poliza_id}`, {
      body: polizaDetails
    })
    setPolizaError(result.data);
    if(!polizaError.error){
      const deletion = await axios.delete(`/api/poliza/${polizaEdit.poliza_id}`)
    }
    
  }

  //Hook que se ejecuta al cargar la página, obtiene la sesión, el admin y las polizas
  useEffect(() =>{
    if(id != undefined && admin.admin_id == null){
      getAdmin()
    }
    if(session.data.admin_id == null && admin.admin_id != null){
      sessionHandler()
    }
    if(polizas.length == 0){
      fetchPolizas()
    }
  },[polizas, id])

  useEffect(() =>{
    filterQuery(query)
  },[query])

  return (
    <Container>
      {session.data.admin_id != null &&
      <div>
      <_Navbar1 user={admin}/>
      <div className='flex justify-between'>
        <Form className='mb-3 px-2 py-2 border-rounded'>
          <Form.Label>Filtro</Form.Label>
          <Form.Control type='text' onChange={(e) => setQuery(e.target.value)}></Form.Control>
        </Form>
      </div>
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
        </thead>{polizas[0] == 0 ? <tbody></tbody> :
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
        </tbody>}
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