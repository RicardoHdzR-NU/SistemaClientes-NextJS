"use client"
import {useState, useEffect} from 'react'
import { Form, Button, Card, Row } from 'react-bootstrap'
import axios from 'axios'
import { useRouter } from 'next/router'
import {signIn, useSession} from 'next-auth/react'

export default function signin() {
    //función para regresar al inicio
    const router = useRouter();
    const returnHome = async () => {
        router.push('/')
    }
    //Hooks para capturar la información del usuario
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState("")
    const [nombre, setNombre] = useState('')
    //Hooks para capturar al usuario y al error
    const [user, setUser] = useState({
        id: null,
        name: null,
        email: null,
        picturegoogle: null,
        google: null,
        password: null,
        pictureuser: null,
    })
    const [error, setError] = useState(false)
    const {data: session} = useSession()
    console.log(session)

    const handleGoogleSignIn = async () =>{
        const userDetails = {
            name: session?.user?.name, 
            email: session?.user?.email,}

        const result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/signin/google`,{
            body: userDetails,
        })

        const userData = result.data.user
        setUser(userData);
    }

    //Hook que se ejecuta al cargar la página y cuando cambia "user", si existe user envía a la página de usuario
    useEffect(() =>{

        if( user.id !== null ){
            console.log("usuario registrado")
            router.push(`/user/${user.id}`)
        }

        if(session && session.user){
            handleGoogleSignIn()
            console.log("usuario registrado con google")
        }
    },[user, session])

    //Función para manejar Sign In local (no Google)
    const handleSignIn = async () => {
        //Objeto de la información del usuairo
        const userDetails = {name: nombre, 
            email: email,
            password: password,}
        //request a la base de datos para registrar al usuario
        const result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/signin`,{
            body: userDetails,
        })
        console.log(result.data)
        //definimos el error y el usuario
        const err = result.data.error
        const userData = result.data.user
        setError(err);
        setUser(userData);
    }

    //Función para manejar el sign in con Google
    /*const responseMessage = async (response) => {
        const result = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/signin/google`,{
            withCredentials: true,
            headers: {Accept: 'application/json',
            'Content-Type': 'application/json'},
            //enviamos el Json Web Token al server para autenticar
            body: `${response.credential}`,
        })
        //capturamos el usuario y el error
        const err = result.data.error
        const userData = result.data.user
        setError(err);
        setUser(userData);
        
    };
    const errorMessage = (error) => {
        console.log(error);
    };*/

    /*
<Row className='mb-3 ps-4'>
                        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
                    </Row>
    */
    //Si existe un error notificamos que ya existe un usuario con esa información
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