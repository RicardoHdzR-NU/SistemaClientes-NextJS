import React, {useEffect, useState} from 'react'
import { Container, Table, Button, Modal, Form } from 'react-bootstrap'
import _Navbar from '../../components/_Navbar';
import axios from 'axios'
import { useRouter } from "next/router";
import { format, parseISO } from 'date-fns';
//import SolicitudRenovacion from '../../components/SolicitudRenovacion';

export default function index() {
  const router = useRouter()
  const id = router.query.id;
  const [polizas, setPolizas] = useState([])
  const [usuario, setUsuario] = useState({})
  const [session, setSession] = useState({
    data: {
      user_id: null
    }
  })
  const [polizaEdit, setPolizaEdit] = useState({})
  const [polizaError, setPolizaError] = useState({})
  const [nuevoInicio, setNuevoInicio] = useState(Date())
  const [nuevoFin, setNuevoFin] = useState(Date())
  //console.log(process.env.API_URL)

  const sessionHandler = async () => {
    /*const url = process.env.API_URL + '/session';
    console.log(url)*/
    const session = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session`)
    //console.log('session: ', session.data)
    if(session.data !== null){
      //console.log('sesión existente: ', session.data)
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
    const results = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/polizas/${id}`)
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

  const getUser = async () =>{
    //console.log('id: ', id)
    const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`)  
    //console.log('usuario: ', result.data.user)
    setUsuario(result.data.user)
  }

  useEffect(() =>{
    //console.log(process.env.API_URL)
    if(session.data.user_id == null){
      sessionHandler()
    }
    getUser()
    if(polizas.length == 0){
      fetchPolizas()
    }
  },[polizas, id])

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  async function handleShow (poliza_id) {
    //console.log('id: ', poliza_id)
    setShow(true);
    setPolizaEdit(poliza_id);
  }

  const handleRenovation = async () => {
    const polizaDetails = {
      inicio: nuevoInicio,
      fin: nuevoFin,
    }
    const result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/poliza/${polizaEdit.poliza_id}`, {
      body: polizaDetails
    })
    setPolizaError(result.data);
  }

  return (
    <Container>
      <_Navbar user={usuario}/>
      <Table bordered hover >
        <thead>
          <tr>
            <th># de Poliza</th>
            <th>Tipo de Poliza</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Fin</th>
            <th>Archivo</th>
            <th>Renovación</th>
          </tr>
        </thead>
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
        </tbody>
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
                  <Form.Control type="date" onChange={(e) =>  setNuevoInicio(new Date(e.target.value))}/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Inicio</Form.Label>
                  <Form.Control type="date" onChange={(e) =>  setNuevoFin(new Date(e.target.value))}/>
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
    </Container>
    
  )
}