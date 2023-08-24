import {Modal,Grid,Card,CardContent,TextField,Button,CircularProgress,Select, MenuItem, InputLabel, FormControl, Checkbox, Typography} from '@mui/material'
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
         || elemento.pedido.toString().toLowerCase().includes(strBusca.toLowerCase())
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
    { name:'RAZON_SOCIAL', 
      selector:row => row.ref_razon_social,
      sortable: true
    },
    { name:'PRODUCTO', 
      selector:row => row.nombre,
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
    { name:'CARGA', 
      selector:row => row.carga,
      sortable: true,
      key:true
    },
    { name:'PLACA VACIO', 
      selector:row => row.tr_placa,
      sortable: true,
      key:true
    },
    { name:'SALDO', 
      selector:row => row.saldo,
      sortable: true,
      key:true
    },
    { name:'UNIDAD', 
      selector:row => row.unidad_medida,
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
      var strCantidad;
      var strPlacaVacio;
      var strUnidadMedida;
      var strTrFechaCarga;

      strPedido = selectedRows.map(r => r.pedido);
      strIdProducto = selectedRows.map(r => r.id_producto);
      strProducto = selectedRows.map(r => r.nombre);
      strIdZonaEntrega = selectedRows.map(r => r.id_zona_entrega);
      strZonaEntrega = selectedRows.map(r => r.zona_entrega);
      strDocumentoId = selectedRows.map(r => r.ref_documento_id);
      strRazonSocial = selectedRows.map(r => r.ref_razon_social);
      strCantidad = selectedRows.map(r => r.saldo);
      strPlacaVacio = selectedRows.map(r => r.tr_placa);
      strUnidadMedida = selectedRows.map(r => r.unidad_medida); //new
      strTrFechaCarga = selectedRows.map(r => r.carga); //new

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
      ocargaDet.saldo = strCantidad[0]; //referencial para avisar y no sobrepasar monto
      ocargaDet.cantidad = strCantidad[0];
      ocargaDet.tr_placa = strPlacaVacio[0];

      ocargaDet.unidad_medida = strUnidadMedida[0]; //new
      ocargaDet.carga = strTrFechaCarga[0]; //new

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
    
    //PENDIENTES 
    //const response = await fetch(`${back_host}/ventadetpendientes/${strFecha}`);
    var response;
    if (params.tipo==="P"){
      response = await fetch(`${back_host}/ventadetpendientes/${strFecha}`);  
    }else{
      //Areglar solo deben ir parametros ano,numero ... debe mostrar lo pendiente por cliente y producto en caso quede saldo por ejecutar
      console.log(`${back_host}/ocargadetpendientesejec/${params.ano}/${params.numero}`);
      response = await fetch(`${back_host}/ocargadetpendientesejec/${params.ano}/${params.numero}`);
    }
    const data = await response.json();
    setRegistrosdet(data);
    setTabladet(data); //Copia para tratamiento de filtrado
    console.log(ocargaDet);
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
      
      pedido:'',  //ventas: ref_cod, ref_serie, ref_numero, item
      ref_documento_id:'', //ventas
      ref_razon_social:'',  //ventas
      id_producto:'',   //ventas
      descripcion:'',   //ventas
      unidad_medida:'',   //ventas 
      saldo:'',      //solo referencial
      cantidad:'',      //ventas
      operacion:'',     //ocarga-fase01
      tr_placa:'',      //ventas
      tr_placacargado:'', //ocarga-fase01
      carga:'',      //tr_fecha_carga(proyectado) solo referencial, para verificar mostrar alerta en caso > fecha_carga
      id_zona_entrega:'', //ventas referencial, no visible
      zona_entrega:'',    //ventas referencial, no visible

      tipo:'',    //P=Programacion  E=Ejecucion  NEWWWW
      registrado:'1',
      op_observacion:'' //New para 1era parte DAtos Operacion
  })

  const handleSubmit = async(e) => {
    e.preventDefault();
    setCargando(true);
    
    //cargar el parametro antes de la transaccion con BD postgres: params.tipo
    
    ocargaDet.tipo = params.tipo;
    //setocargaDet({...ocargaDet, tipo: params.tipo});
    //setocargaDet(prevState => ({ ...prevState, tipo: params.tipo }));
    console.log("params tipo: ",params.tipo);
    console.log("tipo: ",ocargaDet.tipo);

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
        await fetch(`${back_host}/ocargadet01/${params.ano}/${params.numero}/${params.item}`, {
          method: "PUT",
          body: JSON.stringify(ocargaDet),
          headers: {"Content-Type":"application/json"}
        });
      }
    }else{
      
      console.log(ocargaDet);
      //Insertar new orden detalle
      if (ocargaDet.numero==="") {
          console.log("insertando nueva ORDEN CARGA", ocargaDet);
          await fetch(`${back_host}/ocargadet`, {
            method: "POST",
            body: JSON.stringify(ocargaDet),
            headers: {"Content-Type":"application/json"}
          });
      }else {
          //Agregar orden detalle (con referencia de numero carga)
          console.log("agregando o clonado adicional");
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
    //navigate(`/ocargadet/${params.fecha_proceso}`);
    window.history.back();
    
    //console.log(zona);
  };
  
  //Aqui se leen parametros en caso lleguen
  useEffect( ()=> {
    //Si tiene parametros, es editar (o clonar)
    if (params.modo){
      mostrarOCarga(params.ano,params.numero,params.item);
      //Luego se establece editando = true
    }  
    
    //Caso especial cuando se agrega desde interior de Form, sin clonar solo con el numero
    if (params.agrega){
        //Solo enviarmos el numero 
      setocargaDet({  
        id_empresa:'1',  
        id_punto_venta:'1001',  
        ano:params.ano,
        numero:params.numero,
        //tipo:params.tipo,
        registrado:'1'
        });
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
    console.log(`${back_host}/ocargadet/${ano}/${numero}/${item}`);
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

                ref_documento_id:data.ref_documento_id,
                ref_razon_social:data.ref_razon_social,
                id_producto:data.id_producto,
                descripcion:data.descripcion,
                cantidad:data.cantidad, 
                unidad_medida:data.unidad_medida, //new
                op_observacion:data.op_observacion, //new Agosto2023
                operacion:data.operacion,
                tr_placa:data.tr_placa, 
                tr_placacargado:data.tr_placacargado, 
                carga:data.carga, //new solo MUestra tr_fecha_carga
                id_zona_entrega:data.id_zona_entrega,
                zona_entrega:data.zona_entrega,
                tipo:data.tipo,
                
                registrado:data.registrado
                });
    console.log(data);
    
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
                    placeholder='Cliente   Producto  Pedido'
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
          pagination={true}
          paginationPerPage={8} // Número de filas por página

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
                                <Typography fontSize={15} marginTop="0.5rem" 
                                style={{color:'#F39C12'}}
                                >
                                DATOS DE ORDEN (CARGA/DESCARGA)
                                </Typography>

                                <Grid container spacing={0.5}>
                                    <Grid item xs={10}>
                                        <TextField variant="outlined" 
                                              label="PEDIDO"
                                              fullWidth
                                              sx={{mt:1}}
                                              name="pedido"
                                              //ref={txtRazonSocialRef} //para el rico foco solo con input funciona
                                              value={ocargaDet.pedido}
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
                                            cargaArregloPopUp();//Info del modal
                                            setAbierto(true);
                                            }
                                          }
                                        >
                                          <FindIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                    
                                <Typography marginTop="0.5rem" variant="subtitle" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                CLIENTE : {ocargaDet.ref_razon_social}
                                </Typography>

                                <Typography marginTop="0.5rem" variant="subtitle" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                PRODUCTO : {ocargaDet.descripcion}
                                </Typography>

                                <Typography marginTop="0.5rem" variant="subtitle" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                SALDO : {ocargaDet.saldo}
                                </Typography>

                                <Typography marginTop="0.5rem" variant="subtitle" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                UNIDAD : {ocargaDet.unidad_medida}
                                </Typography>

                                <Typography marginTop="0.5rem" variant="subtitle" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                PLACA VACIO : {ocargaDet.tr_placa}
                                </Typography>

                                <Typography marginTop="0.5rem" variant="subtitle" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                F. PROYECTADA : {ocargaDet.carga}
                                </Typography>


                                <TextField variant="outlined" 
                                      label="CANTIDAD"
                                      //sx={{mt:2}}
                                      sx={{ mt:2,
                                        typography: (theme) => ({
                                          fontSize: 5,
                                        }),
                                      }}                                      
                                      fullWidth
                                      name="cantidad"
                                      value={ocargaDet.cantidad}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                                />

                                <TextField variant="outlined" 
                                    //label="fecha"
                                    //size="small"
                                    sx={{mt:1}}
                                    fullWidth
                                    name="fecha2"
                                    type="date"
                                    //format="yyyy/MM/dd"
                                    value={ocargaDet.fecha2}
                                    onChange={handleChange}
                                    inputProps={{ style:{color:'white'} }}
                                    InputLabelProps={{ style:{color:'white'} }}
                                />

                                <TextField variant="outlined" 
                                      label="ORDEN"
                                      sx={{mt:1}}
                                      fullWidth
                                      name="numero"
                                      //value={ocargaDet.numero || numeroOrden}
                                      value={ocargaDet.numero}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                                />

                                <FormControl fullWidth>
                                  <InputLabel id="demo-simple-select-label" 
                                                    inputProps={{ style:{color:'white'} }}
                                                    InputLabelProps={{ style:{color:'white'} }}
                                                    sx={{mt:1, color:'#5DADE2'}}
                                  >OPERACION [SELEC.]</InputLabel>
                                  <Select
                                          labelId="operacion_select"
                                          size="small"
                                          fullWidth
                                          id={ocargaDet.operacion}
                                          value={ocargaDet.operacion}
                                          name="operacion"
                                          sx={{display:'block',
                                          margin:'.9rem 0', color:"white"}}
                                          label="Operacion"
                                          onChange={handleChange}
                                          
                                        >
                                          {   
                                              operacion_select.map(elemento => (
                                              <MenuItem key={elemento.operacion} value={elemento.operacion}
                                              //sx={{color: "black",...menuItemStyle}}
                                              sx={{
                                                //backgroundColor: "lightsteelblue",
                                                color:"black"
                                                }}
                                              >
                                                {elemento.operacion}
                                              </MenuItem>)) 
                                          }
                                  </Select>
                                </FormControl>

                                <TextField variant="outlined" 
                                      label="PLACA CARGADO"
                                      fullWidth
                                      sx={{mt:0}}
                                      name="tr_placacargado"
                                      value={ocargaDet.tr_placacargado}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                                />

                                <TextField variant="outlined" 
                                      label="OBSERVACIONES OP"
                                      fullWidth
                                      sx={{mt:0}}
                                      name="op_observacion"
                                      value={ocargaDet.op_observacion}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                                />

                                <Button variant='contained' 
                                    color='primary' 
                                    sx={{mt:1}}
                                    type='submit'
                                    disabled={!ocargaDet.fecha2 || 
                                              !ocargaDet.operacion ||
                                              !ocargaDet.tr_placacargado
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
