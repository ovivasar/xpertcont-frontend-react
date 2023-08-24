import {Modal,Grid,Card,CardContent,TextField,Button,CircularProgress,Select, MenuItem, InputLabel, Box, FormControl, Checkbox} from '@mui/material'
import { useState,useEffect, useMemo, useCallback } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import FindIcon from '@mui/icons-material/FindInPage';
import axios from 'axios';
import React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import Datatable, {createTheme} from 'react-data-table-component';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ArrowDownward from '@mui/icons-material/ArrowDownward';

export default function OCargaFormDet() {
  //const back_host = process.env.BACK_HOST || "http://localhost:4000";
  const back_host = process.env.BACK_HOST || "https://alsa-backend-js-production.up.railway.app";  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Seccion Modal
  createTheme('solarized', {
    text: {
      //primary: '#268bd2',
      primary: '#ffffff',
      secondary: '#2aa198',
    },
    background: {
      //default: '#002b36',
      default: '#1e272e'
    },
    context: {
      background: '#cb4b16',
      //background: '#1e272e',
      text: '#FFFFFF',
    },
    divider: {
      default: '#073642',
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)',
    },
  }, 'dark');

  const [abierto,setAbierto] = useState(false);
  const modalStyles={
    position:'absolute',
    top:'0%',
    left:'0%',
    background:'gray',
    border:'2px solid #000',
    padding:'16px 32px 24px',
    width:'100',
    minHeight: '50px'
    //transform:'translate(0%,0%)'
  }
  const tablaStyles = {
    rows: {
        style: {
            minHeight: '20px', // override the row height
        },
    },
    headCells: {
        style: {
            paddingLeft: '8px', // override the cell padding for head cells
            paddingRight: '8px',
        },
    },
    cells: {
        style: {
            paddingLeft: '8px', // override the cell padding for data cells
            paddingRight: '8px',
        },
    },
};  
  const abrirCerrarModal = ()=>{
    setAbierto(!abierto);
  }
  const actualizaValorFiltro = e => {
    //setValorBusqueda(e.target.value);
    filtrar(e.target.value);
  }
  const filtrar=(strBusca)=>{
      var resultadosBusqueda = [];
      
      resultadosBusqueda = tabladet.filter((elemento) => {
        if (elemento.ref_razon_social.toString().toLowerCase().includes(strBusca.toLowerCase())
      //   || elemento.pedido.toString().toLowerCase().includes(strBusca.toLowerCase())
         || elemento.nombre.toString().toLowerCase().includes(strBusca.toLowerCase())
          ){
              return elemento;
          }
      });
      setRegistrosdet(resultadosBusqueda);
  }
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [registrosdet,setRegistrosdet] = useState([]); //Para vista principal
  const [tabladet,setTabladet] = useState([]);  //Copia de los registros: Para tratamiento de filtrado
  const columnas = [
    { name:'PEDIDO', 
      selector:row => row.pedido,
      sortable: true
    },
    { name:'DOCUMENTO ID', 
      selector:row => row.documento_id,
      sortable: true
    },
    { name:'RAZON_SOCIAL', 
      selector:row => row.ref_razon_social,
      sortable: true
    },
    { name:'IDPRODUCTO', 
      selector:row => row.id_producto,
      sortable: true
    },
    { name:'PRODUCTO', 
      selector:row => row.nombre,
      sortable: true
    },
    { name:'IDZONA', 
      selector:row => row.id_zona_entrega,
      sortable: true
    },
    { name:'ENTREGA', 
      selector:row => row.zona_entrega,
      sortable: true
    },
    { name:'FECHA', 
      selector:row => row.fecha,
      sortable: true,
      key:true
    },
    { name:'SALDO', 
      selector:row => row.saldo,
      sortable: true,
      key:true
    }
  ];

  const handleRowSelected = useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);
  
  const contextActions = useMemo(() => {
    //console.log("asaaa");
		const handleSeleccionado = () => {
			var strPedido;
      var strIdProducto;
      var strProducto;
      var strIdZonaEntrega;
      var strZonaEntrega;
      var strDocumentoId;
      var strRazonSocial;
      //var strMonto;

      strPedido = selectedRows.map(r => r.pedido);
      strIdProducto = selectedRows.map(r => r.id_producto);
      strProducto = selectedRows.map(r => r.nombre);
      strIdZonaEntrega = selectedRows.map(r => r.id_zona_entrega);
      strZonaEntrega = selectedRows.map(r => r.zona_entrega);
      strDocumentoId = selectedRows.map(r => r.ref_documento_id);
      strRazonSocial = selectedRows.map(r => r.ref_razon_social);

      //console.log(strPedido[0]);
      //ojo: cuando llega la variable ,desde un filtro en automatico, llega como array unitario, pero array
      //y si lo enviamos al backend en ese formato, las funciones de tratamiento de texto no funcionaran, danger
      ocargaDet.pedido = strPedido[0];
      ocargaDet.id_producto = strIdProducto[0];
      ocargaDet.descripcion = strProducto[0];
      ocargaDet.id_zona_entrega = strIdZonaEntrega[0];
      ocargaDet.zona_entrega = strZonaEntrega[0];
      ocargaDet.ref_documento_id = strDocumentoId[0];
      ocargaDet.ref_razon_social= strRazonSocial[0];

      setToggleCleared(!toggleCleared);
      //Cerrar Modal
      setAbierto(false);
		};


		return (
      <>
			<Button key="seleccionado" onClick={handleSeleccionado} >
       ACEPTAR <EditRoundedIcon/>
			</Button>
			
      </>
		);
	}, [registrosdet, selectedRows, toggleCleared]);

  const cargaArregloPopUp = async () => {
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
    
    const response = await fetch(`${back_host}/ventadetpendientes/${strFecha}`);
    const data = await response.json();
    setRegistrosdet(data);
    setTabladet(data); //Copia para tratamiento de filtrado
  }

  //Fin Seccion Modal
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //experimento
  const [updateTrigger, setUpdateTrigger] = useState({});
  const [razonSocialBusca, setRazonSocialBusca] = useState("");
    //funcion para mostrar data de formulario, modo edicion
  const mostrarRazonSocialBusca = async (ref_documento_id) => {
      const res = await fetch(`https://apiperu.dev/api/ruc/${ref_documento_id}`, {
        method: "GET",
        headers: {"Content-Type":"application/json",
                  "Authorization": "Bearer " + "f03875f81da6f2c2f2e29f48fdf798f15b7a2811893ad61a1e97934a665acc8b"
                  }
      });

      const datosjson = await res.json();
      //console.log(datosjson);
      //console.log(datosjson.data.nombre_o_razon_social);
      setRazonSocialBusca(datosjson.data.nombre_o_razon_social);
      ocargaDet.ref_razon_social = datosjson.data.nombre_o_razon_social;
  };
  
  /*let txtRazonSocialRef = useRef();
  function razonSocialFocus(){
    const input =  txtRazonSocialRef.current;
    input.focus();
  }*/
  ////////////////////////////////////////////////////////////////////////////////////////
  const [operacion_select] = useState([
    {operacion:'CARGUIO'},
    {operacion:'DESCARGUIO'},
    {operacion:'TRANSBORDO'}
  ]);
  //Select(Combos) para llenar, desde tabla
  const [cliente_select,setClienteSelect] = useState([]);
  const [zonaentrega_select,setZonaEntregaSelect] = useState([]);
  const [producto_select,setProductoSelect] = useState([]);
  //const [numeroOrden, setnumeroOrden] = useState(""); //Para modificar y/o blanquear en formulario

  const [cargando,setCargando] = useState(false);
  const [editando,setEditando] = useState(false);
  
  const navigate = useNavigate();
  const params = useParams();

  //const fecha_actual = new Date();

  //Para guardado de datos antes de envio 
  //Falta aumentar la fecha desde el parametro
  const [ocargaDet,setocargaDet] = useState({
      id_empresa:'1',  
      id_punto_venta:'1001',  
      fecha2:'',
      
      ano:'',
      numero:'',
      item:'',
      
      operacion:'',
      ticket:'',
      guia:'',
      
      pedido:'',  //ref_cod, ref_serie, ref_numero, item
      id_zona_entrega:'',
      zona_entrega:'',
      id_producto:'',
      descripcion:'',
      ref_documento_id:'',
      ref_razon_social:'',
      desag_sacos:'',
      desag_tn:'',
      llega_sacos:'',
      operacion2:'',
      sacos_transb:0,
      sacos_descar:0,
      lote_asignado:'',
      sacos_carga:0,
      lote_procedencia:'',
      sacos_final:0,
      tara_desag:0,
      e_peso:0,
      e_monto:0,
      e_razon_social:'',
      e_rh:'',
      e_hora_ini:'',
      e_hora_fin:'',
      e_estibadores:'',
      e_observacion:'',
      registrado:'1'
  })

  const handleSubmit = async(e) => {
    e.preventDefault();
    setCargando(true);
    
    //Cambiooo para controlar Edicion
    if (editando){
      if (params.modo === "clonar") {
        console.log("insertando nueva ORDEN CARGA, opcion clonar");
        console.log(ocargaDet);
        await fetch(`${back_host}/ocargadetadd`, {
          method: "POST",
          body: JSON.stringify(ocargaDet),
          headers: {"Content-Type":"application/json"}
        });
      }
      else{
        console.log("actualizando");
        await fetch(`${back_host}/ocargadet/${params.ano}/${params.numero}/${params.item}`, {
          method: "PUT",
          body: JSON.stringify(ocargaDet),
          headers: {"Content-Type":"application/json"}
        });
      }
    }else{
      console.log(ocargaDet);
      //Insertar new orden detalle
      if (ocargaDet.numero==="") {
          console.log("insertando nueva ORDEN CARGA");
          console.log(ocargaDet);
          await fetch(`${back_host}/ocargadet`, {
            method: "POST",
            body: JSON.stringify(ocargaDet),
            headers: {"Content-Type":"application/json"}
          });
      }else {
          //Agregar orden detalle (con referencia de numero carga)
          console.log("agregando o clonado adicional");
          console.log(ocargaDet);
          await fetch(`${back_host}/ocargadetadd`, {
            method: "POST",
            body: JSON.stringify(ocargaDet),
            headers: {"Content-Type":"application/json"}
          });
      }
    }

    setCargando(false);
    
    setEditando(true);
    setUpdateTrigger(Math.random());//experimento
    navigate(`/ocargadet/${params.fecha_proceso}`);
    
    //console.log(zona);
  };
  
  //Aqui se leen parametros en caso lleguen
  useEffect( ()=> {
    if (params.ano){
      mostrarOCarga(params.ano,params.numero,params.item);
    }  
    
    cargaZonaEntregaCombo();
    cargaProductoCombo();
    cargaClienteCombo();
    //console.log(fecha_actual);
  },[params.ano, updateTrigger]);

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
  const cargaClienteCombo = () =>{
    axios
    .get(`${back_host}/correntista`)
    .then((response) => {
        setClienteSelect(response.data);
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
      setocargaDet({...ocargaDet, [e.target.name]: e.target.value, zona_entrega:sTexto});
      return;
    }
    if (e.target.name === "id_producto") {
      const arrayCopia = producto_select.slice();
      index = arrayCopia.map(elemento => elemento.id_producto).indexOf(e.target.value);
      sTexto = arrayCopia[index].nombre;
      setocargaDet({...ocargaDet, [e.target.name]: e.target.value, descripcion:sTexto});
      return;
    }
    if (e.target.name === "ref_documento_id") {
      const arrayCopia = cliente_select.slice();
      index = arrayCopia.map(elemento => elemento.ref_documento_id).indexOf(e.target.value);
      sTexto = arrayCopia[index].ref_razon_social;
      setocargaDet({...ocargaDet, [e.target.name]: e.target.value, ref_razon_social:sTexto});
      return;
    }

    //Para todos los demas casos ;)
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
                pedido:data.pedido,
                operacion:data.operacion,
                ticket:data.ticket,
                guia:data.guia,
                id_zona_entrega:data.id_zona_entrega,
                zona_entrega:data.zona_entrega,
                id_producto:data.id_producto,
                descripcion:data.descripcion,
                ref_documento_id:data.ref_documento_id,
                ref_razon_social:data.ref_razon_social,
                desag_sacos:data.desag_sacos,
                desag_tn:data.desag_tn,
                llega_sacos:data.llega_sacos,
                operacion2:data.operacion2,
                sacos_transb:data.sacos_transb,
                sacos_descar:data.sacos_descar,
                lote_asignado:data.lote_asignado,
                sacos_carga:data.sacos_carga,
                lote_procedencia:data.lote_procedencia,
                sacos_final:data.sacos_final,
                tara_desag:data.tara_desag,
                e_peso:data.e_peso,
                e_monto:data.e_monto,
                e_razon_social:data.e_razon_social,
                e_rh:data.e_rh,
                e_hora_ini:data.e_hora_ini,
                e_hora_fin:data.e_hora_fin,
                e_estibadores:data.e_estibadores,
                e_observacion:data.e_observacion,
                registrado:data.registrado
                });
    //console.log(data);
    
    //console.log(params.modo);
    if (params.modo === "clonar"){
        //limpiar numero orden
        //setnumeroOrden("");
        //ocargaDet.numero = "";
        //console.log(ocargaDet.numero);
    }

    setEditando(true);
  };
  ///Body para Modal de Busqueda Incremental de Pedidos
  const body=(
    <div>
        <div> 
          <TextField fullWidth variant="outlined" color="warning"
                    autofocus
                    label="FILTRAR"
                    sx={{display:'block',
                          margin:'.5rem 0'}}
                    name="busqueda"
                    placeholder='Cliente   Producto'
                    onChange={actualizaValorFiltro}
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
        
        <Datatable
          title="Pedidos Pendientes"
          theme="solarized"
          columns={columnas}
          data={registrosdet}
          selectableRows
          contextActions={contextActions}
          //actions={actions}
          onSelectedRowsChange={handleRowSelected}
          clearSelectedRows={toggleCleared}

          selectableRowsComponent={Checkbox} // Pass the function only
          sortIcon={<ArrowDownward />}  
          customStyles={tablaStyles}
          >
        </Datatable>
        <br />

        <div>
            <Button color="warning"
              onClick = { () => {
                setAbierto(false);
                }
              }
            >Cerrar
            </Button>
        </div>
    </div>
  )

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
                    <form onSubmit={handleSubmit} >

                            <Grid container spacing={0.5}
                                      alignItems="center"
                                      justifyContent="center"
                            
                            >
                                <Grid item xs={3}>
                                    <TextField variant="outlined" 
                                        //label="fecha"
                                        sx={{mt:-1}}
                                        name="fecha2"
                                        type="date"
                                        //format="yyyy/MM/dd"
                                        value={ocargaDet.fecha2}
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                    />
                                </Grid>

                                <Grid item xs={2.5}>
                                    <TextField variant="outlined" 
                                          label="PEDIDO"
                                          sx={{mt:-1}}
                                          name="pedido"
                                          //ref={txtRazonSocialRef} //para el rico foco solo con input funciona
                                          value={ocargaDet.pedido}
                                          onChange={handleChange}
                                          inputProps={{ style:{color:'white'} }}
                                          InputLabelProps={{ style:{color:'white'} }}
                                    />
                                </Grid>
                                <Grid item xs={0.5}>
                                    <IconButton color="warning" aria-label="upload picture" component="label" size="small"
                                      //sx={{display:'block',
                                      //margin:'1rem 0'}}
                                      sx={{mt:-1}}
                                      onClick = { () => {
                                        cargaArregloPopUp();//Info del modal
                                        setAbierto(true);
                                        }
                                      }
                                    >
                                    <FindIcon />
                                </IconButton>

                                </Grid>

                                <Grid item xs={3}>
                                <Box sx={{mt:-1}}
                                >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label" 
                                                  inputProps={{ style:{color:'white'} }}
                                                  InputLabelProps={{ style:{color:'white'} }}
                                      >Lugar Llegada</InputLabel>
                                      <Select
                                        labelId="zona_entrega"
                                        id={ocargaDet.id_zona_entrega}
                                        value={ocargaDet.id_zona_entrega}
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
                                </Grid>

                                <Grid item xs={3}>
                                    <TextField variant="outlined" 
                                          label="ORDEN"
                                          sx={{mt:-1}}
                                          name="numero"
                                          //value={ocargaDet.numero || numeroOrden}
                                          value={ocargaDet.numero}
                                          onChange={handleChange}
                                          inputProps={{ style:{color:'white'} }}
                                          InputLabelProps={{ style:{color:'white'} }}
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    <TextField variant="outlined" 
                                          label="GUIA"
                                          sx={{mt:0}}
                                          name="guia"
                                          value={ocargaDet.guia}
                                          onChange={handleChange}
                                          inputProps={{ style:{color:'white'} }}
                                          InputLabelProps={{ style:{color:'white'} }}
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                <Box sx={{mt:0}}>
                                <FormControl fullWidth>
                                  <InputLabel id="demo-simple-select-label" 
                                                    inputProps={{ style:{color:'white'} }}
                                                    InputLabelProps={{ style:{color:'white'} }}
                                  >Operacion</InputLabel>
                                  <Select
                                          labelId="operacion_select"
                                          id={ocargaDet.operacion}
                                          value={ocargaDet.operacion}
                                          name="operacion"
                                          sx={{display:'block',
                                          margin:'.5rem 0'}}
                                          label="Operacion"
                                          onChange={handleChange}
                                        >
                                          {   
                                              operacion_select.map(elemento => (
                                              <MenuItem key={elemento.operacion} value={elemento.operacion}>
                                                {elemento.operacion}
                                              </MenuItem>)) 
                                          }
                                  </Select>
                                </FormControl>
                                </Box>
                                </Grid>

                                <Grid item xs={3}>
                                    <TextField variant="outlined" 
                                          label="TICKET"
                                          sx={{mt:0}}
                                          name="ticket"
                                          value={ocargaDet.ticket}
                                          onChange={handleChange}
                                          inputProps={{ style:{color:'white'} }}
                                          InputLabelProps={{ style:{color:'white'} }}
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    <Box //sx={{ minWidth: 120 }}
                                      sx={{mt:0}}
                                    >
                                        <FormControl fullWidth>
                                          <InputLabel id="demo-simple-select-label" 
                                                      inputProps={{ style:{color:'white'} }}
                                                      InputLabelProps={{ style:{color:'white'} }}
                                          >Producto/Clase</InputLabel>
                                          <Select
                                            labelId="producto"
                                            id={ocargaDet.id_producto}
                                            value={ocargaDet.id_producto}
                                            name="id_producto"
                                            sx={{display:'block',
                                            margin:'.5rem 0'}}
                                            label="Producto Clase"
                                            onChange={handleChange}
                                            inputProps={{ style:{color:'white'} }}
                                            InputLabelProps={{ style:{color:'white'} }}
                                          >
                                            {   
                                                producto_select.map(elemento => (
                                                <MenuItem   key={elemento.id_producto} 
                                                            value={elemento.id_producto}>
                                                  {elemento.nombre}
                                                </MenuItem>)) 
                                            }
                                          </Select>
                                        </FormControl>
                                    </Box>
                                </Grid>

                                <Grid item xs={3}>
                                    <Box //sx={{ minWidth: 120 }}
                                           sx={{mt:0}}
                                    >
                                            <FormControl fullWidth>
                                              <InputLabel id="demo-simple-select-label" 
                                                          inputProps={{ style:{color:'white'} }}
                                                          InputLabelProps={{ style:{color:'white'} }}
                                              >Cliente</InputLabel>
                                              <Select
                                                labelId="cliente_select"
                                                id={ocargaDet.ref_documento_id}
                                                value={ocargaDet.ref_documento_id}
                                                name="ref_documento_id"
                                                sx={{display:'block',
                                                margin:'.5rem 0'}}
                                                label="Cliente"
                                                onChange={handleChange}
                                              >
                                                {   
                                                    cliente_select.map(elemento => (
                                                    <MenuItem key={elemento.ref_documento_id} value={elemento.documento_id}>
                                                      {elemento.ref_razon_social}
                                                    </MenuItem>)) 
                                                }
                                              </Select>
                                            </FormControl>
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={3}>
                                    <TextField variant="outlined" 
                                          label="GRR SACOS"
                                          sx={{display:'block',
                                                margin:'.5rem 0'}}
                                          //sx={{mt:-3}}
                                          name="desag_sacos"
                                          value={ocargaDet.desag_sacos}
                                          onChange={handleChange}
                                          inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                          InputLabelProps={{ style:{color:'white'}
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    <TextField variant="outlined" 
                                          label="GRR TN."
                                          sx={{display:'block',
                                                margin:'.5rem 0'}}
                                          //sx={{mt:-3}}
                                          name="desag_tn"
                                          value={ocargaDet.desag_tn}
                                          onChange={handleChange}
                                          inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                          InputLabelProps={{ style:{color:'white'}
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    <TextField variant="outlined" 
                                          label="LLEG. SACOS"
                                          sx={{display:'block',
                                                margin:'.5rem 0'}}
                                          //sx={{mt:-3}}
                                          name="llega_sacos"
                                          value={ocargaDet.llega_sacos}
                                          onChange={handleChange}
                                          inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                          InputLabelProps={{ style:{color:'white'}
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item xs={3}>
                                  <TextField variant="outlined" 
                                        label="OPERACION 2"
                                        sx={{display:'block',
                                              margin:'.5rem 0'}}
                                        //sx={{mt:-3}}
                                        name="operacion2"
                                        value={ocargaDet.operacion2}
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                  />
                                </Grid>

                                <Grid item xs={3}>
                                    <TextField variant="outlined" 
                                          label="TRANSB. SACOS"
                                          sx={{display:'block',
                                                margin:'.5rem 0'}}
                                          //sx={{mt:-3}}
                                          name="sacos_transb"
                                          value={ocargaDet.sacos_transb}
                                          onChange={handleChange}
                                          inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                          InputLabelProps={{ style:{color:'white'}
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    <TextField variant="outlined" 
                                          label="DESCARGA SACOS"
                                          sx={{display:'block',
                                                margin:'.5rem 0'}}
                                          //sx={{mt:-3}}
                                          name="sacos_descar"
                                          value={ocargaDet.sacos_descar}
                                          onChange={handleChange}
                                          inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                          InputLabelProps={{ style:{color:'white'}
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                  <TextField variant="outlined" 
                                        label="LOTE ASIGNADO"
                                        sx={{display:'block',
                                              margin:'.5rem 0'}}
                                        //sx={{mt:-3}}
                                        name="lote_asignado"
                                        value={ocargaDet.lote_asignado}
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                  />
                                </Grid>

                                <Grid item xs={3}>
                                    <TextField variant="outlined" 
                                          label="CANT.CARGO SACOS"
                                          sx={{display:'block',
                                                margin:'.5rem 0'}}
                                          //sx={{mt:-3}}
                                          name="sacos_carga"
                                          value={ocargaDet.sacos_carga}
                                          onChange={handleChange}
                                          inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                          InputLabelProps={{ style:{color:'white'}
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                  <TextField variant="outlined" 
                                        label="LOTE PROCEDENCIA"
                                        sx={{display:'block',
                                              margin:'.5rem 0'}}
                                        //sx={{mt:-3}}
                                        name="lote_procedencia"
                                        value={ocargaDet.lote_procedencia}
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                  />
                                </Grid>

                                <Grid item xs={3}>
                                  <TextField variant="outlined" 
                                        label="CANT. FINAL SACOS"
                                        sx={{display:'block',
                                              margin:'.5rem 0'}}
                                        //sx={{mt:-3}}
                                        name="sacos_final"
                                        value={ocargaDet.sacos_final}
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                  />
                                </Grid>

                                <Grid item xs={3}>
                                  <TextField variant="outlined" 
                                        label="TARA DESAGUADERO"
                                        sx={{display:'block',
                                              margin:'.5rem 0'}}
                                        //sx={{mt:-3}}
                                        name="tara_desag"
                                        value={ocargaDet.tara_desag}
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                  />
                                </Grid>

                            </Grid>
                    </form>
                </CardContent>
            </Card>


            <Card sx={{mt:1}}
                  style={{
                    background:'#1e272e',
                    padding:'-5rem'
                  }}
                  //hidden={!editando}
                  >
                <CardContent>
                    <form onSubmit={handleSubmit} >
                            <Grid container spacing={0.5}
                                      alignItems="center"
                                      justifyContent="center"
                            >

                                <Grid item xs={1.2}>
                                    <Button variant='contained' 
                                        color='primary' 
                                        sx={{mt:0}}
                                        type='submit'
                                        disabled={!ocargaDet.fecha2 || 
                                                  !ocargaDet.guia ||
                                                  !ocargaDet.ticket ||
                                                  !ocargaDet.id_producto ||
                                                  !ocargaDet.operacion ||
                                                  !ocargaDet.llega_sacos 
                                                  }
                                        >
                                        { cargando ? (
                                        <CircularProgress color="inherit" size={24} />
                                        ) : ('GRABAR')
                                        }
                                      </Button>
                                </Grid>


			                      </Grid>
		                  </form>
		              </CardContent>
	            </Card>

  </Grid>      


  <Grid item xs={2}>
            
            <Card sx={{mt:3}}
                  style={{
                    background:'#1e272e',
                    padding:'0rem'
                  }}
                  //hidden={!editando}
                  >
                
                <CardContent >
                    <form onSubmit={handleSubmit} >

                            <TextField variant="outlined" 
                                      label="PESO Venta TN."
                                      //sx={{display:'block',margin:'.5rem 0'}}
                                      sx={{mt:2}}
                                      name="e_peso"
                                      value={ocargaDet.e_peso}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />

                            <TextField variant="filled" 
                                      label="MONTO S/"
                                      //sx={{display:'block',margin:'.5rem 0'}}
                                      sx={{mt:1}}
                                      name="e_monto"
                                      value={ocargaDet.e_monto}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'}
                                    }}
                            />

                            <TextField variant="filled" 
                                      label="RH RAZON"
                                      //sx={{display:'block',margin:'.5rem 0'}}
                                      sx={{mt:1}}
                                      name="e_razon_social"
                                      value={ocargaDet.e_razon_social}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />

                            <TextField variant="filled" 
                                      label="RH NUM"
                                      sx={{display:'block',margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="e_rh"
                                      value={ocargaDet.e_rh}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />
                            <TextField variant="filled" 
                                      label="INICIO"
                                      sx={{display:'block',margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="e_hora_ini"
                                      value={ocargaDet.e_hora_ini}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />
                            <TextField variant="filled" 
                                      label="FIN"
                                      sx={{display:'block',margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="e_hora_fin"
                                      value={ocargaDet.e_hora_fin}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />

                            <TextField variant="filled" 
                                      label="ESTIBADORES"
                                      sx={{display:'block',margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="e_estibadores"
                                      value={ocargaDet.e_estibadores}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />

                            <TextField variant="filled" 
                                      label="OBS."
                                      sx={{display:'block',margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="e_observacion"
                                      value={ocargaDet.e_observacion}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />

                    </form>
                </CardContent>
            </Card>
            
        </Grid>

  </Grid>

  </div>
    </>    
  )
}
