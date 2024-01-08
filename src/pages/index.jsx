import {useEffect} from 'react';
import { Button, Card, Row } from 'react-bootstrap'
import axios from 'axios';
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  

    useEffect(() =>{
        sessionHandler();
    },[])

    const sessionHandler = async () => {
        const session = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session`)
        if(session.data !== null){
            if(session.data.type == 'user'){
                router.push(`/user/${session.data.user_id}`)
            }else if(session.data.type == 'admin'){
                router.push(`/admin/home/${session.data.admin_id}`)
            }
        }
    }
  
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
                  <Button variant='info' onClick={() => router.push('https://www.nationalunity.com')}>Ingresar como Invitado</Button>
              </Row>
          </Card.Body>
      </Card>
  )
}