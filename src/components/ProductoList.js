import React from 'react';
import { useEffect, useState, useMemo, useCallback } from "react"
import { Button} from "@mui/material";
import { useNavigate,useParams } from "react-router-dom";
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

  const handleRowSelected = useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);
  
  const contextActions = useMemo(() => {
    //console.log("asaaa");
		const handleDelete = () => {
			var strSeleccionado;
      strSeleccionado = selectedRows.map(r => r.id_producto);
			confirmaEliminacion(strSeleccionado);
		};

    const handleUpdate = () => {
			var strSeleccionado;
      strSeleccionado = selectedRows.map(r => r.id_producto);
			navigate(`/producto/${strSeleccionado}/edit`);
		};

		return (
      <>
			<Button key="delete" onClick={handleDelete} >
        ELIMINAR
        <DeleteIcon></DeleteIcon>
			</Button>
			<Button key="modificar" onClick={handleUpdate} >
        MODIFICAR
      <UpdateIcon/>
			</Button>

      </>
		);
	}, [registrosdet, selectedRows, toggleCleared]);

  const actions = (
    	<IconButton color="primary" 
        onClick = {()=> {
                      navigate(`/producto/new`);
                  }
                }
      >
    		<Add />
    	</IconButton>
  );

  //////////////////////////////////////////////////////////
  //const [registrosdet,setRegistrosdet] = useState([]);
  //////////////////////////////////////////////////////////
  const cargaRegistro = async () => {
    const response = await fetch(`${back_host}/producto`);
    const data = await response.json();
    setRegistrosdet(data);
    setTabladet(data); //Copia para tratamiento de filtrado
  }
  //////////////////////////////////////
  const columnas = [
    { name:'CODIGO', 
      selector:row => row.id_producto,
      sortable: true,
      width: '110px'
      //key:true
    },
    { name:'NOMBRE', 
      selector:row => row.nombre,
      //width: '350px',
      sortable: true
    },
    { name:'UNIDAD', 
      selector:row => row.id_unidad_medida,
      width: '150px',
      sortable: true
    }
  ];
  
  const confirmaEliminacion = (id_registro)=>{
    swal({
      title:"Eliminar Producto",
      text:"Seguro ?",
      icon:"warning",
      buttons:["No","Si"]
    }).then(respuesta=>{
        if (respuesta){
          eliminarRegistroDet(id_registro);
          setToggleCleared(!toggleCleared);
          setRegistrosdet(registrosdet.filter(registrosdet => registrosdet.id_producto !== id_registro));
          setUpdateTrigger(Math.random());//experimento
  
          swal({
            text:"Producto se ha eliminado con exito",
            icon:"success",
            timer:"2000"
          });
      }
    })
  }
 
  const navigate = useNavigate();
  //Para recibir parametros desde afuera
  const params = useParams();

  const eliminarRegistroDet = async (id_registro) => {
    await fetch(`${back_host}/producto/${id_registro}`, {
      method:"DELETE"
    });
    //setRegistrosdet(registrosdet.filter(registrosdet => registrosdet.id_producto !== id_registro));
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

  //////////////////////////////////////////////////////////
  useEffect( ()=> {
      cargaRegistro();
  },[updateTrigger])
  //////////////////////////////////////////////////////////

 return (
  <>
    <div> 
      <TextField fullWidth variant="outlined" color="success" size="small"
                                   label="FILTRAR"
                                   sx={{display:'block',
                                        margin:'.5rem 0'}}
                                   name="busqueda"
                                   placeholder='Producto'
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
      title="Gestion de Productos"
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

    >
    </Datatable>

  </>
  );
}
