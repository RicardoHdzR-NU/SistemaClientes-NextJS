import  { useState, useEffect } from "react"
import { Form, Button, Card, Row, Container, Modal, Image } from 'react-bootstrap'
import axios from "axios"
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import _Navbar from "../../components/_Navbar";

function index(){
    //objeto router que se encarga de la navegación
    const router = useRouter()
    //obtenemos el id del usuario haciendo un query de la ruta y leyendo el id
    const id = router.query.id;
    //Hook que captura la información de la sesión
    const [session, setSession] = useState({
        data: {
            type: 'user',
            user_id: null
        }
    })
    //Hook que captura la información del usuario
    const [usuario, setUsuario] = useState({
        user_id: null,
    })
    //Función que obtiene la información de la sesión
    const sessionHandler = async () => {
        
        const session = await axios.get(`/api/session`)
        //Redirige al usuario si la información de la sesión no coincide con la página
        if(session.data !== null){
            if(session.data.type != 'user'){
                router.push('/')
            }else if(session.data.user_id != id){
                router.push('/')
            }else{
                setSession(session)
            }
        }
        else{
            router.push('/')
        }
        
    }
    
    
    //hooks para manejar el cambio de imagen
    const [show, setShow] = useState(false);
    const [img, setImage] = useState('');
    const [selectedFile, setSelectedFile] = useState()

    //función para seleccionar la nueva imagen
    const setUpload = (e) => {
        const file = e.target.files[0]
        setImage(URL.createObjectURL(file))
        setSelectedFile(file)
    }

    //función para manejar el cambio de imagen
    const handleUpload = async (e) => {
        e.preventDefault();

        try{
            if(!selectedFile) return;
            const formData = new FormData();
            formData.append('image', selectedFile);
            const {data} = await axios.put(`/api/user/image/${id}` , formData);

        }catch(error){
            console.log(error.response?.data);
        }
        getUser();
    }

    //funciones para manejar el Modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //función para obtener el usuario a partir del id
    const getUser = async () =>{
        const result = await axios.get(`/api/user/${id}`)  
        setUsuario(result.data.user)  
    }

    //Hook que se ejecuta al cargar la página para llamar a getUser
    useEffect(() =>{
        if(id != undefined && usuario.user_id == null){
            getUser()
        }
        if(session.data.user_id == null){
            sessionHandler()
        }
    },[id])

    const handleDestroySession = async () =>{
        const result = await axios.get(`/api/logout`)
    }

    //Función para log out
    const logOut = async () =>{
        //destruimos la sesión y redirigimos al usuairo a la página raíz
        handleDestroySession()
        signOut({callbackUrl: '/'})   
    }

    return(
        
        <Container>
            {session.data.user_id != null &&
            <div>
                <_Navbar user={usuario} />
                <Card>
                    <Card.Body>
                        <div className="thumbnail">
                        {usuario.pictureuser ? 
                        
                            <Image  src={`/images/${usuario.pictureuser}`} className='mb-3 wrapper'></Image>
                            :
                            <Image  src={usuario.picturegoogle} className='mb-3 wrapper'></Image>
                            }
                        </div>
                        
                        
                    
                        <Card.Title className='mb-3'>{usuario.name}</Card.Title>
                        <Card.Text className='mb-3'>{usuario.email}</Card.Text>
                        <Row className='mb-3'><Button onClick={handleShow}>Subir imagen de perfil</Button></Row>
                        
                        <Button onClick={logOut}>Log Out</Button>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Suba la imagen desde su dispositivo</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label>Imagen en formato PNG o JPEG</Form.Label>
                                    <Form.Control type="file" name='image' onChange={setUpload}/>
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="primary" onClick={handleUpload}>
                                Subir Imagen
                            </Button>
                            </Modal.Footer>
                        </Modal>
                    </Card.Body>
                </Card>
            </div>}
            
        </Container>   
    )
}

export default index