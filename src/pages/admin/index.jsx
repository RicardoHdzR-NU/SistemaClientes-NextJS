import { useState, useEffect } from "react"
import { Form, Button, Card, Row, Container } from 'react-bootstrap'
import { useRouter } from "next/router";
import axios from 'axios'

export default function LogInAdmin(){
    //Objeto router que se encarga de la navegación
    const router = useRouter();
    //Función para regresar  la página raíz
    const returnHome = async () => {
        router.push('/')
    }
    //Hooks para capturar los datos de inicio de sesión
    const [name, setName] = useState("");
    const [password, setPassword] = useState("")
    //Hooks para capturar la información que regresa el request a la BD
    const [admin, setAdmin] = useState({
        admin_id: null,
        name: null
    })
    const [error, setError] = useState(false)
    
    //Hook que se ejecuta 1 vez al entrar a la página y cada que el objeto "user" cambie
    useEffect(() =>{
        
        if(admin.admin_id != null){
            router.push(`admin/home/${admin.admin_id}`)
        }
    },[admin])

    //Función para manejar log in
    const handleLogIn = async () => {
        const userDetails = {
            email: name,
            password: password,}
        const result = await axios.post(`/api/admin/logIn`,{
            body: userDetails,
        })
        //definimos el error y el usuario
        const err = result.data.error
        const userData = result.data.user
        setError(err);
        setAdmin(userData);
    }

    
    return(
        <Container>
            <Card className='justify-content-center d-flex'>
                <Card.Body>
                <Card.Title>Sistema de Administradores</Card.Title>
                    <Form>
                        <Form.Group className='mb-3'>
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control type='email' placeholder='admin@ejemplo.com' value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                            {error && <Form.Text style={{color: 'red'}}>No existe un usuario con su nombre y contraseña</Form.Text>}
                        </Form.Group>
                        
                        <Row className='mb-3'>
                            <Button variant='primary'  onClick={handleLogIn}>Iniciar Sesión</Button>
                        </Row>
                        <Row className='mb-3'>
                            <Button variant='info' onClick={returnHome}>Regresar</Button>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}