import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {Button} from '@mui/material'

const LoginBoton = () => {

    const {loginWithRedirect} = useAuth0();
  
    return <Button variant='contained' color='primary' onClick={()=>{loginWithRedirect();}} >IN</Button>
    
};

export default LoginBoton;