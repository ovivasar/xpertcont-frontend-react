import {Grid,Card,CardContent,TextField,Button,CircularProgress,Select, MenuItem, InputLabel, Box, FormControl} from '@mui/material'
import { useState,useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import FindIcon from '@mui/icons-material/FindInPage';
import IconButton from '@mui/material/IconButton';
import React from 'react';

export default function OCargaFormDetEstiba() {
  //const back_host = process.env.BACK_HOST || "http://localhost:4000";
  const back_host = process.env.BACK_HOST || "https://alsa-backend-js-production.up.railway.app";  
  //experimento
  const [updateTrigger, setUpdateTrigger] = useState({});
  //const [razonSocialBusca, setRazonSocialBusca] = useState("");
  const [razonSocialBusca, setRazonSocialBusca] = useState("");
    //funcion para mostrar data de formulario, modo edicion
  const mostrarRazonSocialBusca = async (documento_id) => {
      const res = await fetch(`https://apiperu.dev/api/ruc/${documento_id}`, {
        method: "GET",
        headers: {"Content-Type":"application/json",
                  "Authorization": "Bearer " + "f03875f81da6f2c2f2e29f48fdf798f15b7a2811893ad61a1e97934a665acc8b"
                  }
      });

      const datosjson = await res.json();
      //console.log(datosjson);
      //console.log(datosjson.data.nombre_o_razon_social);
      setRazonSocialBusca(datosjson.data.nombre_o_razon_social);
      ventaDet.ref_razon_social = datosjson.data.nombre_o_razon_social;
  };
  
  /*let txtRazonSocialRef = useRef();
  function razonSocialFocus(){
    const input =  txtRazonSocialRef.current;
    input.focus();
  }*/
  ////////////////////////////////////////////////////////////////////////////////////////

  //Select(Combos) para llenar, desde tabla
  const [zonaentrega_select,setZonaEntregaSelect] = useState([]);
  const [producto_select,setProductoSelect] = useState([]);

  const [cargando,setCargando] = useState(false);
  const [editando,setEditando] = useState(false);
  
  const navigate = useNavigate();
  const params = useParams();

  //const fecha_actual = new Date();

  //Para guardado de datos antes de envio 
  //Falta aumentar la fecha desde el parametro
  const [ventaDet,setVentaDet] = useState({
      id_empresa:'1',  
      id_punto_venta:'1001',  
      comprobante_original_codigo:params.cod,
      comprobante_original_serie:params.serie,
      comprobante_original_numero:params.num,
      comprobante_original_fecemi:params.fecha,
      elemento:params.elem,
      item:params.item,
      ref_documento_id:'',  
      ref_razon_social:'',  
      id_zona_entrega:'',
      zona_entrega:'',
      id_lote:'',
      descripcion:'',
      precio_unitario:'',
      porc_igv:'',
      cantidad:'',
      peso_neto:'0',
      ref_observacion:'-',
      registrado:'1'
  })

  const handleSubmit = async(e) => {
    e.preventDefault();
    setCargando(true);
    
    //Cambiooo para controlar Edicion
    if (editando){
      await fetch(`${back_host}/ventadet/${params.cod}/${params.serie}/${params.num}/${params.elem}/${params.item}`, {
        method: "PUT",
        body: JSON.stringify(ventaDet),
        headers: {"Content-Type":"application/json"}
      });
    }else{
      console.log(ventaDet);
      await fetch(`${back_host}/ventadet`, {
        method: "POST",
        body: JSON.stringify(ventaDet),
        headers: {"Content-Type":"application/json"}
      });
    }

    setCargando(false);
    
    setEditando(true);
    setUpdateTrigger(Math.random());//experimento
    navigate(`/venta/${params.cod}/${params.serie}/${params.num}/${params.elem}/edit`);
    
    //console.log(zona);
  };
  
  //Aqui se leen parametros en caso lleguen
  useEffect( ()=> {
    if (params.cod){
      mostrarVenta(params.cod,params.serie,params.num,params.elem,params.item);
    }  
    
    cargaZonaEntregaCombo();
    cargaProductoCombo();
    //console.log(fecha_actual);
  },[params.cod, updateTrigger]);

  const cargaZonaEntregaCombo = () =>{
    axios
    .get(`${back_host}/zonadet`)
    .then((response) => {
        setZonaEntregaSelect(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
  }
  const cargaProductoCombo = () =>{
    axios
    .get(`${back_host}/producto`)
    .then((response) => {
        setProductoSelect(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
  }

  //Rico evento change
  const handleChange = e => {
    var index;
    var sTexto;
    if (e.target.name === "id_zona_entrega") {
      const arrayCopia = zonaentrega_select.slice();
      index = arrayCopia.map(elemento => elemento.id_zonadet).indexOf(e.target.value);
      sTexto = arrayCopia[index].nombre;
      setVentaDet({...ventaDet, [e.target.name]: e.target.value, zona_entrega:sTexto});
      return;
    }
    if (e.target.name === "id_lote") {
      const arrayCopia = producto_select.slice();
      index = arrayCopia.map(elemento => elemento.id_lote).indexOf(e.target.value);
      sTexto = arrayCopia[index].nombre;
      setVentaDet({...ventaDet, [e.target.name]: e.target.value, descripcion:sTexto});
      return;
    }
    //Para todos los demas casos ;)
    setVentaDet({...ventaDet, [e.target.name]: e.target.value});
  }

  //funcion para mostrar data de formulario, modo edicion
  const mostrarVenta = async (cod,serie,num,elem,item) => {
    const res = await fetch(`${back_host}/ventadet/${cod}/${serie}/${num}/${elem}/${item}`);
    const data = await res.json();
    //Actualiza datos para enlace con controles, al momento de modo editar
    setVentaDet({  
                ref_documento_id:data.ref_documento_id,  
                ref_razon_social:data.ref_razon_social,  
                id_zona_entrega:data.id_zona_entrega,
                zona_entrega:data.zona_entrega,
                id_lote:data.id_lote,
                descripcion:data.descripcion,
                precio_unitario:data.precio_unitario,
                porc_igv:data.porc_igv,
                cantidad:data.cantidad,
                peso_neto:data.peso_neto,
                ref_observacion:data.ref_observacion,
                registrado:data.registrado
              });
    //console.log(data);
    setEditando(true);
  };
  
  return (
    <> 

    <Grid container spacing={2}
          alignItems="center"
          justifyContent="center"    
    >
        
        {/* Seccion Agregado de Detalles */}

        <Grid item xs={3}>
            
            <Card sx={{mt:2}}
                  style={{
                    background:'#1e272e',
                    padding:'1rem'
                  }}
                  //hidden={!editando}
                  >
                
                <CardContent >
                    <form onSubmit={handleSubmit} >

                    <Grid container spacing={0.5}>
                        <Grid item xs={9}>
                            <TextField variant="outlined" 
                                      label="RUC Facturacion"
                                      //sx={{display:'block',
                                      //      margin:'.5rem 0'}}
                                      sx={{mt:-1}}
                                      name="ref_documento_id"
                                      value={ventaDet.ref_documento_id}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',width: 140} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton color="warning" aria-label="upload picture" component="label" size="small"
                              //sx={{display:'block',
                              //margin:'1rem 0'}}
                              sx={{mt:-1}}
                              onClick = { () => {
                                  //console.log("ahora me toca nene");
                                  ventaDet.ref_razon_social = "";
                                  mostrarRazonSocialBusca(ventaDet.ref_documento_id);
                                  //setRazonSocialBusca("EMPRESA SAC "+ventaDet.ref_documento_id);
                                  //ventaDet.ref_razon_social = "EMPRESA SAC "+ventaDet.ref_documento_id;
                                }
                              }
                            >
                              <FindIcon />
                            </IconButton>
                        </Grid>

                    </Grid>

                            <TextField variant="outlined" 
                                      label="RAZON SOCIAL Fact."
                                      sx={{display:'block',
                                            margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="ref_razon_social"
                                      //ref={txtRazonSocialRef} //para el rico foco solo con input funciona
                                      value={ventaDet.ref_razon_social || razonSocialBusca}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />
                        
                            <Box sx={{ minWidth: 120 }}
                                 // sx={{mt:-3}}
                            >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label" 
                                                  inputProps={{ style:{color:'white'} }}
                                                  InputLabelProps={{ style:{color:'white'} }}
                                      >Lugar Llegada</InputLabel>
                                      <Select
                                        labelId="zona_entrega"
                                        id={ventaDet.id_zona_entrega}
                                        value={ventaDet.id_zona_entrega}
                                        name="id_zona_entrega"
                                        sx={{display:'block',
                                        margin:'.5rem 0'}}
                                        label="Zona Entrega"
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                      >
                                        {   
                                            zonaentrega_select.map(elemento => (
                                            <MenuItem key={elemento.id_zonadet} 
                                                      value={elemento.id_zonadet}>
                                              {elemento.nombre}
                                            </MenuItem>)) 
                                        }
                                      </Select>
                                    </FormControl>
                            </Box>

                            <Box sx={{ minWidth: 120 }}
                                   //sx={{mt:-3}}
                            >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label" 
                                                  inputProps={{ style:{color:'white'} }}
                                                  InputLabelProps={{ style:{color:'white'} }}
                                      >Producto/Lote</InputLabel>
                                      <Select
                                        labelId="producto"
                                        id={ventaDet.id_lote}
                                        value={ventaDet.id_lote}
                                        name="id_lote"
                                        sx={{display:'block',
                                        margin:'.5rem 0'}}
                                        label="Producto Lote"
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                      >
                                        {   
                                            producto_select.map(elemento => (
                                            <MenuItem   key={elemento.id_lote} 
                                                        value={elemento.id_lote}>
                                              {elemento.nombre}
                                            </MenuItem>)) 
                                        }
                                      </Select>
                                    </FormControl>
                            </Box>

                            <TextField variant="filled" 
                                      label="P.UNIT $"
                                      sx={{display:'block',
                                            margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="precio_unitario"
                                      value={ventaDet.precio_unitario}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'}
                                    }}
                            />

                            <TextField variant="filled" 
                                      label="% IGV"
                                      sx={{display:'block',
                                            margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="porc_igv"
                                      value={ventaDet.porc_igv}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />

                            <TextField variant="filled" 
                                      label="TN."
                                      sx={{display:'block',
                                            margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="cantidad"
                                      value={ventaDet.cantidad}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />
                            <TextField variant="filled" 
                                      label="Observaciones"
                                      sx={{display:'block',
                                            margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="ref_observacion"
                                      value={ventaDet.ref_observacion}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />

                            <Button variant='contained' 
                                    color='primary' 
                                    sx={{mt:0}}
                                    type='submit'
                                    disabled={!ventaDet.cantidad || 
                                              !ventaDet.porc_igv ||
                                              !ventaDet.precio_unitario ||
                                              !ventaDet.ref_documento_id ||
                                              !ventaDet.ref_razon_social ||
                                              !ventaDet.id_lote 
                                              }
                                    >
                                    { cargando ? (
                                    <CircularProgress color="inherit" size={24} />
                                    ) : ('AGREGAR')
                                    }
                            </Button>
                    

                    </form>
                </CardContent>
            </Card>
            
        </Grid>
        

       
        {/* Seccion Agregado de Detalles */}

        <Grid item xs={3}>
            
            <Card sx={{mt:2}}
                  style={{
                    background:'#1e272e',
                    padding:'1rem'
                  }}
                  //hidden={!editando}
                  >
                
                <CardContent >
                    <form onSubmit={handleSubmit} >

                    <Grid container spacing={0.5}>
                        <Grid item xs={9}>
                            <TextField variant="outlined" 
                                      label="RUC Facturacion"
                                      //sx={{display:'block',
                                      //      margin:'.5rem 0'}}
                                      sx={{mt:-1}}
                                      name="ref_documento_id"
                                      value={ventaDet.ref_documento_id}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',width: 140} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton color="warning" aria-label="upload picture" component="label" size="small"
                              //sx={{display:'block',
                              //margin:'1rem 0'}}
                              sx={{mt:-1}}
                              onClick = { () => {
                                  //console.log("ahora me toca nene");
                                  ventaDet.ref_razon_social = "";
                                  mostrarRazonSocialBusca(ventaDet.ref_documento_id);
                                  //setRazonSocialBusca("EMPRESA SAC "+ventaDet.ref_documento_id);
                                  //ventaDet.ref_razon_social = "EMPRESA SAC "+ventaDet.ref_documento_id;
                                }
                              }
                            >
                              <FindIcon />
                            </IconButton>
                        </Grid>

                    </Grid>

                            <TextField variant="outlined" 
                                      label="RAZON SOCIAL Fact."
                                      sx={{display:'block',
                                            margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="ref_razon_social"
                                      //ref={txtRazonSocialRef} //para el rico foco solo con input funciona
                                      value={ventaDet.ref_razon_social || razonSocialBusca}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />
                        
                            <Box sx={{ minWidth: 120 }}
                                 // sx={{mt:-3}}
                            >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label" 
                                                  inputProps={{ style:{color:'white'} }}
                                                  InputLabelProps={{ style:{color:'white'} }}
                                      >Lugar Llegada</InputLabel>
                                      <Select
                                        labelId="zona_entrega"
                                        id={ventaDet.id_zona_entrega}
                                        value={ventaDet.id_zona_entrega}
                                        name="id_zona_entrega"
                                        sx={{display:'block',
                                        margin:'.5rem 0'}}
                                        label="Zona Entrega"
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                      >
                                        {   
                                            zonaentrega_select.map(elemento => (
                                            <MenuItem key={elemento.id_zonadet} 
                                                      value={elemento.id_zonadet}>
                                              {elemento.nombre}
                                            </MenuItem>)) 
                                        }
                                      </Select>
                                    </FormControl>
                            </Box>

                            <Box sx={{ minWidth: 120 }}
                                   //sx={{mt:-3}}
                            >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label" 
                                                  inputProps={{ style:{color:'white'} }}
                                                  InputLabelProps={{ style:{color:'white'} }}
                                      >Producto/Lote</InputLabel>
                                      <Select
                                        labelId="producto"
                                        id={ventaDet.id_lote}
                                        value={ventaDet.id_lote}
                                        name="id_lote"
                                        sx={{display:'block',
                                        margin:'.5rem 0'}}
                                        label="Producto Lote"
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                      >
                                        {   
                                            producto_select.map(elemento => (
                                            <MenuItem   key={elemento.id_lote} 
                                                        value={elemento.id_lote}>
                                              {elemento.nombre}
                                            </MenuItem>)) 
                                        }
                                      </Select>
                                    </FormControl>
                            </Box>

                            <TextField variant="filled" 
                                      label="P.UNIT $"
                                      sx={{display:'block',
                                            margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="precio_unitario"
                                      value={ventaDet.precio_unitario}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'}
                                    }}
                            />

                            <TextField variant="filled" 
                                      label="% IGV"
                                      sx={{display:'block',
                                            margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="porc_igv"
                                      value={ventaDet.porc_igv}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />

                            <TextField variant="filled" 
                                      label="TN."
                                      sx={{display:'block',
                                            margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="cantidad"
                                      value={ventaDet.cantidad}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />
                            <TextField variant="filled" 
                                      label="Observaciones"
                                      sx={{display:'block',
                                            margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="ref_observacion"
                                      value={ventaDet.ref_observacion}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />

                            <Button variant='contained' 
                                    color='primary' 
                                    sx={{mt:0}}
                                    type='submit'
                                    disabled={!ventaDet.cantidad || 
                                              !ventaDet.porc_igv ||
                                              !ventaDet.precio_unitario ||
                                              !ventaDet.ref_documento_id ||
                                              !ventaDet.ref_razon_social ||
                                              !ventaDet.id_lote 
                                              }
                                    >
                                    { cargando ? (
                                    <CircularProgress color="inherit" size={24} />
                                    ) : ('AGREGAR')
                                    }
                            </Button>
                    

                    </form>
                </CardContent>
            </Card>
            
        </Grid>
        

    </Grid>

    </>    
  )
}
