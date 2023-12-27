import React, {useEffect, useState} from 'react'
import { Container, Table, Button, Modal, Form, Row, Col } from 'react-bootstrap'
import _Navbar from '../../components/_Navbar';
import axios from 'axios'
import { useRouter } from "next/router";

//export default function index({ vehiculos, usuario }) {
export default function index() {  
  const router = useRouter()
  const id = router.query.id;
  //console.log('id: ', id)
  const [vehiculos, setVehiculos] = useState([])
  const [usuario, setUsuario] = useState({})
  const [session, setSession] = useState({
    data: {
      user_id: null
    }
  })
  const [editConductores, setEditConductores] = useState({})
  const [conductoresError, setConductoresError] = useState({})
  const [conductorPrincipal, setConductorPrincipal] = useState("")
  const [conductorAd1, setConductorAd1] = useState("")
  const [conductorAd2, setConductorAd2] = useState("")
  

  const sessionHandler = async () => {
    const session = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session`)
    //console.log('session: ', session.data)
    if(session.data !== null){
    
      setSession(session)
    }
    else{
    
      router.push('/')
    }
      
  }

  const fetchVehiculos = async () =>{
    //console.log('id: ', id)
    const results = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/vehiculos/${id}`)
    console.log('vehiculos: ', results.data.vehiculos) 
    setVehiculos(results.data.vehiculos)
    
  }

  const getUser = async () =>{
    //console.log('id: ', id)
    const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`)
    //console.log('usuario: ', result.data.user)  
    setUsuario(result.data.user)
    
  }

  useEffect(() =>{
    //console.log('ejecutamos use effect')
    if(session.data.user_id == null){
        //console.log('obtenemos la sesion')
        sessionHandler()
    }
    getUser()
    
    /*if(!id){
        id = router.query.id
    }*/
    if(vehiculos.length == 0){
      //console.log('obtenemos los vehiculos')
      fetchVehiculos()
    }
  },[vehiculos, id])

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  async function handleShow (conductores_id) {
    //console.log('id: ', poliza_id)
    setShow(true);
    setEditConductores(conductores_id);
  }

  const handleConductoresUpdate = async () => {
    const updatedConductores = {
      principal: conductorPrincipal,
      ad1: conductorAd1,
      ad2: conductorAd2
    }
    const result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/vehiculo/${editConductores.vehiculo_id}`, {
      body: updatedConductores
    })
    setConductoresError(result.data);

  }

  return (
    <Container>
      <_Navbar user={usuario}/>
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
            <th>Editar</th>
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
              <td>
                <Button variant='primary' onClick={() => handleShow(vehiculo)}>Editar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                Solicitud de Cambio de Conductores
            </Modal.Header>
            <Modal.Body>
              <p>Conductores de {editConductores.marca} {editConductores.modelo} </p>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Conductor Principal</Form.Label>
                  <Form.Control type="text" onChange={(e) =>  setConductorPrincipal(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Conductor Adicional 1</Form.Label>
                  <Form.Control type="text" onChange={(e) =>  setConductorAd1(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Conductor Adicional 2</Form.Label>
                  <Form.Control type="text" onChange={(e) =>  setConductorAd2(e.target.value)}/>
                </Form.Group>
                {conductoresError.error ? <Form.Text style={{color: 'red'}}>{conductoresError.message}</Form.Text> 
                : <Form.Text style={{color: 'green'}}>{conductoresError.message}</Form.Text>}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleConductoresUpdate}>
                  Solicitar Renovación
              </Button>
            </Modal.Footer>
      </Modal>
    </Container>
    
  )
}