import {Grid,Card,CardContent,TextField,Button,CircularProgress, Checkbox, Typography} from '@mui/material'
import { useState,useEffect, useMemo, useCallback } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import FindIcon from '@mui/icons-material/FindInPage';
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
    { name:'AÑO', 
      selector:row => row.pedido,
      sortable: true
    },
    { name:'PEDIDO', 
      selector:row => row.pedido,
      sortable: true
    },
    { name:'DOC.IDENT', 
      selector:row => row.ref_documento_id,
      sortable: true
    },
    { name:'CLIENTE', 
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
    { name:'CANTIDAD', 
      selector:row => row.cantidad,
      sortable: true,
      key:true
    },
    { name:'PLACA VACIO', 
      selector:row => row.tr_placa,
      sortable: true,
      key:true
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
    { name:'OPERACION', 
      selector:row => row.operacion,
      sortable: true,
      key:true
    },
    { name:'PLACA CARGADO', 
      selector:row => row.tr_placacargado,
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
		};


		return (
      <>
			<Button key="seleccionado" onClick={handleSeleccionado} >
       ACEPTAR <EditRoundedIcon/>
			</Button>
			
      </>
		);
	}, [registrosdet, selectedRows, toggleCleared]);

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
    //setTabladet(data); //Copia para tratamiento de filtrado
  }

  //Fin Seccion Modal
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
      ocargaDet.ref_razon_social = datosjson.data.nombre_o_razon_social;
  };
  
  /*let txtRazonSocialRef = useRef();
  function razonSocialFocus(){
    const input =  txtRazonSocialRef.current;
    input.focus();
  }*/
  ////////////////////////////////////////////////////////////////////////////////////////
  //Select(Combos) para llenar, desde tabla
  const [zonaentrega_select,setZonaEntregaSelect] = useState([]);
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
      e_observacion:''
  })

  const handleSubmit = async(e) => {
    e.preventDefault();
    setCargando(true);
    
    //Cambiooo para controlar Edicion
    if (editando){
      console.log("actualizando");
      await fetch(`${back_host}/ocargadet02/${params.ano}/${params.numero}/${params.item}`, {
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
    
    //console.log(fecha_actual);
  },[params.ano, updateTrigger]);

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
                e_observacion:data.e_observacion
                });
    //console.log(data);
    //console.log(params.modo);
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
                //setAbierto(false);
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
                                DATOS DE ORDEN (ALMACEN)
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


                                <TextField variant="outlined" 
                                    label="SACOS REAL"
                                    size="small"
                                    sx={{mt:1}}
                                    fullWidth
                                    name="sacos_real"
                                    value={ocargaDet.sacos_real}
                                    onChange={handleChange}
                                    inputProps={{ style:{color:'white', textAlign: 'center'} }}
                                    InputLabelProps={{ style:{color:'white'} }}
                                />
                                <TextField variant="outlined" 
                                    label="LOTE PROCED."
                                    size="small"
                                    sx={{mt:1}}
                                    fullWidth
                                    name="lote_procedencia"
                                    value={ocargaDet.lote_procedencia}
                                    onChange={handleChange}
                                    inputProps={{ style:{color:'white', textAlign: 'center'} }}
                                    InputLabelProps={{ style:{color:'white'} }}
                                />
                                <TextField variant="outlined" 
                                    label="LOTE ASIGN."
                                    size="small"
                                    sx={{mt:1}}
                                    fullWidth
                                    name="lote_asignado"
                                    value={ocargaDet.lote_asignado}
                                    onChange={handleChange}
                                    inputProps={{ style:{color:'white', textAlign: 'center'} }}
                                    InputLabelProps={{ style:{color:'white'} }}
                                />
                                <TextField variant="outlined" 
                                    label="ESTIBADORES"
                                    size="small"
                                    sx={{mt:1}}
                                    fullWidth
                                    name="e_estibadores"
                                    value={ocargaDet.e_estibadores}
                                    onChange={handleChange}
                                    inputProps={{ style:{color:'white', textAlign: 'center'} }}
                                    InputLabelProps={{ style:{color:'white'} }}
                                />
                                <TextField variant="outlined" 
                                    label="HORA INICIO"
                                    size="small"
                                    sx={{mt:1}}
                                    fullWidth
                                    name="e_hora_ini"
                                    value={ocargaDet.e_hora_ini}
                                    onChange={handleChange}
                                    inputProps={{ style:{color:'white', textAlign: 'center'} }}
                                    InputLabelProps={{ style:{color:'white'} }}
                                />
                                <TextField variant="outlined" 
                                    label="HORA FIN"
                                    size="small"
                                    sx={{mt:1}}
                                    fullWidth
                                    name="e_hora_fin"
                                    value={ocargaDet.e_hora_fin}
                                    onChange={handleChange}
                                    inputProps={{ style:{color:'white', textAlign: 'center'} }}
                                    InputLabelProps={{ style:{color:'white'} }}
                                />
                                <TextField variant="outlined" 
                                    label="OBSERVACIONES"
                                    size="small"
                                    sx={{mt:1}}
                                    fullWidth
                                    name="e_observacion"
                                    value={ocargaDet.e_observacion}
                                    onChange={handleChange}
                                    inputProps={{ style:{color:'white', textAlign: 'center'} }}
                                    InputLabelProps={{ style:{color:'white'} }}
                                />


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
