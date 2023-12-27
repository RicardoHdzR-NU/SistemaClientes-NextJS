import { useState, useEffect } from "react"
import { Form, Button, Card, Row, Container } from 'react-bootstrap'
import { useRouter } from "next/router";
import axios from 'axios'
import {signIn, useSession} from 'next-auth/react'


export default function LogIn(){
    const router = useRouter();
    const {data: session} = useSession()
    
    const returnHome = async () => {
        router.push('/')
    }
    
    //Hooks para capturar los datos de inicio de sesión
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    //Hooks para capturar la información que regresa el request a la BD
    const [user, setUser] = useState({})
    const [error, setError] = useState(false)
    //const [token, setToken] = useState('')
    const handleGoogleLogIn = async () =>{
        const userDetails = {
            name: session?.user?.name, 
            email: session?.user?.email,}

        const result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login/google`,{
            body: userDetails,
        })

        const userData = result.data.user
        setUser(userData);
    }
    //Hook que se ejecuta 1 vez al entrar a la página y cada que el objeto "user" cambie
    useEffect(() =>{
        
        if(user.user_id){
            console.log('hay un usuario: ', user)
            //sessionHandler();
            router.push(`/user/${user.user_id}`)
        }

        if(session && session.user){
            handleGoogleLogIn()
            console.log("usuario registrado con google")
            
            //router.push(`/user/${user.id}`)
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

        console.log(result.data)
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