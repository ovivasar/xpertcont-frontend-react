import React from 'react';
import { useEffect, useState, useMemo, useCallback } from "react"
import { Button} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import FindIcon from '@mui/icons-material/FindInPage';
import UpdateIcon from '@mui/icons-material/UpdateSharp';
import Add from '@mui/icons-material/Add';

import IconButton from '@mui/material/IconButton';
import swal from 'sweetalert';
import Datatable, {createTheme} from 'react-data-table-component';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import '../App.css';
import 'styled-components';

import { useAuth0 } from '@auth0/auth0-react'; //new para cargar permisos luego de verificar registro en bd

export default function ProductoList() {
  //const back_host = process.env.BACK_HOST || "http://localhost:4000";
  const back_host = process.env.BACK_HOST || "https://alsa-backend-js-production.up.railway.app";  
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
      //background: '#cb4b16',
      background: '#1e272e',
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

  //experimento
  const [updateTrigger, setUpdateTrigger] = useState({});

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
	//const [data, setData] = useState(tableDataItems);
  const [registrosdet,setRegistrosdet] = useState([]);
  const [tabladet,setTabladet] = useState([]);  //Copia de los registros: Para tratamiento de filtrado

  //Permisos Zona Entrega Nivel 01 - Lista 
  const [permisosComando, setPermisosComando] = useState([]); //MenuComandos
  const {user, isAuthenticated } = useAuth0();
  const [pZonaEntrega0701, setPZonaEntrega0701] = useState(false); //Nuevo (Casi libre)
  const [pZonaEntrega0702, setPZonaEntrega0702] = useState(false); //Modificar (Restringido)
  const [pZonaEntrega0703, setPZonaEntrega0703] = useState(false); //Eliminar (Casi Nunca solo el administrador)

  const handleRowSelected = useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);
  
  const contextActions = useMemo(() => {
    //console.log("asaaa");
		const handleDelete = () => {
			var strSeleccionado;
      strSeleccionado = selectedRows.map(r => r.id_zonadet);
			confirmaEliminacion(strSeleccionado);
		};

    const handleUpdate = () => {
			var strSeleccionado;
      strSeleccionado = selectedRows.map(r => r.id_zonadet);
			navigate(`/zonadet/${strSeleccionado}/edit`);
		};

		return (
      <>
      { pZonaEntrega0703 ? 
        (      
			<Button key="delete" onClick={handleDelete} >
        ELIMINAR
        <DeleteIcon></DeleteIcon>
			</Button>
        ):
        (
          <span></span>
        )
      }

      { pZonaEntrega0702 ? 
        (      
			<Button key="modificar" onClick={handleUpdate} >
        MODIFICAR
      <UpdateIcon/>
			</Button>
        ):
        (
          <span></span>
        )
      }

      </>
		);
	}, [registrosdet, selectedRows, toggleCleared]);

  let actions;
  if (pZonaEntrega0701) {
    actions = (
    	<IconButton color="primary" 
        onClick = {()=> {
                      navigate(`/zonadet/new`);
                  }
                }
      >
    		<Add />
    	</IconButton>
      );
  } else {
    actions = null; // Opcionalmente, puedes asignar null u otro valor cuando la condición no se cumple
  }

  //////////////////////////////////////////////////////////
  //const [registrosdet,setRegistrosdet] = useState([]);
  //////////////////////////////////////////////////////////
  const cargaRegistro = async () => {
    const response = await fetch(`${back_host}/zonadet`);
    const data = await response.json();
    setRegistrosdet(data);
    setTabladet(data); //Copia para tratamiento de filtrado
  }
  //////////////////////////////////////
  const columnas = [
    { name:'CODIGO', 
      selector:row => row.id_zonadet,
      sortable: true,
      width: '110px'
      //key:true
    },
    { name:'NOMBRE', 
      selector:row => row.nombre,
      //width: '350px',
      sortable: true
    },
    { name:'DESCRIPCION', 
      selector:row => row.descripcion,
      width: '150px',
      sortable: true
    }
  ];
  
  const confirmaEliminacion = (id_registro)=>{
    swal({
      title:"Eliminar Zona",
      text:"Seguro ?",
      icon:"warning",
      buttons:["No","Si"]
    }).then(respuesta=>{
        if (respuesta){
          eliminarRegistroDet(id_registro);
          setToggleCleared(!toggleCleared);
          setRegistrosdet(registrosdet.filter(registrosdet => registrosdet.id_zonadet !== id_registro));
          
          setTimeout(() => { // Agrega una función para que se ejecute después del tiempo de espera
            setUpdateTrigger(Math.random());//experimento
          }, 200);
          //setUpdateTrigger(Math.random());//experimento
  
          swal({
            text:"Zona de Entrega: se ha eliminado con exito",
            icon:"success",
            timer:"2000"
          });
      }
    })
  }
 
  const navigate = useNavigate();
  //Para recibir parametros desde afuera
  //const params = useParams();

  const eliminarRegistroDet = async (id_registro) => {
    await fetch(`${back_host}/zonadet/${id_registro}`, {
      method:"DELETE"
    });
    //setRegistrosdet(registrosdet.filter(registrosdet => registrosdet.id_zonadet !== id_registro));
    //console.log(data);
  }
  const actualizaValorFiltro = e => {
    //setValorBusqueda(e.target.value);
    filtrar(e.target.value);
  }
  const filtrar=(strBusca)=>{
    var resultadosBusqueda = [];
    resultadosBusqueda = tabladet.filter((elemento) => {
      if (elemento.nombre.toString().toLowerCase().includes(strBusca.toLowerCase())
        ){
            return elemento;
        }
    });
    setRegistrosdet(resultadosBusqueda);
}

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
    // Verifica si existe el permiso de acceso 'Correntistas'
    tienePermiso = permisosData.some(permiso => permiso.id_comando === '07-01'); //Nuevo
    if (tienePermiso) {
      setPZonaEntrega0701(true);
    }
    tienePermiso = permisosData.some(permiso => permiso.id_comando === '07-02'); //Modificar
    if (tienePermiso) {
      setPZonaEntrega0702(true);
    }
    tienePermiso = permisosData.some(permiso => permiso.id_comando === '07-03'); //Eliminar
    if (tienePermiso) {
      setPZonaEntrega0703(true);
    }
    //setUpdateTrigger(Math.random());//experimento
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
        cargaPermisosMenuComando('07'); //Alimentamos el useState permisosComando
        //console.log(permisosComando);
      }

  },[updateTrigger, isAuthenticated, user])
  //////////////////////////////////////////////////////////

 return (
  <>
    <div> 
      <TextField fullWidth variant="outlined" color="success" size="small"
                                   label="FILTRAR"
                                   sx={{display:'block',
                                        margin:'.5rem 0'}}
                                   name="busqueda"
                                   placeholder='Zona'
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
      title="Gestion de Zonas de Entrega"
      theme="solarized"
      columns={columnas}
      data={registrosdet}
      selectableRows
      contextActions={contextActions}
      actions={actions}
			onSelectedRowsChange={handleRowSelected}
			clearSelectedRows={toggleCleared}
      //pagination
      selectableRowsComponent={Checkbox} // Pass the function only
      sortIcon={<ArrowDownward />}  
      dense={true}
      //customStyles={{ rows: { minHeight: '10px' } }}
    >
    </Datatable>

  </>
  );
}
