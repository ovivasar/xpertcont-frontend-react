import React from 'react';
import { useEffect, useState, useMemo, useCallback } from "react"
import { Grid, Button,useMediaQuery } from "@mui/material";
import { useNavigate,useParams } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import FindIcon from '@mui/icons-material/FindInPage';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Add from '@mui/icons-material/Add';
import ArchiveIcon from '@mui/icons-material/ArchiveRounded';

import IconButton from '@mui/material/IconButton';
import swal from 'sweetalert';
import Datatable, {createTheme} from 'react-data-table-component';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import '../App.css';
import 'styled-components';

//import { utils, writeFile } from 'xlsx';
import BotonExcelEstilizado from "./BotonExcelOCarga";

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import { useAuth0 } from '@auth0/auth0-react'; //new para cargar permisos luego de verificar registro en bd

export default function OCargaList() {
  //verificamos si es pantalla pequeña y arreglamos el grid de fechas
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  //Para recibir parametros desde afuera
  //const back_host = process.env.BACK_HOST || "http://localhost:4000";
  const back_host = process.env.BACK_HOST || "https://alsa-backend-js-production.up.railway.app";  
  const params = useParams();

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
    }
  }, 'dark');

  ///////////////////////
  /*function exportToExcel(data) {
    const newData = data.map((item) => ({
    ...item,
    cantidad: parseFloat(item.cantidad),
    peso_ticket: parseFloat(item.peso_ticket),
    sacos_ticket: parseFloat(item.sacos_ticket),
    e_peso01: parseFloat(item.e_peso01),
    e_monto01: parseFloat(item.e_monto01),
    }));

    const worksheet = utils.json_to_sheet(newData);

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Datos');
    writeFile(workbook, 'datos.xlsx');
  }*/
  //experimento
  const [updateTrigger, setUpdateTrigger] = useState({});

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
	
  const [registrosdet,setRegistrosdet] = useState([]); //Para vista principal
  const [tabladet,setTabladet] = useState([]);  //Copia de los registros: Para tratamiento de filtrado
  const [valorBusqueda, setValorBusqueda] = useState(""); //txt: rico filtrado
  const [regdet,setRegdet] = useState({ //Para envio minimo en Ejec
    ano:'',
    numero:'',
    item:''
  })

  const [valorVista, setValorVista] = useState("resumen");
  const [valorTipo, setValorTipo] = useState("P");
  const [eliminacionCompletada, setEliminacionCompletada] = useState(false);
  
  const [permisosComando, setPermisosComando] = useState([]); //MenuComandos
  const {user, isAuthenticated } = useAuth0();
  //Permisos OC Progr Nivel 01 - Lista Ordenes
  const [pProg0201_01, setPProg0201_01] = useState(false); //Nuevo (Casi libre)
  const [pProg0201_02, setPProg0201_02] = useState(false); //Visualizar (Restringido)
  const [pProg0201_03, setPProg0201_03] = useState(false); //ANULAR ORDEN
  const [pProg0201_04, setPProg0201_04] = useState(false); //ELIMINAR ORDEN
  
  //Permisos OC Ejecucion
  const [pProg0202_01, setPProg0202_01] = useState(false); //Nuevo (Casi libre)
  const [pProg0202_02, setPProg0202_02] = useState(false); //Visualizar (Restringido)
  const [pProg0202_03, setPProg0202_03] = useState(false); //ANULAR ORDEN
  const [pProg0202_04, setPProg0202_04] = useState(false); //ELIMINAR ORDEN

  const handleRowSelected = useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);
  
  const contextActions = useMemo(() => {
    //console.log("asaaa");
		const handleDelete = () => {
			var strFecha;
      var strAno;
      var strNumero;
      var nItem;
      var strTipo;
      strFecha = selectedRows.map(r => r.fecha);
      strNumero = selectedRows.map(r => r.numero);
      nItem = selectedRows.map(r => r.item);
      strTipo = selectedRows.map(r => r.tipo);

      const fechaArmada = new Date(strFecha); //ok con hora 00:00:00
      strAno = (fechaArmada.getFullYear()).toString(); 
  
			confirmaEliminacion(strAno,strNumero,nItem,strTipo);
		};


    const handleUpdateGrupo = () => {
			var strFecha;
      var strAno;
      var strNumero;
      var strTipo;
      var nItem;
      var sModo;
      strFecha = selectedRows.map(r => r.fecha);
      strNumero = selectedRows.map(r => r.numero);
      nItem = selectedRows.map(r => r.item);
      strTipo = selectedRows.map(r => r.tipo);

      const fechaArmada = new Date(strFecha); //ok con hora 00:00:00
      strAno = (fechaArmada.getFullYear()).toString(); 
      
      sModo = "editar";
      //navigate(`/ocargamovil/${strAno}/${strNumero}/${strTipo}/edit`);
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        console.log("Estás usando un dispositivo móvil!!");
        navigate(`/ocargamovil/${strAno}/${strNumero}/${strTipo}/edit`);
      } else {
        console.log("No estás usando un móvil");
        navigate(`/ocarga/${strAno}/${strNumero}/${strTipo}/edit`);
      }    

		};

  
		return (
      <>
      {
      valorVista !== "resumen" && (
      //Diferenciar si estamos en:
      // vista analisis para codigo eliminacion(Progr)  soloanalisis
      // vista ejecucion para codigo eliminacion(Ejec) ejecucion
      ((pProg0201_04 && valorVista==="analisis") || (pProg0202_04 && valorVista==="ejecucion")) && (
      <Button key="delete" onClick={handleDelete}>
        ELIMINAR <DeleteIcon />
      </Button>
      )
      )
      }
			
      {
      ((pProg0201_02 && valorVista==="analisis") || (pProg0202_02 && valorVista==="ejecucion")) && (
      <Button key="modificar_grupo" onClick={handleUpdateGrupo} >
       VISUALIZAR<EditRoundedIcon/>
			</Button>
      )
      }

      </>
		);
	}, [registrosdet, selectedRows, toggleCleared]);

  let actions;
  actions = (
    <>
      { //Solo para vista analisis boton nuevo
        valorVista === "analisis" && (
       //Y Solo para autorizados OC progr
       pProg0201_01 && (
       <Tooltip title="Nueva Orden Carga">
          <IconButton color="primary" 
            onClick = {()=> {
                      navigate(`/ocargadet01/${params.fecha_proceso}/${valorTipo}/new`)
                      }
                    }
          >
            <Add />
          </IconButton>
       </Tooltip>
      )
      )
      }
    
      {valorVista === "ejecucion" && (
      <Tooltip title="Registra Descarguio">
          <IconButton color="primary" 
            onClick = {()=> {
                      navigate(`/ocargadettraslado/${params.fecha_proceso}/${valorTipo}/new`)
                      }
                    }
          >
            <ArchiveIcon />
          </IconButton>
      </Tooltip>
      )
      }
    </>

  );

  const cargaRegistro = async () => {
    var strTipo="";
    var response;
    let strFechaIni="";
    let strFecha="";
    //La data, corresponde al mes de login
    //le cargaremos fecha actual si parametro no existe
    strFechaIni=params.fecha_ini;
    //console.log("Fecha ini:",strFechaIni);

    strFecha=params.fecha_proceso;
    
    if (params.fecha_proceso===null){
      let nPos=0;
      const fecha = new Date(); //ok fecha y hora actual
      strFecha = fecha.toISOString(); //formato texto
      nPos = strFecha.indexOf('T');
      strFecha = strFecha.substr(0,nPos);
    }
    
    //console.log("valor antes de cargar backend: ", valorVista);
    //al reves por mientras
    if (valorVista==="analisis"){
      strTipo= "P";
      response = await fetch(`${back_host}/ocargaplan/${strFechaIni}/${strFecha}/${strTipo}`);//tipo='p' programado
    }else{
      if (valorVista==="diario"){
        strTipo= "P";
        response = await fetch(`${back_host}/ocargaplan/${strFecha}/${strFecha}/${strTipo}`);
      }else{
        if (valorVista==="ejecucion"){
          strTipo= "E";
          //response = await fetch(`${back_host}/ocargaplantransb/${strFecha}`); //api anulado
          response = await fetch(`${back_host}/ocargaplan/${strFechaIni}/${strFecha}/${strTipo}`);//tipo='e' ejecucion
        }
        else{//El resumen nomas
          strTipo= "P";
          response = await fetch(`${back_host}/ocarga/${strFecha}`);
        }
      }
    }
    setValorTipo(strTipo);

    const data = await response.json();
    setRegistrosdet(data);
    setTabladet(data); //Copia para tratamiento de filtrado
  }
  //////////////////////////////////////
  const columnas = [
    { name:'FECHA', 
      selector:row => row.fecha,
      sortable: true,
      width: '80px',
      key:true
    },

    {
      name: "",
      cell: (row) => (
        <button
          style={{
            backgroundColor: (row.tipo === "P" && valorVista === "ejecucion") ? "red" : "green",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
          }}
          onClick={() => handleModEjecucion(row.ano,row.numero,row.item)}
        >
          
          {row.tipo === "P" ? "PROGRAM." : "EJECUCION"}
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },

    { name:'PEDIDO', 
      selector:row => row.pedido,
      width: '70px',
      sortable: true
    },
    { name:'ORDEN', 
      selector:row => row.numero,
      width: '70px',
      sortable: true
    },
    { name:'ESTADO', 
      selector:row => row.estado,
      width: '90px',
      sortable: true
    },
    { name:'CLIENTE', 
      selector:row => row.ref_razon_social,
      sortable: true
    },
    { name:'#', 
      selector:row => row.item,
      sortable: true,
      width: '40px'
    },
    { name:'CANT.', 
      selector:row => row.cantidad,
      width: '90px',
      sortable: true
    },
    { name:'UND', 
      selector:row => row.unidad_medida,
      sortable: true,
      width: '60px'
    },
    { name:'DESCRIPCION', 
      selector:row => row.descripcion,
      cell: (row) => (
        <Tooltip title={row.descripcion ? row.descripcion : ''}>
          <span>
          {row.descripcion ? row.descripcion.substring(0, 10) + '...' : ''}
          </span>
        </Tooltip>
              ),      
      sortable: true
    },
    { name:'OPERACION', 
      selector:row => row.operacion,
      width: '80px',
      sortable: true
    },
    { name:'SACOS', 
      selector:row => row.sacos_real,
      width: '70px',
      sortable: true
    },
    { name:'OBSERVACION', 
      selector:row => row.e_observacion,
      sortable: true
    },
    { name:'ENTREGA', 
      selector:row => row.zona_entrega,
      width: '70px',
      sortable: true
    },
    { name:'TICK #', 
      selector:row => row.ticket,
      sortable: true
    },
    { name:'TICK TN.', 
      selector:row => row.peso_ticket,
      sortable: true
    },
    { name:'TICK SACO', 
      selector:row => row.sacos_ticket,
      sortable: true
    },
    { name:'TRASL #', 
      selector:row => row.ticket_tras,
      sortable: true
    },
    { name:'TRASL TN.', 
      selector:row => row.peso_ticket_tras,
      sortable: true
    },
    { name:'TRASL SACO', 
      selector:row => row.sacos_ticket_tras,
      sortable: true
    },
    
    { name:'GUIA', 
      selector:row => row.guia01,
      sortable: true
    },
    { name:'LOTE ASIGNADO', 
      selector:row => row.lote_asignado,
      sortable: true
    },
    { name:'LOTE PROCEDENCIA', 
      selector:row => row.lote_procedencia,
      sortable: true
    },
    { name:'PESO V.', 
      selector:row => row.e_peso01,
      sortable: true
    },
    { name:'MONTO S/', 
      selector:row => row.e_monto01,
      sortable: true
    },
    { name:'RHH', 
      selector:row => row.e_razon_social,
      sortable: true
    },
    { name:'INICIO', 
      selector:row => row.e_hora_ini,
      sortable: true
    },
    { name:'FINAL', 
      selector:row => row.e_hora_fin,
      sortable: true
    },
    { name:'ESTIBAS', 
      selector:row => row.e_estibadores,
      sortable: true
    },
    { name:'TIPO', 
      selector:row => row.tipo,
      sortable: true,
    },
    { name:'AÑO', 
      selector:row => row.ano,
      sortable: true,
    },
    { name:'V.FECH', 
      selector:row => row.fecha_venta,
      sortable: true,
    },
    { name:'V.PREC', 
      selector:row => row.precio_unitario,
      sortable: true,
    },
    { name:'V.MONE', 
      selector:row => row.moneda,
      sortable: true,
    },
    { name:'V.IGV%', 
      selector:row => row.porc_igv,
      sortable: true,
    },

  ];

  const handleModEjecucion = async(p_ano,p_numero,p_item) => {
    //Solo ejecuta para vista ejecucion
    if (valorVista==="ejecucion") {

      await swal({
        title:"EJECUTAR OPERACION",
        text:"Seguro ?",
        icon:"warning",
        buttons:["No","Si"]
      }).then(respuesta=>{
          if (respuesta){
           
            ejecutaRegistroSeleccionado(p_ano,p_numero,p_item);

            setTimeout(() => { // Agrega una función para que se ejecute después del tiempo de espera
                setUpdateTrigger(Math.random());//actualiza la vista actual
            }, 200);
                       
            swal({
              text:"Operacion ejecutada con exito",
              icon:"success",
              timer:"2000"
            });
        }
      })

    }
  };
  const ejecutaRegistroSeleccionado = async (p_ano,p_numero,p_item) => {
      //Insertar ocargadet identico, pero con tipo = 'E'
      console.log(`Modificando a Ejecucion con orden: ${p_ano} ${p_numero} ${p_item}`);
      //armar un useState para el body
      regdet.ano =  p_ano;
      regdet.numero = p_numero;
      regdet.item = p_item;
      console.log(regdet);

      console.log(`${back_host}/ocargadetaddejec`);
      await fetch(`${back_host}/ocargadetaddejec`, {
        method: "POST",
        body: JSON.stringify(regdet),
        headers: {"Content-Type":"application/json"}
      });
  }

  const confirmaEliminacion = async(ano,numero,item,tipo) =>{
    //Eliminar por numeor y item, estamos en vista planilla
    await swal({
      title:"Eliminar Registro",
      text:"Seguro ?",
      icon:"warning",
      buttons:["No","Si"]
    }).then(respuesta=>{
        if (respuesta){
          
          //console.log(tipo);
          if (valorVista==='ejecucion') {
              if (tipo[0] === 'E') {
                eliminarRegistroSeleccionado(ano,numero[0],item[0]);
                
                setToggleCleared(!toggleCleared);
                setRegistrosdet(registrosdet.filter(
                                registrosdet => (registrosdet.ano !== ano &&
                                                registrosdet.numero !== numero[0] && 
                                                registrosdet.item !== item[0])
                                ));
                
                setTimeout(() => { // Agrega una función para que se ejecute después del tiempo de espera
                    setUpdateTrigger(Math.random());//experimento
                }, 200);
              
                swal({
                  text:"Orden de Carga se ha eliminado con exito",
                  icon:"success",
                  timer:"2000"
                });
              }
              else{
                swal({
                  text:"No se permite con Orden Programada, SOLO EJECUTADAS",
                  icon:"warning",
                  timer:"2000"
                });
              }
          }
          else{//en caso sea vista detalle o diario, solo programados, NO EJECUCION
              //DEBEMOS ALERTAR QUE SI TIENE EJECUTADO, NO SE PUEDE
              eliminarRegistroSeleccionado(ano,numero[0],item[0]);
                
              setToggleCleared(!toggleCleared);
              setRegistrosdet(registrosdet.filter(
                              registrosdet => (registrosdet.ano !== ano &&
                                              registrosdet.numero !== numero[0] && 
                                              registrosdet.item !== item[0])
                              ));
              
              setTimeout(() => { // Agrega una función para que se ejecute después del tiempo de espera
                  setUpdateTrigger(Math.random());//experimento
              }, 200);
            
              swal({
                text:"Orden de Carga se ha eliminado con exito",
                icon:"success",
                timer:"2000"
              });
          }
      }
    })
  }

  const navigate = useNavigate();

  const eliminarRegistroSeleccionado = async (ano,numero,item) => {
    await fetch(`${back_host}/ocargadet/${ano}/${numero}/${item}`, {
      method:"DELETE"
    });
    setEliminacionCompletada(true); 
    //console.log(data);
  }

  const actualizaValorFiltro = e => {
    setValorBusqueda(e.target.value);
    filtrar(e.target.value);
  }
  const actualizaValorVista = (e) => {
    setValorVista(e.target.value);
    //Lo dejaremos terminar el evento de cambio o change
    setUpdateTrigger(Math.random());//experimento para actualizar el dom
  }

  const filtrar=(strBusca)=>{
      var resultadosBusqueda = [];
      resultadosBusqueda = tabladet.filter((elemento) => {
        if (elemento.ref_razon_social.toString().toLowerCase().includes(strBusca.toLowerCase())
         || elemento.e_estibadores.toString().toLowerCase().includes(strBusca.toLowerCase())
         || elemento.descripcion.toString().toLowerCase().includes(strBusca.toLowerCase())
          ){
              return elemento;
          }
      });
      setRegistrosdet(resultadosBusqueda);
  }

  const customStyles = {
    rows: {
        style: {
            minHeight: '72px', // override the row height
        },
    },
    headCells: {
        style: {
            paddingLeft: '0px', // override the cell padding for head cells
            paddingRight: '8px',
        },
    },
    cells: {
        style: {
            paddingLeft: '0px', // override the cell padding for data cells
            paddingRight: '8px',
        },
    },
  };

  const cargaPermisosMenuComando = async(idMenu)=>{
    //Realiza la consulta a la API de permisos
    fetch(`https://alsa-backend-js-production.up.railway.app/seguridad/${user.email}/${idMenu}`, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(permisosData => {
      // Guarda los permisos en el estado
      setPermisosComando(permisosData);
      console.log(permisosComando);
      let tienePermiso;
      // Verifica si existe el permiso de acceso 'oc progr'
      tienePermiso = permisosData.some(permiso => permiso.id_comando === '0201-01'); //Nuevo
      if (tienePermiso) {
        setPProg0201_01(true);
      }
      tienePermiso = permisosData.some(permiso => permiso.id_comando === '0201-02'); //Visualizar
      if (tienePermiso) {
        setPProg0201_02(true);
      }
      tienePermiso = permisosData.some(permiso => permiso.id_comando === '0201-03'); //Anular
      if (tienePermiso) {
        setPProg0201_03(true);
      }
      tienePermiso = permisosData.some(permiso => permiso.id_comando === '0201-04'); //Eliminar
      if (tienePermiso) {
        setPProg0201_04(true);
      }

      // Verifica si existe el permiso de acceso 'oc ejec'
      tienePermiso = permisosData.some(permiso => permiso.id_comando === '0202-01'); //Nuevo
      if (tienePermiso) {
        setPProg0202_01(true);
      }
      tienePermiso = permisosData.some(permiso => permiso.id_comando === '0202-02'); //Visualizar
      if (tienePermiso) {
        setPProg0202_02(true);
      }
      tienePermiso = permisosData.some(permiso => permiso.id_comando === '0202-03'); //Anular
      if (tienePermiso) {
        setPProg0202_03(true);
      }
      tienePermiso = permisosData.some(permiso => permiso.id_comando === '0202-04'); //Eliminar
      if (tienePermiso) {
        setPProg0202_04(true);
      }
      
    })
    .catch(error => {
      console.log('Error al obtener los permisos:', error);
    });
  }
  //////////////////////////////////////////////////////////
  useEffect( ()=> {
      cargaRegistro();

      //NEW codigo para autenticacion y permisos de BD
      if (isAuthenticated && user && user.email) {
        // cargar permisos de sistema
        cargaPermisosMenuComando('02'); //Alimentamos el useState permisosComando
        //console.log(permisosComando);
      }

  },[updateTrigger, isAuthenticated, user])
  //////////////////////////////////////////////////////////

 return (
  <>
  <Grid container
        direction={isSmallScreen ? 'column' : 'row'}
        //alignItems={isSmallScreen ? 'center' : 'center'}
        justifyContent={isSmallScreen ? 'center' : 'center'}
  >
    <Grid item xs={10}>
      <TextField fullWidth variant="outlined" color="warning" size="small"
                                   label="FILTRAR"
                                   sx={{display:'block',
                                        margin:'.0rem 0'}}
                                   name="busqueda"
                                   placeholder='Cliente   Producto   Estibaje'
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
    </Grid>
    <Grid item xs={0.9}>    
      <BotonExcelEstilizado registrosdet={registrosdet} />
    </Grid>
    <Grid item xs={1.1}>    
      <Button variant='contained' 
              fullWidth
              color='warning' 
              sx={{display:'block',
              margin:'.0rem 0'}}
              >
      PDF-R
      </Button>
    </Grid>
  </Grid>

    <div>
    <ToggleButtonGroup
      color="warning"
      value={valorVista}
      exclusive
      onChange={actualizaValorVista}
      aria-label="Platform"
    >
      <ToggleButton value="resumen">Resumen Progr.</ToggleButton>
      <ToggleButton value="analisis">Analisis Progr.</ToggleButton>
      <ToggleButton value="diario">Diario Progr.</ToggleButton>
      <ToggleButton value="ejecucion">Analisis Ejecucion</ToggleButton>
    </ToggleButtonGroup>      
    </div>
    
    <Datatable
      title="Registro - Ordenes Carga"
      theme="solarized"
      columns={columnas}
      data={registrosdet}
      selectableRows
      contextActions={contextActions}
      actions={actions}
			onSelectedRowsChange={handleRowSelected}
			clearSelectedRows={toggleCleared}
      highlightOnHover
      pagination
      paginationPerPage={30}
      paginationRowsPerPageOptions={[30, 50, 100]}

      selectableRowsComponent={Checkbox} // Pass the function only
      sortIcon={<ArrowDownward />}  
      dense={true}
      customStyles={customStyles}
    >

    </Datatable>

  </>
  );
}
