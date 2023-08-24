import {Box, Container, Toolbar, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import IconButton from '@mui/material/IconButton';

import HomeIcon from '@mui/icons-material/Home';
import GradingIcon from '@mui/icons-material/Grading';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import GroupIcon from '@mui/icons-material/Group';
import PaidIcon from '@mui/icons-material/Paid';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import { blueGrey } from '@mui/material/colors';
import Tooltip from '@mui/material/Tooltip';
import NextWeekIcon from '@mui/icons-material/NextWeek';
import SystemSecurityUpdateGoodIcon from '@mui/icons-material/SystemSecurityUpdateGood';

import React, { useState } from 'react';
import LoginPerfil from "./LoginPerfil" //new
import LoginLogoutBoton from "./LoginLogoutBoton" //new
import { useAuth0 } from '@auth0/auth0-react'; //new para cargar permisos luego de verificar registro en bd
import { useEffect } from "react"

export default function NavBar(props) {
  const navigate  = useNavigate();
  const [selectedButton, setSelectedButton] = useState(null);
  
  const {user, isAuthenticated } = useAuth0();
  const [permisos, setPermisos] = useState([]); //Menu

  const [permisoVentas, setPermisoVentas] = useState(false);
  const [permisoOCarga, setPermisoOCarga] = useState(false);
  const [permisoGuias, setPermisoGuias] = useState(false);
  const [permisoCorrentistas, setPermisoCorrentistas] = useState(false);
  const [permisoZonasVenta, setPermisoZonasVenta] = useState(false);
  const [permisoZonasEntrega, setPermisoZonasEntrega] = useState(false);
  const [permisoProductos, setPermisoProductos] = useState(false);
  const [permisoSeguridad, setPermisoSeguridad] = useState(false);

  const handleClick = (buttonId) => {
    setSelectedButton(buttonId);
  }

  //////////////////////////////////////////////////////////
  useEffect(() => {
    if (isAuthenticated && user && user.email) {
      // cargar permisos de sistema
      cargaPermisosMenu();
      
    }
  }, [isAuthenticated, user]);
  //////////////////////////////////////////////////////////
  const cargaPermisosMenu = async()=>{
      //Realiza la consulta a la API de permisos, puro Menu (obtenerTodosMenu)
      fetch(`https://alsa-backend-js-production.up.railway.app/seguridad/${user.email}`, {
        method: 'GET',
        //headers: {
        //  'Authorization': 'TOKEN_DE_AUTORIZACION' // Si es necesario
        // }
      })
      .then(response => response.json())
      .then(permisosData => {
        // Guarda los permisos en el estado
        setPermisos(permisosData);
    
        let tienePermiso;
        // Verifica si existe el permiso de acceso 'ventas'
        tienePermiso = permisosData.some(permiso => permiso.id_menu === '01');
        if (tienePermiso) {
          setPermisoVentas(true);
          //console.log("permisos Ventas: ", user.email, permisoVentas);
        }
        tienePermiso = permisosData.some(permiso => permiso.id_menu === '02');
        if (tienePermiso) {
          setPermisoOCarga(true);
          //console.log("permisos Ocarga: ", user.email);
        }
        tienePermiso = permisosData.some(permiso => permiso.id_menu === '03');
        if (tienePermiso) {
          setPermisoGuias(true);
        }
        tienePermiso = permisosData.some(permiso => permiso.id_menu === '04');
        if (tienePermiso) {
          setPermisoCorrentistas(true);
        }
        tienePermiso = permisosData.some(permiso => permiso.id_menu === '05');
        if (tienePermiso) {
          setPermisoZonasVenta(true);
        }
        tienePermiso = permisosData.some(permiso => permiso.id_menu === '06');
        if (tienePermiso) {
          setPermisoZonasEntrega(true);
        }
        tienePermiso = permisosData.some(permiso => permiso.id_menu === '07');
        if (tienePermiso) {
          setPermisoProductos(true);
        }
        tienePermiso = permisosData.some(permiso => permiso.id_menu === '08');
        if (tienePermiso) {
          setPermisoSeguridad(true);
        }
      })
      .catch(error => {
        console.log('Error al obtener los permisos:', error);
      });
  }

  return (
    <Box sx={{ flexGrow:1 }} >
        <Container>
            <Toolbar>

                    <IconButton  
                        sx={{
                          color: selectedButton === 'icono00' ? 'primary.main' : blueGrey[300],flexGrow:1
                        }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/`);
                                  handleClick('icono00');
                                                }
                                }
                    >
                      <LoginPerfil></LoginPerfil>
                    </IconButton>

                    <IconButton  
                        sx={{
                          color: blueGrey[300],flexGrow:1
                        }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/`);
                                                }
                                }
                    >
                    <LoginLogoutBoton></LoginLogoutBoton>
                    </IconButton>
                  
                    <IconButton  
                        sx={{
                          color: selectedButton === 'icono01' ? 'primary.main' : blueGrey[300],flexGrow:1
                        }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/`);
                                  handleClick('icono01');
                                                }
                                }
                    >
                      <HomeIcon />
                    </IconButton>
                    
                    { permisoVentas ?
                    (
                    <Tooltip title="REGISTRO Asientos">
                    <IconButton  
                        sx={{
                          color: selectedButton === 'icono02' ? 'primary.main' : blueGrey[300],flexGrow:1
                        }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                    //el ventalist se encargara de verificar permisos Comandos, con email
                                    navigate(`/venta/${props.fecha_ini}/${props.fecha_proceso}/${user.email}`);
                                    handleClick('icono02');
                                                }
                                }
                    >
                      <GradingIcon />
                    </IconButton>
                    </Tooltip>
                    ):(
                      <span></span>
                    )
                    }

                    { permisoOCarga ?
                    (
                    <Tooltip title="REPORTES Contables">
                    <IconButton  
                        sx={{
                          color: selectedButton === 'icono03' ? 'primary.main' : blueGrey[300],
                          flexGrow:1
                        }}
                                component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/ocargadet/${props.fecha_ini}/${props.fecha_proceso}`);
                                  handleClick('icono03');
                                                }
                                }
                    >
                    <InsertChartIcon />
                      
                    </IconButton>
                    </Tooltip>
                    ):(
                      <span></span>
                    )
                    }

                    { permisoGuias ?
                    (
                    <Tooltip title="Panel 01 CONTABILIDADES">
                    <IconButton  
                        sx={{
                          color: selectedButton === 'icono04' ? 'primary.main' : blueGrey[300],flexGrow:1
                        }}
                                component="label" size="large" color="success"
                                onClick = {()=> {
                                  navigate(`/contabilidades`);
                                  handleClick('icono04');
                                                }
                                }
                    >
                      <Typography variant="subtitle2" sx={{ ml: 1 }}>
                      01
                      </Typography>                    
                      <NextWeekIcon />
                    </IconButton>
                    </Tooltip>
                    ):(
                      <span></span>
                    )
                    }

                    { permisoCorrentistas ?
                    (
                    <Tooltip title="Panel 02 TIPO-CAMBIO">
                    <IconButton  
                        sx={{
                          color: selectedButton === 'icono05' ? 'primary.main' : blueGrey[300],flexGrow:1
                        }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/correntista`);
                                  handleClick('icono05');
                                                }
                                }
                    >
                      <Typography variant="subtitle2" sx={{ ml: 1 }}>
                      02
                      </Typography>                    
                      <PaidIcon />
                    </IconButton>
                    </Tooltip>
                    ):(
                      <span></span>
                    )
                    }

                    { permisoZonasVenta ?
                    (
                    <Tooltip title="PANEL 03 RUC HABITUALES">
                    <IconButton  
                        sx={{
                          color: selectedButton === 'icono06' ? 'primary.main' : blueGrey[300],flexGrow:1
                        }}
                        color="primary" aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/zona`);
                                  handleClick('icono06');
                                                }
                                }
                    >
                      <Typography variant="subtitle2" sx={{ ml: 1 }}>
                      03
                      </Typography>                    
                      <GroupIcon />
                    </IconButton>
                    </Tooltip>
                    ):(
                      <span></span>
                    )
                    }

                    { /*permisoZonasEntrega ?
                    (
                    <Tooltip title="Panel 04 PLAN CONTABLE">
                    <IconButton  
                        sx={{
                          color: selectedButton === 'icono07' ? 'primary.main' : blueGrey[300],flexGrow:1
                        }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/zonadet`);
                                  handleClick('icono07');
                                                }
                                }
                    >
                      <Typography variant="subtitle2" sx={{ ml: 1 }}>
                      04
                      </Typography>                    
                      <ViewTimelineIcon />
                    </IconButton>
                    </Tooltip>
                    ):(
                      <span></span>
                    )
                    */}

                    { permisoProductos ?
                    (
                    <Tooltip title="Panel 04 CENTRO COSTOS">
                    <IconButton  
                        sx={{
                          color: selectedButton === 'icono08' ? 'primary.main' : blueGrey[300],flexGrow:1
                        }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/producto`);
                                  handleClick('icono08');
                                                }
                                }
                    >
                      <Typography variant="subtitle2" sx={{ ml: 1 }}>
                      04
                      </Typography>                    
                      <CenterFocusStrongIcon />
                    </IconButton>
                    </Tooltip>
                    ):(
                      <span></span>
                    )
                    }

                    { permisoSeguridad ?
                    (
                    <Tooltip title="Panel 05 SEGURIDAD USUARIOS">
                    <IconButton  
                        sx={{
                          color: selectedButton === 'icono09' ? 'primary.main' : blueGrey[300],flexGrow:1
                        }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/seguridad`);
                                  handleClick('icono09');
                                                }
                                }
                    >
                      <Typography variant="subtitle2" sx={{ ml: 1 }}>
                      05
                      </Typography>                    
                      <SystemSecurityUpdateGoodIcon />
                    </IconButton>
                    </Tooltip>
                    ):(
                      <span></span>
                    )
                    }


            </Toolbar>
        </Container>
    </Box>
  );
}
