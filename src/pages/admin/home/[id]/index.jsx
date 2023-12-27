import  { useState, useEffect } from "react"
import { Button, Card, Container } from 'react-bootstrap'
import axios from "axios"
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import _Navbar1 from "../../../components/_Navbar1";

function index(){
    const router = useRouter()

    const id = router.query.id;

    const [session, setSession] = useState({
        data: {
            user_id: null
        }
    })

    const sessionHandler = async () => {
        
        const session = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session`)

        console.log('session: ', session.data)
        if(session.data !== null){
            setSession(session)
        }
        else{
            //console.log('no hay sesión')
            router.push('/')
        }
        
    }
    const [admin, setAdmin] = useState({
        admin_id: null,
        name: null,
        password: null,
    })

    //función para obtener el usuario a partir del id
    const getAdmin = async () =>{
        const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/${id}`)  
        setAdmin(result.data.admin)
        
    }

    //Hook que se ejecuta al cargar la página para llamar a getUser
    useEffect(() =>{
        if(session.data.user_id == null){
            sessionHandler()
        }
        if(id){
            //console.log('id: ', id)
            getAdmin()
            //console.log(usuario)
        }
        
    },[id])
    const handleDestroySession = async () =>{
        const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/logout`)
    }

    //Función para log out
    const logOut = async () =>{
        handleDestroySession()
        signOut({callbackUrl: 'http://localhost:3000'})   
    }

    return(
        
        <Container>
            {session.data.admin_id != null &&
            <div>
                <_Navbar1 user={admin} />
                <Card>
                    <Card.Body>
                        
                        <Card.Title className='mb-3'>{admin.nombre}</Card.Title>
                        <Card.Text className='mb-3'>{admin.email}</Card.Text>
                        <Button onClick={logOut}>Log Out</Button>
                    </Card.Body>
                </Card>
            </div>}
            
        </Container>   
    )
}

export default index