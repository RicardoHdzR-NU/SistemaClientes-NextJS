import  { useState, useEffect } from "react"
import { Form, Button, Card, Row, Container, Modal, Image } from 'react-bootstrap'
import axios from "axios"
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import _Navbar from "../../components/_Navbar";

function index(){
    const router = useRouter()

    const id = router.query.id;
    //console.log('environment: ', process.env.NEXT_PUBLIC_API_URL)

    const [session, setSession] = useState({
        data: {
            type: 'user',
            user_id: null
        }
    })

    const sessionHandler = async () => {
        
        const session = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session`)

        //console.log('session: ', session.data)
        if(session.data !== null){
            //console.log('sesión existente: ', session.data)
            if(session.data.type != 'user'){
                //console.log('el tipo de sesion es distinta, redirigiendo')
                router.push('/')
            }else{
                setSession(session)
            }
            //router.push(`/user/${session.data.id}`)
            
        }
        else{
            //console.log('no hay sesión')
            router.push('/')
        }
        
    }
    const [usuario, setUsuario] = useState({
        user_id: null,
        name: null,
        email: null,
        picturegoogle: '',
        google: null,
        password: null,
        pictureuser: null,
    })
    
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
            const {data} = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/image/${id}` , formData);
            console.log(data);

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
        /*const url = String(process.env.API_URL) + '/user'
        console.log(url)
        console.log(process.env.API_URL)*/
        const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`)  
        setUsuario(result.data.user)
        
    }

    if (session.data.user_id != null && usuario.user_id ){
        if(session.data.user_id != usuario.user_id){
          router.push('/')
        }
      }

    //Hook que se ejecuta al cargar la página para llamar a getUser
    useEffect(() =>{
        if(session.data.user_id == null){
            sessionHandler()
        }
        if(id){
            //console.log('id: ', id)
            getUser()
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