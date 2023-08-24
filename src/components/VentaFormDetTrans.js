import {Grid,Card,CardContent,TextField,Button,CircularProgress} from '@mui/material'
import { useState,useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import FindIcon from '@mui/icons-material/FindInPage';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function VentaFormDet() {
  //const back_host = process.env.BACK_HOST || "http://localhost:4000";
  const back_host = process.env.BACK_HOST || "https://alsa-backend-js-production.up.railway.app";  
  //experimento
  const [updateTrigger, setUpdateTrigger] = useState({});
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
      ventaDet.tr_razon_social = datosjson.data.nombre_o_razon_social;
  };
  
  /*let txtRazonSocialRef = useRef();
  function razonSocialFocus(){
    const input =  txtRazonSocialRef.current;
    input.focus();
  }*/
  ////////////////////////////////////////////////////////////////////////////////////////

  //Select(Combos) para llenar, desde tabla
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
      
      tr_ruc:'',  
      tr_razon_social:'',  
      tr_chofer:'',
      tr_celular:'',
      tr_placa:'',
      tr_fecha_carga:''
  })

  const handleSubmit = async(e) => {
    e.preventDefault();
    setCargando(true);
    
    //Cambiooo para controlar Edicion
    if (editando){
      await fetch(`${back_host}/ventadettrans/${params.cod}/${params.serie}/${params.num}/${params.elem}/${params.item}`, {
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
    navigate(`/ventamovil/${params.cod}/${params.serie}/${params.num}/${params.elem}/edit`);
    
    //console.log(zona);
  };
  
  //Aqui se leen parametros en caso lleguen
  useEffect( ()=> {
    if (params.cod){
      mostrarVenta(params.cod,params.serie,params.num,params.elem,params.item);
    }  
    
    //console.log(fecha_actual);
  },[params.cod, updateTrigger]);

  //Rico evento change
  const handleChange = e => {
    var index;
    var sTexto;
    //Para todos los demas casos ;)
    setVentaDet({...ventaDet, [e.target.name]: e.target.value});
  }

  //funcion para mostrar data de formulario, modo edicion
  const mostrarVenta = async (cod,serie,num,elem,item) => {
    const res = await fetch(`${back_host}/ventadettrans/${cod}/${serie}/${num}/${elem}/${item}`);
    const data = await res.json();
    //Actualiza datos para enlace con controles, al momento de modo editar
    setVentaDet({  
                tr_ruc:data.tr_ruc,  
                tr_razon_social:data.tr_razon_social,  
                tr_chofer:data.tr_chofer,
                tr_celular:data.tr_celular,
                tr_placa:data.tr_placa,
                tr_fecha_carga:data.tr_fecha_carga
              });
    //console.log(data);
    setEditando(true);
  };
  
  return (
    <> 

    <Grid container spacing={1}
          direction="column"
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
                        <Grid item xs={8}>
                            <TextField variant="outlined" 
                                      label="RUC Transportista"
                                      //sx={{display:'block',
                                      //      margin:'.5rem 0'}}
                                      sx={{mt:-1}}
                                      name="tr_ruc"
                                      value={ventaDet.tr_ruc}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',width: 140} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title="BUSCAR DATOS Internet">
                            <IconButton color="warning" aria-label="upload picture" component="label" size="small"
                              //sx={{display:'block',
                              //margin:'1rem 0'}}
                              sx={{mt:-1}}
                              onClick = { () => {
                                  ventaDet.tr_razon_social = "";
                                  mostrarRazonSocialBusca(ventaDet.tr_ruc);
                                }
                              }
                            >
                              <FindIcon />
                            </IconButton>
                          </Tooltip>    
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title="COPIAR DATOS Transporte Anterior">
                            <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                              //sx={{display:'block',
                              //margin:'1rem 0'}}
                              sx={{mt:-1}}
                              onClick = { () => {
                                  ventaDet.tr_razon_social = "";
                                  mostrarRazonSocialBusca(ventaDet.tr_ruc);
                                }
                              }
                            >
                              <ContentCopyIcon/>
                            </IconButton>
                          </Tooltip>    
                        </Grid>

                        

                    </Grid>
                        <Tooltip title={ventaDet.tr_razon_social || razonSocialBusca}>
                            <TextField variant="outlined" 
                                      label="RAZON SOCIAL"
                                      fullWidth
                                      sx={{display:'block',
                                            margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="tr_razon_social"
                                      //ref={txtRazonSocialRef} //para el rico foco solo con input funciona
                                      value={ventaDet.tr_razon_social || razonSocialBusca}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />
                        </Tooltip>  
                            <TextField variant="filled" 
                                      label="CHOFER"
                                      fullWidth
                                      sx={{display:'block',
                                            margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="tr_chofer"
                                      value={ventaDet.tr_chofer}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'}
                                    }}
                            />

                            <TextField variant="filled" 
                                      label="CELULAR"
                                      fullWidth
                                      sx={{display:'block',
                                            margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="tr_celular"
                                      value={ventaDet.tr_celular}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />

                            <TextField variant="filled" 
                                      label="Placa"
                                      fullWidth
                                      sx={{display:'block',
                                            margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="tr_placa"
                                      value={ventaDet.tr_placa}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />

                            <TextField variant="outlined" 
                                    //label="Fecha Carga"
                                    fullWidth
                                    sx={{display:'block',
                                          margin:'.5rem 0'}}
                                    name="tr_fecha_carga"
                                    type="date"
                                    //format="yyyy/MM/dd"
                                    value={ventaDet.tr_fecha_carga}
                                    onChange={handleChange}
                                    inputProps={{ style:{color:'white'} }}
                                    InputLabelProps={{ style:{color:'white'} }}
                            />

                            <Button variant='contained' 
                                    color='primary' 
                                    sx={{mt:0}}
                                    type='submit'
                                    disabled={!ventaDet.tr_placa || 
                                              !ventaDet.tr_celular ||
                                              !ventaDet.tr_chofer ||
                                              !ventaDet.tr_ruc ||
                                              !ventaDet.tr_fecha_carga ||
                                              !ventaDet.tr_razon_social
                                              }
                                    >
                                    { cargando ? (
                                    <CircularProgress color="inherit" size={24} />
                                    ) : ('AGREGAR')
                                    }
                            </Button>

                            <Button variant='contained' 
                                    color='success' 
                                    sx={{mt:0}}
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

    </>    
  )
}
