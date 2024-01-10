import React from 'react'
import { Navbar, NavDropdown, Container, Image, Button } from 'react-bootstrap'
import { useRouter } from 'next/router'
import axios from 'axios'
import { signOut } from "next-auth/react";

export default function _Navbar({user}) {
  //Objeto router que se encarga de la navegación
  const router = useRouter()
  //Función que destruye la sesión
  const handleDestroySession = async () =>{
    const result = await axios.get('http://localhost:3000/api/logout')
  }
  //Función que maneja el log out
  const logOut = async () =>{
    handleDestroySession()
    signOut({callbackUrl: 'http://localhost:3000'})
  }

  return (
    <Navbar className="bg-body-tertiary " fixed='top' >
      <Container >
        <Navbar.Brand href='/'>National Unity</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
          <NavDropdown title={user ? user.name : 'Usuario'}>
            <NavDropdown.Item as='button' onClick={() => router.push(`/polizas/${user.user_id}/`)}>Polizas</NavDropdown.Item>
            <NavDropdown.Item as='button' onClick={() => router.push(`/vehiculos/${user.user_id}/`)}>Vehículos</NavDropdown.Item>
            <NavDropdown.Item as='button' onClick={() => router.push(`/user/${user.user_id}/`)}>Usuario</NavDropdown.Item>
            <NavDropdown.Divider/>
            <NavDropdown.Item as='button' onClick={logOut}>Log Out</NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}