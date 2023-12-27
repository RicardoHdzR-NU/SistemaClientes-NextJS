import React from 'react'
import { Modal } from 'react-bootstrap'


function SolicitudRenovacion({poliza}) {

    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    console.log(poliza)
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                Solicitud de Renovación de Poliza
            </Modal.Header>
            <Modal.Body>Poliza #{poliza}</Modal.Body>
        </Modal>
    )
}

export default SolicitudRenovacion