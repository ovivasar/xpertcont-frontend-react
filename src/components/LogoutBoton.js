import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {Button} from '@mui/material'

const LogoutBoton = () => {

    const {logout} = useAuth0();
  
    return <Button variant='contained' color='warning' onClick={()=>{logout();}} >out</Button>
    
};

export default LogoutBoton;