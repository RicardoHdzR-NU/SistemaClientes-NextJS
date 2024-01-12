import React, {useEffect, useState} from 'react'
import { Container, Table, Row, Form } from 'react-bootstrap'
import _Navbar1 from "../../../components/_Navbar1";
import axios from 'axios'
import { useRouter } from "next/router";
import { format, parseISO } from 'date-fns';


export default function index() {
  //Objeto router que se encarga de la navegación
  const router = useRouter()
  //Obtenemos el id haciendo un query al URL y leyendo el [id]
  const id = router.query.id;
  //Hooks que captural las polizas y el admin
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
      admin_id: null
    }
  })

  //Hook que captura el filtro a utilizar
  const [query, setQuery] = useState('')

  //Función que obtiene la información de la sesión
  const sessionHandler = async () => {
    const session = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session`)
    //Si la información de la sesión y la página no coinciden lo regresa a la ruta raíz
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

  //Obtenemos la información de las polizas
  const fetchPolizas = async () =>{
    const results = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/polizas/`)
    if(results.data.polizas.length == 0){
      setPolizas([0])
    }else{
      await formatDates(results.data.polizas)
      setPolizas(results.data.polizas)
      setAllPolizas(results.data.polizas)
    }
  }

  const filterQuery = (query) => {
    let filterData = polizas;
    if(query){
      filterData = polizas.filter(plz => 
        plz.poliza_id.toString().includes(query) ||
        plz.tipo_poliza.includes(query) ||
        plz.archivo.includes(query) ||
        plz.fecha_inicio.includes(query) ||
        plz.fecha_fin.includes(query) ||
        plz.usuario.toString().includes(query)
      )
      setPolizas(filterData)
    }else{
      setPolizas(allPolizas)
    }
  }

  //Función que le da formato a las fechas
  async function formatDates(polizas) {
    polizas.forEach(element => {
      const date1 = parseISO(element.fecha_inicio)
      const date2 = parseISO(element.fecha_fin)
      element.fecha_inicio = format(date1, 'MM/dd/yyyy')
      element.fecha_fin = format(date2, 'MM/dd/yyyy')
    });
  }

  //Función que obtiene la información del admin
  const getAdmin = async () =>{
    const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/${id}`)  
    setAdmin(result.data.admin)
  }

  //Hook que se ejecuta al cargar la página, ejecuta las funciones de sesión, admin y polizas 
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
            <th># de Poliza</th>
            <th>Tipo de Poliza</th>
            <th><Container><Row>Fecha de Inicio</Row>
            <Row>mm/dd/yyyy</Row></Container></th>
            <th><Container><Row>Fecha de Fin</Row>
            <Row>mm/dd/yyyy</Row></Container></th>
            <th>Archivo</th>
            <th># de Usuario</th>
          </tr>
        </thead>{polizas[0] == 0 ? <tbody></tbody> :
        <tbody>
          {polizas.map((poliza) => (
            <tr key={poliza.poliza_id}>
              {Object.values(poliza).map((val, index) => (
                <td key={index}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>}
      </Table>
      </div>}
      
    </Container>
    
  )
}