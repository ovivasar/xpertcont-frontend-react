import {Modal,Grid,Card,CardContent,TextField,Button,CircularProgress,Typography} from '@mui/material'
import {useState,useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import FindIcon from '@mui/icons-material/FindInPage';
import React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import DeleteIcon from '@mui/icons-material/DeleteForeverRounded';
//import swal from 'sweetalert';

import LineWeightIcon from '@mui/icons-material/LineWeight';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';

export default function OCargaFormDet() {
  //const back_host = process.env.BACK_HOST || "http://localhost:4000";
  const back_host = process.env.BACK_HOST || "https://alsa-backend-js-production.up.railway.app";  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Seccion Modal
  const [abierto,setAbierto] = useState(false);
  const [numGuia,setNumGuia] = useState("");
  const [ocargaDetModal,setocargaDetModal] = useState({
    guia:'',
    guia_traslado:'',
    guia_sacos:'',
    e_peso:'',
    e_costo:'',
    e_monto:''
  })
  
  const [guiaSacos, setGuiaSacos] = useState('');
  const [ePeso, setEPeso] = useState('');
  const [eCosto, setECosto] = useState('');

  const handleGuiaSacosChange = (event) => {
    setGuiaSacos(event.target.value); //almacena valor ePeso para uso posterior
    
    //calcula peso sugerido
    const peso =(ocargaDet.peso_ticket*event.target.value/ocargaDet.sacos_ticket).toFixed(3);
    setEPeso(peso); //almacena valor ePeso para uso posterior

    //calcula monto pago estibaje
    const monto = (peso * eCosto).toFixed(2);
    setocargaDetModal(prevState => ({ ...prevState, guia_sacos: event.target.value }));
    setocargaDetModal(prevState => ({ ...prevState, e_peso: peso }));
    setocargaDetModal(prevState => ({ ...prevState, e_monto: monto }));
    
    setocargaDet({...ocargaDet, [event.target.name+numGuia]: event.target.value});
    //console.log(ocargaDetModal);
  };

  const handleEPesoChange = (event) => {
    setEPeso(event.target.value); //almacena valor ePeso para uso posterior
    const monto = (event.target.value * eCosto).toFixed(2);
    setocargaDetModal(prevState => ({ ...prevState, e_peso: event.target.value }));
    setocargaDetModal(prevState => ({ ...prevState, e_monto: monto }));
    
    setocargaDet({...ocargaDet, [event.target.name+numGuia]: event.target.value});
    //console.log(ocargaDetModal);
  };
  
  const handleECostoChange = (event) => {
    setECosto(event.target.value);//almacena valor eCosto para uso posterior
    const monto = (ePeso * event.target.value).toFixed(2);
    console.log("Monto calculado: ",monto);
    setocargaDetModal(prevState => ({ ...prevState, e_costo: event.target.value }));
    setocargaDetModal(prevState => ({ ...prevState, e_monto: monto }));

    setocargaDet({...ocargaDet, [event.target.name+numGuia]: event.target.value});
    console.log(ocargaDetModal);
  };

  const modalStyles={
    //position:'absolute',
    top:'50%',
    left:'15%',
    //background:'gray',
    border:'0px solid #000',
    padding:'0px 10px 24px',
    width:'100',
    minHeight: '50px'
    //transform:'translate(0%,0%)'
  }
  const abrirCerrarModal = ()=>{
    setAbierto(!abierto);
  }
  const actualizaDatosGuia = e => {
    //actualizamos datos del modal, para pantallita
    setocargaDetModal({...ocargaDetModal, [e.target.name]: e.target.value.toUpperCase()});

    //actualizamos datos del formulario, para pantalla general
    setocargaDet({...ocargaDet, [e.target.name+numGuia]: e.target.value.toUpperCase()});
  }

 
  ///Body para Modal 
  const body=(
    <div>
      <Card sx={{mt:-8}}
            style={{background:'#1e272e',padding:'0rem'}}
      >
          <CardContent >
              <Typography color='white' fontSize={15} marginTop="0rem" >
                    DATOS GUIA {numGuia}
              </Typography>

            <div> 
              <TextField variant="outlined" color="warning"
                        autofocus
                        sx={{display:'block',
                              margin:'.5rem 0'}}
                        name="guia"
                        size='small'
                        label='GUIA'
                        value={ocargaDetModal.guia}
                        onChange={actualizaDatosGuia}
                        inputProps={{ style:{color:'white'} }}
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FindIcon />
                              </InputAdornment>
                            ),
                            style:{color:'white'} 
                        }}
              />
            </div>
            <div> 
              <TextField variant="outlined" color="warning"
                        //autofocus
                        sx={{display:'block',
                              margin:'.5rem 0'}}
                        size='small'
                        name="guia_traslado"
                        value={ocargaDetModal.guia_traslado}
                        label='GUIA TRASL'
                        onChange={actualizaDatosGuia}
                        inputProps={{ style:{color:'white'} }}
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FindIcon />
                              </InputAdornment>
                            ),
                            style:{color:'white'} 
                        }}
              />
            </div>
            <div> 
              <TextField variant="outlined" color="warning"
                        //autofocus
                        sx={{display:'block',
                              margin:'.5rem 0'}}
                        size='small'
                        name="guia_sacos"
                        value={guiaSacos || ocargaDetModal.guia_sacos}
                        label='SACOS'
                        onChange={handleGuiaSacosChange}
                        inputProps={{ style:{color:'white'} }}
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FindIcon />
                              </InputAdornment>
                            ),
                            style:{color:'white'} 
                        }}
              />
            </div>
            <div> 
              <TextField variant="outlined" color="warning"
                        //autofocus
                        sx={{display:'block',
                              margin:'.5rem 0'}}
                        size='small'
                        name="e_peso"
                        //value={ePeso || (ocargaDet.peso_ticket-ocargaDet.e_peso01-ocargaDet.e_peso02-ocargaDet.e_peso03)} 
                        value={ePeso || ocargaDetModal.e_peso} 
                        label='PESO TN.'
                        onChange={handleEPesoChange}
                        inputProps={{ style:{color:'white'} }}
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FindIcon />
                              </InputAdornment>
                            ),
                            style:{color:'white'} 
                        }}
              />
            </div>

            <div> 
              <TextField variant="outlined" color="warning"
                        //autofocus
                        sx={{display:'block',
                              margin:'.5rem 0'}}
                        size='small'
                        name="e_costo"
                        value={eCosto}
                        label='COSTO S/'
                        onChange={handleECostoChange}
                        inputProps={{ style:{color:'white'} }}
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FindIcon />
                              </InputAdornment>
                            ),
                            style:{color:'white'} 
                        }}
              />
            </div>

            <div> 
              <TextField variant="outlined" color="warning"
                        //autofocus
                        sx={{display:'block',
                              margin:'.5rem 0'}}
                        size='small'
                        name="e_monto"
                        value={ocargaDetModal.e_monto}
                        label='PAGO S/'
                        onChange={actualizaDatosGuia}
                        inputProps={{ style:{color:'white'} }}
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FindIcon />
                              </InputAdornment>
                            ),
                            style:{color:'white'} 
                        }}
              />
            </div>

            <div>
                <Button variant='contained'  color="primary"
                  onClick = { () => {
                    setAbierto(false);
                    //actualizar las variables, porque sino hay change, no pasaran
                    if (numGuia==="01") {
                      ocargaDet.guia01 = ocargaDetModal.guia;
                      ocargaDet.guia_traslado01 = ocargaDetModal.guia_traslado;
                      console.log("ocargaDetModal.guia_sacos : ",ocargaDetModal.guia_sacos);
                      ocargaDet.guia_sacos01 = ocargaDetModal.guia_sacos;
                      ocargaDet.e_peso01 = ocargaDetModal.e_peso;
                      ocargaDet.e_monto01 = ocargaDetModal.e_monto;
                    }
                    if (numGuia==="02") {
                      ocargaDet.guia02 = ocargaDetModal.guia;
                      ocargaDet.guia_traslado02 = ocargaDetModal.guia_traslado;
                      ocargaDet.guia_sacos02 = ocargaDetModal.guia_sacos;
                      ocargaDet.e_peso02 = ocargaDetModal.e_peso;
                      ocargaDet.e_monto02 = ocargaDetModal.e_monto;
                    }
                    if (numGuia==="03") {
                      ocargaDet.guia03 = ocargaDetModal.guia;
                      ocargaDet.guia_traslado03 = ocargaDetModal.guia_traslado;
                      ocargaDet.guia_sacos03 = ocargaDetModal.guia_sacos;
                      ocargaDet.e_peso03 = ocargaDetModal.e_peso;
                      ocargaDet.e_monto03 = ocargaDetModal.e_monto;
                    }

                    console.log(ocargaDetModal);
                    console.log(ocargaDet);
                    }
                  }
                >Aceptar
                </Button>
                <Button variant='contained' color="warning"
                  onClick = { () => {
                    setAbierto(false);
                    }
                  }
                >Cancela
                </Button>
            </div>
          </CardContent>
      </Card>

    </div>
  )

  //Fin Seccion Modal
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
  const buscaDatosOC = async () => {
    let strFecha="";
    //La data, corresponde al mes de login
    //le cargaremos fecha actual si parametro no existe
    strFecha=params.fecha_proceso;
    console.log(strFecha);
    if (params.fecha_proceso===null){
      let nPos=0;
      const fecha = new Date(); //ok fecha y hora actual
      strFecha = fecha.toISOString(); //formato texto
      nPos = strFecha.indexOf('T');
      strFecha = strFecha.substr(0,nPos);
    }

    //const res = await fetch(`${back_host}/ocargadet/${ano}/${numero}/${item}`);
    //const data = await res.json();
    //setRegistrosdet(data);
  }

  //Fin Seccion Modal
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //experimento
  const [updateTrigger, setUpdateTrigger] = useState({});
  //funcion para mostrar data de formulario, modo edicion
  
  ////////////////////////////////////////////////////////////////////////////////////////
  //Select(Combos) para llenar, desde tabla
  const [cargando,setCargando] = useState(false);
  const [editando,setEditando] = useState(false);
  
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
      ref_documento_id:'', //ventas
      ref_razon_social:'',  //ventas
      id_producto:'',   //ventas
      descripcion:'',   //ventas
      cantidad:'',      //ventas
      operacion:'',     //ocarga-fase01
      tr_placa:'',      //ventas
      tr_placacargado:'', //ocarga-fase01
      id_zona_entrega:'', //ventas referencial, no visible
      zona_entrega:'',    //ventas referencial, no visible
      sacos_real:'',
      lote_procedencia:'',
      lote_asignado:'',
      e_estibadores:'',
      e_hora_ini:'',
      e_hora_fin:'',
      e_observacion:'',

      ticket:'',
      peso_ticket:'',
      sacos_ticket:'',

      guia01:'',
      guia_traslado01:'',
      guia_sacos01:'',
      e_peso01:'',
      e_monto01:'',

      guia02:'',
      guia_traslado02:'',
      guia_sacos02:'',
      e_peso02:'',
      e_monto02:'',

      guia03:'',
      guia_traslado03:'',
      guia_sacos03:'',
      e_peso03:'',
      e_monto03:''
  })

  const handleSubmit = async(e) => {
    e.preventDefault();
    setCargando(true);
    
    //Cambiooo para controlar Edicion
    if (editando){
      console.log("actualizando");
      console.log(ocargaDet);
      await fetch(`${back_host}/ocargadet03/${params.ano}/${params.numero}/${params.item}`, {
        method: "PUT",
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
    if (params.ano){
      mostrarOCarga(params.ano,params.numero,params.item);
    }  

    //const peso = Number(ocargaDetModal.e_peso);
    //const monto = peso * ocargaDetModal.e_costo;
    //setocargaDetModal(prevState => ({ ...prevState, e_monto: monto }));

    //console.log(ocargaDetModal.e_peso);
  },[params.ano, updateTrigger]);

  //Rico evento change
  const handleChange = e => {
    //Para todos los demas casos ;)
    //console.log("handleChange chino: ",[e.target.name], e.target.value.toUpperCase());
    setocargaDet({...ocargaDet, [e.target.name]: e.target.value.toUpperCase()});
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
                ref_cod:data.ref_cod,
                ref_serie:data.ref_serie,
                ref_numero:data.ref_numero,
                ref_item:data.ref_item,
                pedido:data.pedido,

                ref_documento_id:data.ref_documento_id,
                ref_razon_social:data.ref_razon_social,
                id_producto:data.id_producto,
                descripcion:data.descripcion,
                cantidad:data.cantidad, //new
                unidad_medida:data.unidad_medida, //new
                operacion:data.operacion,
                tr_placa:data.tr_placa, ///new
                tr_placacargado:data.tr_placacargado, ///new
                id_zona_entrega:data.id_zona_entrega,
                zona_entrega:data.zona_entrega,

                sacos_real:data.sacos_real,
                lote_procedencia:data.lote_procedencia,
                lote_asignado:data.lote_asignado,
                e_estibadores:data.e_estibadores,
                e_hora_ini:data.e_hora_ini,
                e_hora_fin:data.e_hora_fin,
                e_observacion:data.e_observacion,

                ticket:data.ticket,
                peso_ticket:data.peso_ticket,
                sacos_ticket:data.sacos_ticket,
                
                guia01:data.guia01,
                guia_traslado01:data.guia_traslado01,
                guia_sacos01:data.guia_sacos01,
                e_peso01:data.e_peso01,
                e_monto01:data.e_monto01,

                guia02:data.guia02,
                guia_traslado02:data.guia_traslado02,
                guia_sacos02:data.guia_sacos02,
                e_peso02:data.e_peso02,
                e_monto02:data.e_monto02,

                guia03:data.guia03,
                guia_traslado03:data.guia_traslado03,
                guia_sacos03:data.guia_sacos03,
                e_peso03:data.e_peso03,
                e_monto03:data.e_monto03

                });
    //console.log(data);
    //console.log(params.modo);
    //primera sugerencia de cantidad guia

    setEditando(true);
  };

  const body01=(
    <Card sx={{mt:0.1}}
          style={{
            background:'#1e272e',
            padding:'1rem',
            height:'3.5rem',
            marginTop:".2rem"
          }}
          //key={ocargaDet.ref_documento_id}
    >
      <CardContent style={{color:'white'}}>
        <Grid container spacing={3}
              direction="column"
              //alignItems="center"
              sx={{ justifyContent: 'flex-start' }}
        >
            <Grid container spacing={0}
              alignItems="center"
            > 
                <Grid item xs={12} sm={6}>
                  <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                              sx={{ textAlign: 'left' }}
                              onClick = { () => {
                                setNumGuia("01");
                                //Arreglar la sugerencia de sacos con referencia a ocargaDet.sacos_real
                                ocargaDetModal.guia = ocargaDet.guia01;
                                ocargaDetModal.guia_traslado = ocargaDet.guia_traslado01;

                                if (ocargaDet.guia_sacos01===null || ocargaDet.guia_sacos01===0){
                                  ocargaDetModal.guia_sacos = ocargaDet.sacos_real-ocargaDet.guia_sacos02-ocargaDet.guia_sacos03;
                                }else{
                                  ocargaDetModal.guia_sacos = ocargaDet.guia_sacos01;
                                }
                                setGuiaSacos(ocargaDetModal.guia_sacos);

                                if (ocargaDet.e_peso01===null || ocargaDet.e_peso01===0){
                                  ocargaDetModal.e_peso = ((ocargaDet.peso_ticket-ocargaDet.e_peso02-ocargaDet.e_peso03)*ocargaDet.sacos_real/ocargaDet.sacos_ticket).toFixed(3);    
                                }else{
                                  ocargaDetModal.e_peso = ocargaDet.e_peso01;
                                }
                                setEPeso(ocargaDetModal.e_peso);

                                ocargaDetModal.e_monto = ocargaDet.e_monto01;
                                setAbierto(true);
                                }
                              }
                  >
                  <EditRoundedIcon />
                  </IconButton>

                  <IconButton color="warning" aria-label="upload picture" component="label" size="small"
                              sx={{ textAlign: 'left' }}
                              onClick = { () => {
                                setNumGuia("01");
                                ocargaDetModal.guia = "";
                                ocargaDetModal.guia_traslado = "";
                                ocargaDetModal.guia_sacos = 0;
                                ocargaDetModal.e_peso = 0;
                                //ocargaDetModal.e_monto = 0;

                                ocargaDet.guia01="";
                                ocargaDet.guia_traslado01="";
                                ocargaDet.guia_sacos01=0;
                                ocargaDet.e_peso01=0;
                                ocargaDet.e_monto01=0;
                                setocargaDet({...ocargaDet, guia01: ""});
                                }
                              }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              
                <Grid item xs={12} sm={6}>
                  <Typography fontSize={15} marginTop="0rem" >
                    GR: {ocargaDet.guia01} 
                  </Typography>
                  <Typography fontSize={15} marginTop="0rem" >
                    TN: {ocargaDet.e_peso01}
                  </Typography>
                  <Typography fontSize={15} marginTop="0rem" >
                    S/. {ocargaDet.e_monto01}
                  </Typography>

                </Grid>
            </Grid>
        </Grid>

    </CardContent>
  </Card>
  );

  const body02=(
    <Card sx={{mt:0.1}}
          style={{
            background:'#1e272e',
            padding:'1rem',
            height:'3.5rem',
            marginTop:".2rem"
          }}
          //key={ocargaDet.ref_documento_id}
    >
      <CardContent style={{color:'white'}}>
        <Grid container spacing={3}
              direction="column"
              //alignItems="center"
              sx={{ justifyContent: 'flex-start' }}
        >
            <Grid container spacing={0}
              alignItems="center"
            > 
                <Grid item xs={12} sm={6}>
                  <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                              sx={{ textAlign: 'left' }}
                              onClick = { () => {
                                setNumGuia("02");
                                ocargaDetModal.guia = ocargaDet.guia02;
                                ocargaDetModal.guia_traslado = ocargaDet.guia_traslado02;
                                
                                //ocargaDetModal.guia_sacos = ocargaDet.guia_sacos02;
                                //ocargaDetModal.e_peso = ocargaDet.e_peso02;
                                if (ocargaDet.guia_sacos02===null || ocargaDet.guia_sacos02===0){
                                  ocargaDetModal.guia_sacos = ocargaDet.sacos_real-ocargaDet.guia_sacos01-ocargaDet.guia_sacos03;
                                }else{
                                  ocargaDetModal.guia_sacos = ocargaDet.guia_sacos02;
                                }
                                setGuiaSacos(ocargaDetModal.guia_sacos);

                                if (ocargaDet.e_peso02===null || ocargaDet.e_peso02===0){
                                  ocargaDetModal.e_peso = (ocargaDet.peso_ticket-ocargaDet.e_peso01-ocargaDet.e_peso03).toFixed(3);    
                                }else{
                                  ocargaDetModal.e_peso = ocargaDet.e_peso02;
                                }
                                setEPeso(ocargaDetModal.e_peso);

                                ocargaDetModal.e_monto = ocargaDet.e_monto02;
                                setAbierto(true);
                                }
                              }
                  >
                  <EditRoundedIcon />
                  </IconButton>

                  <IconButton color="warning" aria-label="upload picture" component="label" size="small"
                              sx={{ textAlign: 'left' }}
                              onClick = { () => {
                                setNumGuia("02");
                                ocargaDetModal.guia = "";
                                ocargaDetModal.guia_traslado = "";
                                ocargaDetModal.guia_sacos = 0;
                                ocargaDetModal.e_peso = 0;
                                //ocargaDetModal.e_monto = 0;

                                ocargaDet.guia02="";
                                ocargaDet.guia_traslado02="";
                                ocargaDet.guia_sacos02=0;
                                ocargaDet.e_peso02=0;
                                ocargaDet.e_monto02=0;
                                setocargaDet({...ocargaDet, guia02: ""});
                                }
                              }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              
                <Grid item xs={12} sm={6}>
                  <Typography fontSize={15} marginTop="0rem" >
                    GR: {ocargaDet.guia02} 
                  </Typography>
                  <Typography fontSize={15} marginTop="0rem" >
                    TN: {ocargaDet.e_peso02}
                  </Typography>
                  <Typography fontSize={15} marginTop="0rem" >
                    S/. {ocargaDet.e_monto02}
                  </Typography>
                </Grid>
            </Grid>
        </Grid>

    </CardContent>
  </Card>
  );
  

  const body03=(
    <Card sx={{mt:0.1}}
          style={{
            background:'#1e272e',
            padding:'1rem',
            height:'3.5rem',
            marginTop:".2rem"
          }}
          //key={ocargaDet.ref_documento_id}
    >
      <CardContent style={{color:'white'}}>
        <Grid container spacing={3}
              direction="column"
              //alignItems="center"
              sx={{ justifyContent: 'flex-start' }}
        >
            <Grid container spacing={0}
              alignItems="center"
            > 
                <Grid item xs={12} sm={6}>
                  <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                              sx={{ textAlign: 'left' }}
                              onClick = { () => {
                                setNumGuia("03");
                                ocargaDetModal.guia = ocargaDet.guia03
                                ocargaDetModal.guia_traslado = ocargaDet.guia_traslado03
                                
                                //ocargaDetModal.guia_sacos = ocargaDet.guia_sacos03
                                //ocargaDetModal.e_peso = ocargaDet.e_peso03
                                if (ocargaDet.guia_sacos03===null){
                                  ocargaDetModal.guia_sacos = ocargaDet.sacos_real-ocargaDet.guia_sacos01-ocargaDet.guia_sacos02;
                                }else{
                                  ocargaDetModal.guia_sacos = ocargaDet.guia_sacos03;
                                }
                                setGuiaSacos(ocargaDetModal.guia_sacos);

                                if (ocargaDet.e_peso03===null){
                                  ocargaDetModal.e_peso = ocargaDet.peso_ticket-ocargaDet.e_peso01-ocargaDet.e_peso02;    
                                }else{
                                  ocargaDetModal.e_peso = ocargaDet.e_peso03;
                                }
                                setEPeso(ocargaDetModal.e_peso);

                                ocargaDetModal.e_monto = ocargaDet.e_monto03
                                setAbierto(true);
                                }
                              }
                  >
                  <EditRoundedIcon />
                  </IconButton>

                  <IconButton color="warning" aria-label="upload picture" component="label" size="small"
                              sx={{ textAlign: 'left' }}
                              onClick = { () => {
                                setNumGuia("03");
                                ocargaDetModal.guia = "";
                                ocargaDetModal.guia_traslado = "";
                                ocargaDetModal.guia_sacos = 0;
                                ocargaDetModal.e_peso = 0;
                                //ocargaDetModal.e_monto = 0;

                                ocargaDet.guia03="";
                                ocargaDet.guia_traslado03="";
                                ocargaDet.guia_sacos03=0;
                                ocargaDet.e_peso03=0;
                                ocargaDet.e_monto03=0;
                                setocargaDet({...ocargaDet, guia03: ""});
                                }
                              }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              
                <Grid item xs={12} sm={6}>
                  <Typography fontSize={15} marginTop="0rem" >
                    GR: {ocargaDet.guia03} 
                  </Typography>
                  <Typography fontSize={15} marginTop="0rem" >
                    TN: {ocargaDet.e_peso03}
                  </Typography>
                  <Typography fontSize={15} marginTop="0rem" >
                    S/. {ocargaDet.e_monto03}
                  </Typography>
                </Grid>
            </Grid>
        </Grid>

    </CardContent>
  </Card>
  );
  
  return (
    <> 
<div class="p-3 mb-2 bg-dark text-white">

<div>
  <Modal
    open={abierto}
    onClose={abrirCerrarModal}
    style={modalStyles}
    >
    {body}
  </Modal>
</div>

<Grid container spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
    >

  <Grid item xs={10}>

            <Card sx={{mt:1}}
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
                                <Typography fontSize={15} marginTop="0.5rem" 
                                style={{color:'#F39C12'}}
                                >
                                DATOS DE ORDEN (PESO/PAGO ESTIBA)
                                </Typography>


                                <Grid container spacing={0.5}>
                                    <Grid item xs={10}>
                                        <TextField variant="outlined" 
                                            label="ORDEN"
                                            size="small"
                                            sx={{mt:1}}
                                            fullWidth
                                            name="numero"
                                            //value={ocargaDet.numero || numeroOrden}
                                            value={ocargaDet.numero}
                                            onChange={handleChange}
                                            inputProps={{ style:{color:'#4F8FE1', textAlign: 'center'} }}
                                            InputLabelProps={{ style:{color:'white'} }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton color="warning" aria-label="upload picture" component="label" size="small"
                                          //sx={{display:'block',
                                          //margin:'1rem 0'}}
                                          sx={{mt:1}}
                                          onClick = { () => {
                                            buscaDatosOC();//Info del modal
                                            }
                                          }
                                        >
                                            <FindIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>

                                <Typography marginTop="0.5rem" variant="subtitle2" 
                                style={{color:'#4F8FE1'}}
                                >
                                PEDIDO : {ocargaDet.pedido}
                                </Typography>

                                <Typography marginTop="0.5rem" variant="subtitle2" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                CLIENTE : {ocargaDet.ref_razon_social}
                                </Typography>

                                <Typography marginTop="0.5rem" variant="subtitle2" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                PRODUCTO : {ocargaDet.descripcion}
                                </Typography>

                                <Typography marginTop="0.5rem" variant="subtitle2" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                CANT. : {ocargaDet.cantidad} {ocargaDet.unidad_medida}
                                </Typography>
                                
                                <Typography marginTop="0.5rem" variant="subtitle2" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                PLACA VACIO : {ocargaDet.tr_placa}
                                </Typography>

                                <Typography marginTop="0.5rem" variant="subtitle2" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                ENTREGA : {ocargaDet.zona_entrega}
                                </Typography>

                                <Typography marginTop="0.5rem" variant="subtitle2" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                FECHA : {ocargaDet.fecha2}
                                </Typography>

                                <Typography marginTop="0.5rem" variant="subtitle2" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                OPERACION : {ocargaDet.operacion}
                                </Typography>

                                <Typography marginTop="0.5rem" variant="subtitle2" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                PLACA CARGA : {ocargaDet.tr_placacargado}
                                </Typography>

                                <Typography marginTop="0.5rem" variant="subtitle2" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                SACOS REAL : {ocargaDet.sacos_real}
                                </Typography>

                                <Typography marginTop="0.5rem" variant="subtitle2" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                LOTE PROCED. : {ocargaDet.lote_procedencia}
                                </Typography>

                                <Typography marginTop="0.5rem" variant="subtitle2" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                LOTE ASIGN. : {ocargaDet.lote_asignado}
                                </Typography>

                                <Typography marginTop="0.5rem" variant="subtitle2" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                ESTIBADORES : {ocargaDet.e_estibadores}
                                </Typography>


                                <TextField variant="outlined" 
                                    label="TICKET"
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <BookmarkBorderIcon />
                                        </InputAdornment>
                                      ),
                                    }}                                          
                                    sx={{display:'block',margin:'.5rem 0'}}
                                    name="ticket"
                                    size='small'
                                    fullWidth
                                    value={ocargaDet.ticket}
                                    onChange={handleChange}
                                    inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                    InputLabelProps={{ style:{color:'white'} }}
                                />
                                <TextField variant="outlined" 
                                    label="TN."
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <LineWeightIcon />
                                        </InputAdornment>
                                      ),
                                    }}                                          
                                    sx={{display:'block',margin:'.5rem 0'}}
                                    name="peso_ticket"
                                    value={ocargaDet.peso_ticket}
                                    size='small'
                                    fullWidth
                                    onChange={handleChange}
                                    inputProps={{ style:{color:'white', textAlign: 'center'} }}
                                    InputLabelProps={{ style:{color:'white'} }}
                                />
                                <TextField variant="outlined" 
                                    label="SACOS"
                                    //type="number"
                                    step="1"
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <ViewCompactIcon />
                                        </InputAdornment>
                                      ),
                                    }}                                          
                                    sx={{display:'block',margin:'.5rem 0'}}
                                    name="sacos_ticket"
                                    value={ocargaDet.sacos_ticket}
                                    size='small'
                                    fullWidth
                                    onChange={handleChange}
                                    inputProps={{ style:{color:'white', textAlign: 'center'} }}
                                    InputLabelProps={{ style:{color:'white'} }}
                                />

                                {body01}
                                {body02}
                                {body03}

                                <Button variant='contained' 
                                    color='primary' 
                                    sx={{mt:1}}
                                    type='submit'
                                    disabled={!ocargaDet.fecha2 || 
                                              !ocargaDet.operacion
                                              }
                                    >
                                    { cargando ? (
                                    <CircularProgress color="inherit" size={24} />
                                    ) : ('GRABAR')
                                    }
                                  </Button>

                                  <Button variant='contained' 
                                    color='success' 
                                    sx={{mt:1}}
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
