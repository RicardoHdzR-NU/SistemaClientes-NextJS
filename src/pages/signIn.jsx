"use client"
import {useState, useEffect} from 'react'
import { Form, Button, Card, Row } from 'react-bootstrap'
import axios from 'axios'
import { useRouter } from 'next/router'
import {signIn, useSession} from 'next-auth/react'

export default function signin() {
    //Objeto router que se encarga de la navegación
    const router = useRouter();
    //Hook que maneja la sesión con el API de Google
    const {data: session} = useSession()
    //función para regresar a la página raíz
    const returnHome = async () => {
        router.push('/')
    }
    //Hooks para capturar la información del usuario
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState("")
    const [nombre, setNombre] = useState('')
    //Hooks para capturar al usuario y al error
    const [user, setUser] = useState({})
    const [error, setError] = useState(false)
    
    

    //Hook que se ejecuta al cargar la página, si el objeto "user" cambia dirige al usuario 
    //a la pagina de usuario, y si el objeto session cambia hace el sign in con google
    useEffect(() =>{

        if( user.id !== null ){
            router.push(`/user/${user.id}`)
        }

        if(session && session.user){
            handleGoogleSignIn()
        }
    },[user, session])

    //Función para manejar Sign In local (no Google)
    const handleSignIn = async () => {
        //Objeto de la información del usuairo
        const userDetails = {name: nombre, 
            email: email,
            password: password,}
        //request a la base de datos para registrar al usuario
        const result = await axios.post(`/api/signIn`,{
            body: userDetails,
        })
        //definimos el error y el usuario
        const err = result.data.error
        const userData = result.data.user
        setError(err);
        setUser(userData);
    }
    //Función para manejar el sign in con Google
    const handleGoogleSignIn = async () =>{
         //Objeto de la información del usuairo
        const userDetails = {
            name: session?.user?.name, 
            email: session?.user?.email,}
        //request a la base de datos para registrar al usuario
        const result = await axios.post(`/api/signIn/google`,{
            body: userDetails,
        })
        //definimos el error y el usuario
        const err = result.data.error
        const userData = result.data.user
        setError(err)
        setUser(userData);
    }
    return(
        <Card className='justify-content-center'>
            <Card.Body>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>Nombre Completo</Form.Label>
                        <Form.Control value={nombre} onChange={(e) => setNombre(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control type='email' placeholder='nombre@ejemplo.com' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control type='password' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                        {error && <Form.Text style={{color: 'red'}}>Ya existe un usuario con este nombre y Contraseña</Form.Text>}
                    </Form.Group>
                    
                    <Row>
                        <Button variant='primary' onClick={handleSignIn} className='mb-3'>Registrarse</Button>
                    </Row>
                    <Row>
                        <Button variant='secondary' className='mb-3' onClick={() => signIn()}>Registrarse con Google</Button>
                    </Row>
                    <Row>
                        <Button variant='info' className='mb-3' onClick={returnHome}>Regresar</Button>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    )
}