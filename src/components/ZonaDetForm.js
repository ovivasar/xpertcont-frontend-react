import {Grid,Card,CardContent,Typography,TextField,Button,CircularProgress} from '@mui/material'
//import { padding } from '@mui/system'
import {useState,useEffect,useRef} from 'react';
import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

export default function ZonaDetForm() {
    
  //Orden directa
  //const back_host = process.env.BACK_HOST || "http://localhost:4000";
  const back_host = process.env.BACK_HOST || "https://alsa-backend-js-production.up.railway.app";  
  
  const [zonadet,setZonaDet] = useState({
      id_zonadet:'',
      nombre:'',
      descripcion:'',
      siglas:''
  })
  //Seccion keyDown Formulario
  const firstTextFieldRef = useRef(null);
  const secondTextFieldRef = useRef(null);
  const terceroTextFieldRef = useRef(null);
  const cuartoTextFieldRef = useRef(null);
  const handleKeyDown = (event, nextRef) => {
    if (event.key === "Enter") {
      nextRef.current.focus();
    }
  };
  /////////////////////////////////////////////////////////

  const [cargando,setCargando] = useState(false);
  const [editando,setEditando] = useState(false);
  
  const navigate = useNavigate();
  const params = useParams();

  const handleSubmit = async(e) => {
    e.preventDefault();
    setCargando(true);
    
    //Cambiooo para controlar Edicion
    if (editando){
      console.log(`${back_host}/zonadet/${params.id}`);
      console.log(zonadet);
      await fetch(`${back_host}/zonadet/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(zonadet),
        headers: {"Content-Type":"application/json"}
      });
    }else{
      console.log(`${back_host}/zonadet`);
      console.log(zonadet);
      await fetch(`${back_host}/zonadet`, {
        method: "POST",
        body: JSON.stringify(zonadet),
        headers: {"Content-Type":"application/json"}
      });
    }

    setCargando(false);
    navigate(`/zonadet`);
  };
  
  //Aqui se leen parametros en caso lleguen
  useEffect( ()=> {
    if (params.id){
      mostrarZonaDet(params.id);
    }
  },[params.id]);

  //Rico evento change
  const handleChange = e => {
    setZonaDet({...zonadet, [e.target.name]: e.target.value});
    //console.log(e.target.name, e.target.value);
  }

  //funcion para mostrar data de formulario, modo edicion
  const mostrarZonaDet = async (id) => {
    console.log(`${back_host}/zonadet/${id}`);
    const res = await fetch(`${back_host}/zonadet/${id}`);
    const data = await res.json();
    //Actualiza datos para enlace con controles, al momento de modo editar
    setZonaDet({
              id_zonadet:data.id_zonadet, 
              nombre:data.nombre, 
              descripcion:data.descripcion, 
              siglas:data.siglas});
    //console.log(data);
    //console.log(data.siglas);
    setEditando(true);
  };

  return (
    <Grid container
          direction="column"
          alignItems="center"
          justifyContent="center">
        <Grid item xs={3}>
            <Card sx={{mt:5}}
                  style={{
                    background:'#1e272e',
                    padding:'1rem'
                  }}
                  >
                <Typography variant='5' color='white' textAlign='center'>
                    {editando ? "EDITAR ZONA ENTREGA" : "CREAR ZONA ENTREGA"}
                </Typography>
                <CardContent>
                    <form onSubmit={handleSubmit} >

                    <Tooltip title="SOLO SE PERMITE CODIGO NUMERICO">
                        <TextField variant="outlined" 
                                  label="CODIGO"
                                  autoFocus 
                                  fullWidth
                                  sx={{display:'block',
                                        margin:'.5rem 0'}}
                                  name="id_zonadet"
                                  value={zonadet.id_zonadet}
                                  onChange={handleChange}
                                  onKeyDown={(event) => handleKeyDown(event, secondTextFieldRef)}
                                  onKeyPress={(event) => {
                                      const numericRegex = /^[0-9]*$/
                                      if (!numericRegex.test(event.key)) {
                                          event.preventDefault();
                                      }
                                  }}
                                  inputRef={firstTextFieldRef}                                   
                                  inputProps={{ inputMode: 'numeric',
                                                style:{color:'white'} }}
                                  InputLabelProps={{ style:{color:'white'} }}
                        />
                        </Tooltip>

                        <TextField variant="outlined" 
                                   label="NOMBRE"
                                   fullWidth
                                   sx={{display:'block',
                                        margin:'.5rem 0'}}
                                   name="nombre"
                                   value={zonadet.nombre}
                                   onChange={handleChange}
                                   onKeyDown={(event) => handleKeyDown(event, terceroTextFieldRef)}
                                   inputRef={secondTextFieldRef}                                   
                                   inputProps={{ style:{color:'white', textTransform: 'uppercase'} }}
                                   InputLabelProps={{ style:{color:'white'} }}
                        />
                        <TextField variant="outlined" 
                                   label="DESCRIPCION"
                                   fullWidth
                                   rows={2}
                                   sx={{display:'block',
                                        margin:'.5rem 0'}}
                                   name="descripcion"
                                   value={zonadet.descripcion}
                                   onChange={handleChange}
                                   onKeyDown={(event) => handleKeyDown(event, cuartoTextFieldRef)}
                                   inputRef={terceroTextFieldRef}                                   

                                   inputProps={{ style:{color:'white', textTransform: 'uppercase'} }}
                                   InputLabelProps={{ style:{color:'white'} }}
                         />
                        <TextField variant="outlined" 
                                   label="SIGLAS"
                                   //multiline
                                   fullWidth
                                   sx={{display:'block',
                                        margin:'.5rem 0'}}
                                   name="siglas"
                                   value={zonadet.siglas}
                                   onChange={handleChange}
                                   inputRef={cuartoTextFieldRef}                                   
                                   inputProps={{ style:{color:'white', textTransform: 'uppercase'} }}
                                   InputLabelProps={{ style:{color:'white'} }}
                         />

                        <Button variant='contained' 
                                color='primary' 
                                type='submit'
                                disabled={!zonadet.nombre || 
                                          !zonadet.descripcion || 
                                          !zonadet.siglas}
                                >
                                { cargando ? (
                                <CircularProgress color="inherit" size={24} />
                                ) : (
                                  editando ?
                                'Modificar' : 'Grabar')
                                }
                        </Button>

                        <Button variant='contained' 
                                    color='success' 
                                    //sx={{mt:1}}
                                    onClick={ ()=>{
                                      navigate(-1, { replace: true });
                                      //window.location.reload();
                                      }
                                    }
                                    >
                              ANTERIOR
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
  )
}
