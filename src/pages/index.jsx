import {useEffect, useState} from 'react';
import { Button, Card, Row } from 'react-bootstrap'
//import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios';
//import { useRouter } from 'next/navigation'
import { useRouter } from 'next/router'
//import Cookies from 'js-cookie'

export default function Home() {
  const router = useRouter()
  

    useEffect(() =>{
        sessionHandler();
    },[])

    const sessionHandler = async () => {
        const session = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session`)
        //console.log('session: ', session.data)
        if(session.data !== null){
            //console.log('sesión existente: ', session.data)
            if(session.data.type == 'user'){
                router.push(`/user/${session.data.user_id}`)
            }else if(session.data.type == 'admin'){
                router.push(`/admin/home/${session.data.admin_id}`)
            }
            //router.push(`/user/${session.data.user_id}`)
        }
    }
  
  //renderizado de la página
  return(
      <Card className='text-center'>
          <Card.Body>
              <Card.Title>Bienvenido al sistema de Clientes de National Unity</Card.Title>
              <Card.Text>Selecciona una de las opciones para ingresar al sistema</Card.Text>
              <Row className='my-2'>
                  <Button variant='primary' onClick={() => router.push('/logIn')}>Iniciar Sesión</Button>
              </Row>
              <Row className='my-2'>
                  <Button variant='secondary' onClick={() => router.push('/signIn')}>Registrarse</Button>
              </Row>
              <Row className='my-2'>
                  <Button variant='info'>Ingresar como Invitado</Button>
              </Row>
              <Row className='my-2'>
                  <Button variant='info' onClick={() => router.push('/admin')} >Ingresar como Admin</Button>
              </Row>
          </Card.Body>
      </Card>
  )
}