import {Grid,Card,CardContent,TextField,Button,CircularProgress, Typography,Select, MenuItem, InputLabel, Box, FormControl} from '@mui/material'
import {useState,useEffect,useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import React from 'react';
import axios from 'axios';

export default function OCargaFormTraslado() {
  //const back_host = process.env.BACK_HOST || "http://localhost:4000";
  const back_host = process.env.BACK_HOST || "https://alsa-backend-js-production.up.railway.app";  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [producto_select,setProductoSelect] = useState([]);

  const descTextFieldRef = useRef(null);

  //Seccion keyDown Formulario
  const primeroTextFieldRef = useRef(null);
  const segundoTextFieldRef = useRef(null);
  const terceroTextFieldRef = useRef(null);
  const cuartoTextFieldRef = useRef(null);
  const handleKeyDown = (event, afterRef, nextRef) => {
    if (event.key === "Enter" || event.key === "ArrowDown") {
      console.log(nextRef.name);
      console.log(nextRef.current);
      nextRef.current.focus();
    }
    if (event.key === "ArrowUp") {
      console.log("subiendo");
      console.log(afterRef.name);
      console.log(afterRef.current);
      afterRef.current.focus();
    }
  };
  /////////////////////////////////////////////////////////

  //experimento
  const [updateTrigger, setUpdateTrigger] = useState({});
  ////////////////////////////////////////////////////////////////////////////////////////
  const [cargando,setCargando] = useState(false);
  const [editando,setEditando] = useState(false);
  
  const [kgSaco, setkgSaco] = useState('50');

  const [sacosDescarguio, setSacosDescarguio] = useState('');
  const [tnDescarguio, setTnDescarguio] = useState('');

  const navigate = useNavigate();
  const params = useParams();

  //Para guardado de datos antes de envio 
  //Falta aumentar la fecha desde el parametro
  const [ocargaDet,setocargaDet] = useState({
      id_empresa:'1',  
      id_punto_venta:'1001',  
      fecha2:'',
      
      ano:'',
      numero:'',
      item:'',
      
      pedido:'',  //ventas: ref_cod, ref_serie, ref_numero, item
      id_producto:'',   //ventas
      descripcion:'',   //ventas
      unidad_medida:'',   //ventas
      ref_razon_social:'',   //ventas
      cantidad:'',      //ventas
      operacion:'DESCARGUIO',     //ocarga-fase01
      e_observacion:'', //new 

      ticket_tras:'',       //new por la puras
      peso_ticket_tras:'',  //new por la puras
      sacos_ticket_tras:'', //new por la puras

      registrado:'1'
  })

  const handleSubmit = async(e) => {
    e.preventDefault();
    setCargando(true);
    //datos para insertar adicional DESCARGUIO
    ocargaDet.id_empresa = '1';
    ocargaDet.id_punto_venta = '1001';
    ocargaDet.ref_razon_social = '-'; //para evitar null en filtro
    ocargaDet.operacion = 'DESCARGUIO';
    //ocargaDet.descripcion = '-'; //para evitar null en filtro
    ocargaDet.fecha2 = params.fecha_proceso;
    ocargaDet.unidad_medida = 'TNE'; //(Por Default)
    ocargaDet.sacos_real = sacosDescarguio; //(Form digitado)
    ocargaDet.cantidad = tnDescarguio; //(Form TN.aprox/BLS calculado)
    
    ocargaDet.peso_ticket = tnDescarguio; //(Form TN.aprox/BLS calculado)
    ocargaDet.sacos_ticket = sacosDescarguio; //(Form TN.aprox/BLS calculado)
    
    ocargaDet.registrado = '1'; //(Por Default)
    ocargaDet.tipo = 'E'; //(Por Default)

    //Cambiooo para controlar Edicion
    if (editando){
        //console.log("actualizando");
        //console.log(ocargaDet);
        console.log("modo edicion");
        await fetch(`${back_host}/ocargatickettraslado/${params.ano}/${params.numero}/${params.item}`, {
          method: "PUT",
          body: JSON.stringify(ocargaDet),
          //headers: {'Access-Control-Allow-Origin': '*','Content-Type':'application/json'}
          headers: {'Content-Type':'application/json'}
        });
    }else{
        console.log(ocargaDet);
        console.log(`${back_host}/ocargadetdescarguio`);
        console.log("agregando nuevo");
        await fetch(`${back_host}/ocargadetdescarguio`, {
            method: "POST",
            body: JSON.stringify(ocargaDet),
            headers: {"Content-Type":"application/json"}
        });
    }

    setCargando(false);
    
    setEditando(true);
    setUpdateTrigger(Math.random());//experimento
    //navigate(`/ocargadet/${params.fecha_proceso}`);
    window.history.back();
    
    //console.log(zona);
  };
  
  //Aqui se leen parametros en caso lleguen
  useEffect( ()=> {
    //Si tiene parametros, es editar (o clonar)
    //if (params.modo){
      cargaProductoCombo();
      //mostrarOCarga(params.ano,params.numero,params.item);
      //Luego se establece editando = true
    //}  
    
    //console.log(fecha_actual);
  },[params.ano, updateTrigger]);
  
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

  const handleSacosDescarguioChange = (event) => {
    var tn_aprox;
    setSacosDescarguio(event.target.value); //almacena valor (SacosDescarguio) para uso posterior
    if (kgSaco==='1'){
      tn_aprox = event.target.value; //pasa como BLS
    }else {
      tn_aprox = (event.target.value * kgSaco/1000).toFixed(2); //convertido a TN          
    }

    setTnDescarguio(tn_aprox); //actualizamos en var local
    
    
    setocargaDet({...ocargaDet, sacos_real: event.target.value});//actualizamos en objeto para insert/update
    setocargaDet({...ocargaDet, cantidad: tn_aprox});//actualizamos en objeto para insert/update
  };

  const handleKgSacoChange = (event) => {
    setkgSaco(event.target.value); //almacena valor (kgSaco) para uso posterior

    const tn_aprox = (event.target.value * sacosDescarguio/1000).toFixed(2); //convertido a TN          
    setocargaDet({...ocargaDet, peso_ticket_tras: tn_aprox});
    //setocargaDet({...ocargaDet, cantidad: cant_nueva});
  };

  const handleTnDescarguioChange = (event) => {
    setTnDescarguio(event.target.value); //almacena valor (SacosDescarguio) para uso posterior

    const tn_aprox_total = (event.target.value + tnDescarguio).toFixed(2); //convertido a TN          
    setocargaDet({...ocargaDet, peso_ticket_tras: tn_aprox_total});
    //setocargaDet({...ocargaDet, cantidad: cant_nueva});
  };

  //Rico evento change
  const handleChange = e => {
    var index;
    var sTexto;
    if (e.target.name === "id_producto") {
      const arrayCopia = producto_select.slice();
      index = arrayCopia.map(elemento => elemento.id_producto).indexOf(e.target.value);
      sTexto = arrayCopia[index].nombre;
      setocargaDet({...ocargaDet, [e.target.name]: e.target.value, descripcion:sTexto});
      return;
    }

    //Para todos los demas casos ;)
    setocargaDet({...ocargaDet, [e.target.name]: e.target.value.toUpperCase()});
    //ocargaDet.cantidad = ocargaDet.peso_ticket_tras - ocargaDet.cantidad;
  }

  //funcion para mostrar data de formulario, modo edicion
  const mostrarOCarga = async (ano,numero,item) => {
    const res = await fetch(`${back_host}/ocargadet/${ano}/${numero}/${item}`);
    const data = await res.json();
    //Actualiza datos para enlace con controles, al momento de modo editar
    setocargaDet({  
                ano:params.ano,
                numero:params.numero,
                item:params.item,
                });

    setocargaDet({                  

                id_empresa:data.id_empresa,
                id_punto_venta:data.id_punto_venta,
                numero:data.numero,
                fecha2:data.fecha2,

                id_producto:data.id_producto,
                descripcion:data.descripcion,
                cantidad:data.cantidad,  //restar de la variable formulario, al momento de insertar
                unidad_medida:data.unidad_medida, //new

                operacion:'DESCARGUIO',   //datos adicionales
                ticket_tras:data.ticket_tras, //datos adicionales
                peso_ticket_tras:data.peso_ticket_tras, //datos adicionales
                sacos_ticket_tras:data.sacos_ticket_tras, //datos adicionales
                tr_placacargado:data.tr_placacargado, //datos adicionales

                registrado:data.registrado

                });
    //Guardamos cantidad y sacos_real del transbordo, para acumular TN y actualizar datos

    setEditando(true);
  };


  return (
    <> 
<div class="p-3 mb-2 bg-dark text-white">

<Grid container spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
    >

  <Grid item xs={10}>

            <Card sx={{mt:2}}
                  style={{
                    background:'#1e272e',
                    padding:'1rem'
                  }}
                  //hidden={!editando}
                  >
                
                <CardContent >
                    <form onSubmit={handleSubmit} autoComplete="off">

                            <Grid container spacing={0.5}
                                      direction="column"
                                      //alignItems="center"
                                      justifyContent="center"
                            >
                                <Typography marginTop="0.5rem" 
                                style={{color:'#F39C12'}}
                                variant="h5"
                                align="center"
                                >
                                DESCARGUIO
                                </Typography>

                                <Box sx={{ minWidth: 120, mt:2 }}
                                   //sx={{mt:-3}}
                                >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label" 
                                                  inputProps={{ style:{color:'white'} }}
                                                  InputLabelProps={{ style:{color:'white'} }}
                                                  sx={{mt:1, color:'#5DADE2'}}
                                      >PRODUCTO</InputLabel>
                                      <Select
                                        labelId="producto"
                                        id={ocargaDet.id_producto}
                                        value={ocargaDet.id_producto}
                                        name="id_producto"
                                        //size="small"
                                        sx={{display:'block',
                                        margin:'.5rem 0' , color:"white"}}
                                        label="Producto Lote"
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                      >
                                        {   
                                            producto_select.map(elemento => (
                                            <MenuItem   key={elemento.id_producto} 
                                                        value={elemento.id_producto}
                                            >
                                              {elemento.nombre}
                                            </MenuItem>)) 
                                        }
                                      </Select>
                                    </FormControl>
                                </Box>

                                <Grid container spacing={2} > 
                                  <Grid item xs={12}>
                                    <TextField variant="outlined" 
                                          //size="small"
                                          label="OBSERVACIONES"
                                          //sx={{mt:2}}
                                          fullWidth
                                          name="e_observacion"
                                          inputRef={descTextFieldRef}
                                          value={ocargaDet.e_observacion}
                                          onChange={handleChange}
                                          //inputProps={{ style:{color:'white'} }}
                                          inputProps={{ style:{color:'white',textAlign: 'center', fontSize:'14px'} }}
                                          InputLabelProps={{ style:{color:'white'} }}
                                    />
                                  </Grid>
                                </Grid>


                               <TextField variant="filled" 
                                      label="SACOS"
                                      fullWidth
                                      sx={{mt:0}}
                                      name="sacosDescarguio"
                                      inputRef={segundoTextFieldRef}
                                      value={sacosDescarguio}
                                      onChange={handleSacosDescarguioChange}
                                      onKeyDown={(event) => handleKeyDown(event, primeroTextFieldRef ,terceroTextFieldRef)}
                                      //inputProps={{ style:{color:'white'} }}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                                />

                                <TextField variant="filled" 
                                      fullWidth
                                      sx={{mt:0}}
                                      name="kgSaco"
                                      value={kgSaco}
                                      inputRef={terceroTextFieldRef}
                                      onChange={handleKgSacoChange}
                                      onKeyDown={(event) => handleKeyDown(event, segundoTextFieldRef,cuartoTextFieldRef)}
                                      //inputProps={{ style:{color:'white'} }}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                                />

                                <TextField variant="filled" 
                                      label="TN.APROX/BLS"
                                      fullWidth
                                      sx={{mt:0}}
                                      name="tnDescarguio"
                                      value={tnDescarguio}
                                      inputRef={cuartoTextFieldRef}
                                      onChange={handleTnDescarguioChange}
                                      onKeyDown={(event) => handleKeyDown(event, terceroTextFieldRef,cuartoTextFieldRef)}
                                      //inputProps={{ style:{color:'white'} }}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                                />

                                <Button variant='contained' 
                                    color='primary' 
                                    sx={{mt:1}}
                                    type='submit'
                                    disabled={!ocargaDet.id_producto 
                                              //|| !ocargaDet.cantidad
                                              }
                                    >
                                    { cargando ? (
                                    <CircularProgress color="inherit" size={24} />
                                    ) : ('GRABAR')
                                    }
                                  </Button>

                                  <Button variant='contained' 
                                    color='success' 
                                    sx={{mt:0.2}}
                                    onClick={ ()=>{
                                      navigate(-1, { replace: true });
                                      //window.location.reload();
                                      }
                                    }
                                    >
                                    ANTERIOR
                                  </Button>


                            </Grid>
                    </form>
                </CardContent>
            </Card>

  </Grid>      

</Grid>

</div>
    </>    
  )
}
