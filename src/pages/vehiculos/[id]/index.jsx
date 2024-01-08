import React, {useEffect, useState} from 'react'
import { Container, Table, Button, Modal, Form } from 'react-bootstrap'
import _Navbar from '../../components/_Navbar';
import axios from 'axios'
import { useRouter } from "next/router";

export default function index() {  
  const router = useRouter()
  const id = router.query.id;
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
    if(session.data !== null){
        if(session.data.type != 'user'){
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
    const results = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/vehiculos/${id}`)
    console.log('vehiculos: ', results.data.vehiculos) 
    setVehiculos(results.data.vehiculos)
    
  }

  const getUser = async () =>{
    const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`)
    setUsuario(result.data.user)
    
  }

  if (session.data.user_id != null && usuario.user_id ){
    if(session.data.user_id != usuario.user_id){
      router.push('/')
    }
  }

  useEffect(() =>{
    if(session.data.user_id == null){
        sessionHandler()
    }
    getUser()
    if(vehiculos.length == 0){
      fetchVehiculos()
    }
  },[vehiculos, id])

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  async function handleShow (conductores_id) {
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
      {session.data.user_id != null &&
      <div>
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
      </div>}
      
    </Container>
    
  )
}