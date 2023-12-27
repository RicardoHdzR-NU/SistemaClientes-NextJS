import React from 'react'
import { Navbar, NavDropdown, Container } from 'react-bootstrap'
import { useRouter } from 'next/router'
import axios from 'axios'
import { signOut } from "next-auth/react";

export default function _Navbar1({user}) {

  const router = useRouter()
  const handleDestroySession = async () =>{
    const result = await axios.get('http://localhost:3000/api/logout')
  }

  const logOut = async () =>{
    handleDestroySession()
    //router.push('/');
    signOut({callbackUrl: 'http://localhost:3000'})
    
    
    //console.log('sesión terminada')
    
  }

  //console.log(user)
  return (
    <Navbar className="bg-body-tertiary " fixed='top' >
      <Container >
        <Navbar.Brand href='/'>National Unity</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
          <NavDropdown title={user ? user.nombre : 'Usuario'}>
            <NavDropdown.Item as='button' onClick={() => router.push(`/admin/polizas/${user.admin_id}/`)}>Polizas</NavDropdown.Item>
            <NavDropdown.Item as='button' onClick={() => router.push(`/admin/vehiculos/${user.admin_id}/`)}>Vehículos</NavDropdown.Item>
            <NavDropdown.Divider/>
            <NavDropdown.Item as='button' onClick={() => router.push(`/admin/solicitudes/polizas/${user.admin_id}/`)}>Solic. de Polizas</NavDropdown.Item>
            <NavDropdown.Item as='button' onClick={() => router.push(`/admin/solicitudes/vehiculos/${user.admin_id}/`)}>Solic. de Vehículos</NavDropdown.Item>
            <NavDropdown.Divider/>
            <NavDropdown.Item as='button' onClick={() => router.push(`/admin/home/${user.admin_id}/`)}>Admin</NavDropdown.Item>
            <NavDropdown.Divider/>
            <NavDropdown.Item as='button' onClick={logOut}>Log Out</NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}