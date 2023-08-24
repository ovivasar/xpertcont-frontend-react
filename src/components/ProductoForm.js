import {Grid,Card,CardContent,Typography,TextField,Button,CircularProgress,Select, MenuItem, InputLabel, Box, FormControl} from '@mui/material'
//import { padding } from '@mui/system'
import {useState,useEffect} from 'react';
import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';

export default function ProductoForm() {
  //const back_host = process.env.BACK_HOST || "http://localhost:4000";
  const back_host = process.env.BACK_HOST || "https://alsa-backend-js-production.up.railway.app";  
  //Select(Combos) para llenar, desde tabla
  const [vendedor_select,setVendedorSelect] = useState([]);
  const [zona_select,setZonaSelect] = useState([]);
  
  const unidad_select=[
    {id_unidad_medida:"TNE",nombre:"TONELADAS"},
    {id_unidad_medida:"BG",nombre:"BOLSAS"}
  ];
  
  //Estado para variables del formulario
  const [producto,setProducto] = useState({
      id_producto:'',
      nombre:'',
      id_unidad_medida:''
  })

  const [cargando,setCargando] = useState(false);
  const [editando,setEditando] = useState(false);
  
  const navigate = useNavigate();
  const params = useParams();

  const handleSubmit = async(e) => {
    e.preventDefault();
    setCargando(true);
    
    //Cambiooo para controlar Edicion
    if (editando){
      console.log(`${back_host}/producto/${params.id}`);
      console.log(producto);
      await fetch(`${back_host}/producto/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(producto),
        headers: {"Content-Type":"application/json"}
      });
    }else{
      console.log(`${back_host}/producto`);
      console.log(producto);
      await fetch(`${back_host}/producto`, {
        method: "POST",
        body: JSON.stringify(producto),
        headers: {"Content-Type":"application/json"}
      });
    }

    setCargando(false);
    navigate(`/producto`);
  };
  
  //Aqui se leen parametros en caso lleguen
  useEffect( ()=> {
    if (params.id){
      mostrarProducto(params.id);
    }
    //////////////////////////////////////////
    //////////////////////////////////////////
    //////////////////////////////////////////

  },[params.id]);

  //Rico evento change
  const handleChange = e => {
    setProducto({...producto, [e.target.name]: devuelveValor(e)});
    //console.log(e.target.name, e.target.value);
  }
  
  const devuelveValor = e =>{
      let strNombre;
      strNombre = e.target.name;
      strNombre = strNombre.substring(0,3);
      console.log(e.target.name);  
      if (strNombre === "chk"){
        console.log(e.target.checked);  
        return(e.target.checked);
      }else{
        console.log(e.target.value);
        return(e.target.value);
      }
  }

  //funcion para mostrar data de formulario, modo edicion
  const mostrarProducto = async (id) => {
    console.log(`${back_host}/producto/${id}`);
    const res = await fetch(`${back_host}/producto/${id}`);
    const data = await res.json();
    //Actualiza datos para enlace con controles, al momento de modo editar
    setProducto({
                    id_producto:data.id_producto, 
                    nombre:data.nombre, 
                    id_unidad_medida:data.id_unidad_medida
                  });
    //console.log(data.relacionado);
    setEditando(true);
  };

  return (
    <Grid container
          direction="column"
          alignItems="center"
          justifyContent="center"
    >
        <Grid item xs={12} >
            <Card //sx={{mt:1}}
                  sx={{ minWidth: 275 }}            
                  style={{
                    background:'#1e272e',
                    padding:'.1rem'
                  }}
                  >
                <Typography variant='subtitle2' color='white' textAlign='center'>
                    {editando ? "EDITAR PRODUCTO" : "CREAR PRODUCTO"}
                </Typography>
                <CardContent >
                    <form onSubmit={handleSubmit} autoComplete="off">
                          
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label" 
                                            inputProps={{ style:{color:'white'} }}
                                            InputLabelProps={{ style:{color:'white'} }}
                                            sx={{mt:1, color:'#5DADE2'}}
                                >Unidad Medida</InputLabel>
                                <Select
                                labelId="unidad_select"
                                autoFocus
                                //size='small'
                                id={producto.id_unidad_medida}
                                value={producto.id_unidad_medida}
                                name="id_unidad_medida"
                                sx={{display:'block',
                                margin:'.5rem 0', color:"white"}}
                                label="Unidad Medida"
                                onChange={handleChange}
                                inputProps={{ style:{color:'white'} }}
                                InputLabelProps={{ style:{color:'white'} }}
                                >
                                {   
                                    unidad_select.map(elemento => (
                                    <MenuItem key={elemento.id_unidad_medida} value={elemento.id_unidad_medida}>
                                        {elemento.nombre}
                                    </MenuItem>)) 
                                }
                                </Select>
                            </FormControl>
                        </Box>
                          
                        <TextField variant="outlined" 
                                label="Codigo"
                                fullWidth
                                size='small'
                                //multiline
                                sx={{display:'block',margin:'.5rem 0'}}
                                name="id_producto"
                                value={producto.id_producto}
                                onChange={handleChange}
                                inputProps={{ style:{color:'white', textTransform: 'uppercase'} }}
                                InputLabelProps={{ style:{color:'white'} }}
                        />
                          
                        <TextField variant="outlined" 
                                   label="Nombre"
                                   fullWidth
                                   size='small'
                                   //multiline
                                   sx={{display:'block',
                                        margin:'.5rem 1'}}
                                   name="nombre"
                                   value={producto.nombre}
                                   onChange={handleChange}
                                   inputProps={{ style:{color:'white', textTransform: 'uppercase'} }}
                                   InputLabelProps={{ style:{color:'white'} }}
                        />

                        <Button variant='contained' 
                                color='primary' 
                                type='submit'
                                disabled={!producto.id_producto || 
                                          !producto.nombre}
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
