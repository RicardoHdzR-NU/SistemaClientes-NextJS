import React, {useEffect, useState} from 'react'
import { Container, Table, Button, Modal, Form, Row } from 'react-bootstrap'
import _Navbar from '../../components/_Navbar';
import axios from 'axios'
import { useRouter } from "next/router";
import { format, parseISO } from 'date-fns';

export default function index() {
  //objeto router que se encarga de la navegación
  const router = useRouter()
  //obtenemos el id del usuario haciendo un query de la ruta y leyendo el id
  const id = router.query.id;
  //Hooks que captural las polizas y al usuario
  const [polizas, setPolizas] = useState([])
  const [allPolizas, setAllPolizas] = useState([])
  const [usuario, setUsuario] = useState({
    user_id: null,
  })
  //Hook que captura la sesión
  const [session, setSession] = useState({
    data: {
      type: 'user',
      user_id: null
    }
  })
  //Hooks que ayuda a ejecutar el request de la renovación de polizas
  const [polizaEdit, setPolizaEdit] = useState({})
  const [polizaError, setPolizaError] = useState({})
  const [nuevoInicio, setNuevoInicio] = useState(Date())
  const [nuevoFin, setNuevoFin] = useState(Date())

  //Hook que captura el filtro a utilizar
  const [query, setQuery] = useState('')

  //Función que obtiene la información de la sesión
  const sessionHandler = async () => {
    const session = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session`)
    //redirigimos al usuario a la página raíz si no coincide 
    //la información de la sesión con la página
    if(session.data !== null){
        if(session.data.type != 'user'){
            router.push('/')
        }else if(session.data.user_id != id){
            router.push('/')
        }else{
            setSession(session)
        }
    }
    else{
        router.push('/')
    }
  }

  //Función para obtener las polizas
  const fetchPolizas = async () =>{
    const results = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/polizas/${id}`)
    if(results.data.polizas.length == 0){
      setPolizas([0])
    }else{
      await formatDates(results.data.polizas)
      setAllPolizas(results.data.polizas)
      setPolizas(results.data.polizas)
    }
    
  }

  //Función para dar el formato a las fechas
  async function formatDates(polizas) {
    polizas.forEach(element => {
      const date1 = parseISO(element.fecha_inicio)
      const date2 = parseISO(element.fecha_fin)
      element.fecha_inicio = format(date1, 'MM/dd/yyyy')
      element.fecha_fin = format(date2, 'MM/dd/yyyy')
    });
  }

  //Función para obtener el usuario
  const getUser = async () =>{
    const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`)
    setUsuario(result.data.user)
  }

  const filterQuery = (query) => {
    let filterData = polizas;
    if(query){
      filterData = polizas.filter(plz => 
        plz.poliza_id.toString().includes(query) ||
        plz.tipo_poliza.includes(query) ||
        plz.archivo.includes(query) ||
        plz.fecha_inicio.includes(query) ||
        plz.fecha_fin.includes(query)
      )
      setPolizas(filterData)
    }else{
      setPolizas(allPolizas)
    }
  }

  //Función que se ejecuta al cargar la página y ejecuta las funciones de sesión, usuario y poliza
  useEffect(() =>{
    if(id != undefined && usuario.user_id == null){
      getUser()
    }
    if(session.data.user_id == null && usuario.user_id != null){
      sessionHandler()
    }
    if(polizas.length == 0){
      fetchPolizas()
    }
  },[polizas, id])

  useEffect(() =>{
    filterQuery(query)
  },[query])



  //Funciones que manejan el modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  async function handleShow (poliza_id) {
    setShow(true);
    setPolizaEdit(poliza_id);
  }

  //Función que maneja el request de la renovación de poliza
  const handleRenovation = async () => {
    const polizaDetails = {
      inicio: new Date(nuevoInicio),
      fin: new Date(nuevoFin),
    }
    const result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/poliza/${polizaEdit.poliza_id}`, {
      body: polizaDetails
    })
    setPolizaError(result.data);
  }

  return (
    <Container>
      {session.data.user_id != null &&
      <div>
      <_Navbar user={usuario}/>
      <div className='flex justify-between'>
        <Form className='mb-3 px-2 py-2 border-rounded'>
          <Form.Label>Filtro</Form.Label>
          <Form.Control type='text' onChange={(e) => setQuery(e.target.value)}></Form.Control>
        </Form>
      </div>
      
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
            <th>Renovación</th>
          </tr>
        </thead>{polizas[0] == 0 ? <tbody></tbody> :
        <tbody>
          {polizas.map((poliza) => (
            <tr key={poliza.poliza_id}>
              {Object.values(poliza).map((val, index) => (
                <td key={index}>{val}</td>
              ))}
              <td>
                <Button variant='primary' onClick={() => handleShow(poliza)}>Renovacion</Button>
              </td>
            </tr>
          ))}
        </tbody>}
      </Table>
      <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                Solicitud de Renovación de Poliza
            </Modal.Header>
            <Modal.Body>
              <p>Poliza # {polizaEdit.poliza_id}</p>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Inicio</Form.Label>
                  <Form.Control type="date" onChange={(e) =>  setNuevoInicio(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Fin</Form.Label>
                  <Form.Control type="date" onChange={(e) =>  setNuevoFin(e.target.value)}/>
                </Form.Group>
                {polizaError.error ? <Form.Text style={{color: 'red'}}>{polizaError.message}</Form.Text> 
                : <Form.Text style={{color: 'green'}}>{polizaError.message}</Form.Text>}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleRenovation}>
                  Solicitar Renovación
              </Button>
            </Modal.Footer>
      </Modal>
      </div>}
    </Container>
    
  )
}