import { useState, useEffect } from "react"
import { Form, Button, Card, Row, Container } from 'react-bootstrap'
import { useRouter } from "next/router";
import axios from 'axios'
import {signIn, useSession} from 'next-auth/react'


export default function LogIn(){
    //Objeto router que maneja la navegación
    const router = useRouter();
    //Hook que maneja la sesión con el API de Google
    const {data: session} = useSession()
    //Función para regresar a la página raíz
    const returnHome = async () => {
        router.push('/')
    }
    //Hooks para capturar la información del usuario
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    //Hooks para capturar el usuario y el error
    const [user, setUser] = useState({})
    const [error, setError] = useState(false)
    
    //Hook que se ejecuta al cargar la página, si el objeto "user" cambia dirige al usuario 
    //a la pagina de usuario, y si el objeto session cambia hace el log in con Google
    useEffect(() =>{
        
        if(user.user_id){
            router.push(`/user/${user.user_id}`)
        }

        if(session && session.user){
            handleGoogleLogIn()
        }
    },[user, session])

    //Función para manejar log in local (no Google)
    const handleLogIn = async () => {
        const userDetails = {
            email: email,
            password: password,}
        const result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logIn`,{
            body: userDetails,
        })
        //definimos el error y el usuario
        const err = result.data.error
        const userData = result.data.user
        setError(err);
        setUser(userData);
    }

    //Función que maneja el log in con Google
    const handleGoogleLogIn = async () =>{
        //Objeto de la información del usuairo
        const userDetails = {
            name: session?.user?.name, 
            email: session?.user?.email,}
        //request a la base de datos para registrar al usuario
        const result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logIn/google`,{
            body: userDetails,
        })
        //definimos el error y el usuario
        const err = result.data.error
        const userData = result.data.user
        setError(err);
        setUser(userData);
    }
    
    return(
        <Container>
            <Card className='justify-content-center d-flex'>
                <Card.Body>
                    <Form>
                        <Form.Group className='mb-3'>
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control type='email' placeholder='nombre@ejemplo.com' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                            {error && <Form.Text style={{color: 'red'}}>No existe un usuario con su correo y contraseña</Form.Text>}
                        </Form.Group>
                        
                        <Row className='mb-3'>
                            <Button variant='primary'  onClick={handleLogIn}>Iniciar Sesión</Button>
                        </Row>
                        <Row>
                            <Button variant='secondary' className='mb-3' onClick={() => signIn()}>Iniciar Sesión con Google</Button>
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