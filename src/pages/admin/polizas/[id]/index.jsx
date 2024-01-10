import React, {useEffect, useState} from 'react'
import { Container, Table, Row } from 'react-bootstrap'
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
    if(session.data.admin_id == null){
      sessionHandler()
    }
    if(id != undefined && admin.admin_id == null){
      getAdmin()
    }
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