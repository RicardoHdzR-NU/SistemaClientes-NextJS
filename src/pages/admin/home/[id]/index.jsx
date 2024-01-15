import  { useState, useEffect } from "react"
import { Button, Card, Container } from 'react-bootstrap'
import axios from "axios"
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import _Navbar1 from "../../../components/_Navbar1";

function index(){
    //Objeto router que se encarga de la navegación
    const router = useRouter()
    //Obtenemos el id haciendo un query a la URL y leyendo el [id]
    const id = router.query.id;
    //Hook de la sesión
    const [session, setSession] = useState({
        data: {
            type: 'admin',
            admin_id: null
        }
    })

    //Hook que captura la información del admin
    const [admin, setAdmin] = useState({
        admin_id: null,
        name: null
    })

    //Función que obtiene los datos de la sesión
    const sessionHandler = async () => {
        const session = await axios.get(`/api/session`)
        if(session.data !== null){
            //Si los datos de la sesión y la página no coinciden lo regresa a la página raíz
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

    //función para obtener el usuario a partir del id
    const getAdmin = async () =>{
        const result = await axios.get(`/api/admin/${id}`)  
        setAdmin(result.data.admin)
    }

    //Hook que se ejecuta al cargar la página, obtiene la sesión y al admin
    useEffect(() =>{
        if(session.data.admin_id == null){
            sessionHandler()
        }
        if(id != undefined && admin.admin_id == null){
            getAdmin()
        }
        
    },[id])

    //Función que elimina la sesión del browser
    const handleDestroySession = async () =>{
        const result = await axios.get(`/api/logout`)
    }

    //Función para log out
    const logOut = async () =>{
        handleDestroySession()
        signOut({callbackUrl: '/'})   
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