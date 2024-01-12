import React, { useEffect, useState } from 'react'
import { Container, Table, Button, Modal, Form } from 'react-bootstrap'
import _Navbar from '../../components/_Navbar';
import axios from 'axios'
import { useRouter } from "next/router";

export default function index() {
  //objeto router que se encarga de la navegación
  const router = useRouter()
  //obtenemos el id del usuario haciendo un query de la ruta y leyendo el id
  const id = router.query.id;
  //Hook que captura la información de los vehiculos y el usuario
  const [vehiculos, setVehiculos] = useState([])
  const [allVehiculos, setAllVehiculos] = useState([])
  const [usuario, setUsuario] = useState({
    user_id: null,
  })
  //Hook que captura la información de la sesión
  const [session, setSession] = useState({
    data: {
      user_id: null
    }
  })
  //Hooks que ayudan a manejar la solicitud de cambio de conductores
  const [editConductores, setEditConductores] = useState({})
  const [conductoresError, setConductoresError] = useState({})
  const [conductorPrincipal, setConductorPrincipal] = useState("")
  const [conductorAd1, setConductorAd1] = useState("")
  const [conductorAd2, setConductorAd2] = useState("")

  //Hook que captura el filtro a utilizar
  const [query, setQuery] = useState('')

  //Función que obtiene la información de la sesión
  const sessionHandler = async () => {
    const session = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session`)
    //Si el usuario intenta acceder a una página que no coincide con la  
    //información de su sesión lo redirige a la página raíz
    if (session.data !== null) {
      if (session.data.type != 'user') {
        router.push('/')
      } else if (session.data.user_id != id) {
        router.push('/')
      } else { //Capturamos la información de la sesión
        setSession(session)
      }
    }//Si no hay información en la sesión lo redirige a la página raíz
    else {
      router.push('/')
    }
  }

  //función para obtener la información de los vehiculos
  const fetchVehiculos = async () => {
    const results = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/vehiculos/${id}`)
    if (results.data.vehiculos.length == 0) {
      setVehiculos([0])
    } else {
      setVehiculos(results.data.vehiculos)
      setAllVehiculos(results.data.vehiculos)
    }
  }

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
        vhcl.poliza_id.toString().includes(query)
      )
      setVehiculos(filterData)
    } else {
      setVehiculos(allVehiculos)
    }
  }

  //función para obtener la información del usuario
  const getUser = async () => {
    const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`)
    setUsuario(result.data.user)
  }
  //Hook que se ejecuta al cargar la página, se encarga de llamar 
  //la función de sesión y vehiculos respectivamente
  useEffect(() => {
    if (id != undefined && usuario.user_id == null) {
      getUser()
    }
    if (session.data.user_id == null && usuario.user_id != null) {
      sessionHandler()
    }
    if (vehiculos.length == 0) {
      fetchVehiculos()
    }
  }, [vehiculos, id])

  useEffect(() => {
    filterQuery(query)
  }, [query])

  //Hooks y funciones que manejan el modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  async function handleShow(conductores_id) {
    setShow(true);
    setEditConductores(conductores_id);
  }
  //función que maneja el request de cambio de conductores
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
          <_Navbar user={usuario} />
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
                <th>Editar</th>
              </tr>
            </thead>{vehiculos[0] == 0 ? <tbody></tbody> :
              <tbody>
                {vehiculos.map((vehiculo) => (
                  <tr key={vehiculo.vehiculo_id}>
                    {Object.values(vehiculo).map((val, index) => (
                      <td key={index}>{Array.isArray(val) ?
                        <div>{val[0]}<br />
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
              </tbody>}
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
                  <Form.Control type="text" onChange={(e) => setConductorPrincipal(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Conductor Adicional 1</Form.Label>
                  <Form.Control type="text" onChange={(e) => setConductorAd1(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Conductor Adicional 2</Form.Label>
                  <Form.Control type="text" onChange={(e) => setConductorAd2(e.target.value)} />
                </Form.Group>
                {conductoresError.error ? <Form.Text style={{ color: 'red' }}>{conductoresError.message}</Form.Text>
                  : <Form.Text style={{ color: 'green' }}>{conductoresError.message}</Form.Text>}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleConductoresUpdate}>
                Solicitar Cambio
              </Button>
            </Modal.Footer>
          </Modal>
        </div>}

    </Container>

  )
}