import {Grid,TextField} from '@mui/material'
import {BrowserRouter,Routes,Route} from "react-router-dom";
import {Container,useMediaQuery} from "@mui/material";
import Menu from "./components/NavBar";
import ZonaList from "./components/ZonaList";
import ZonaDetList from "./components/ZonaDetList";
import ZonaForm from "./components/ZonaForm";
import ZonaDetForm from "./components/ZonaDetForm";
import CorrentistaForm from "./components/CorrentistaForm";
import CorrentistaList from "./components/CorrentistaList";
import VentaForm from "./components/VentaForm";
import VentaList from "./components/VentaList";
import VentaFormDet from "./components/VentaFormDet";
import VentaFormDetTrans from "./components/VentaFormDetTrans"; //neww
import ProductoList from "./components/ProductoList";
import ProductoForm from "./components/ProductoForm";
import OCargaList from "./components/OCargaList";
import OCargaForm from "./components/OCargaForm";
import OCargaFormDet from "./components/OCargaFormDet";
import OCargaFormDet01 from "./components/OCargaFormDet01";
import OCargaFormDet02 from "./components/OCargaFormDet02";
import OCargaFormDet03 from "./components/OCargaFormDet03";
import ContabilidadesList from "./components/ContabilidadesList";
import OCargaFormTraslado from "./components/OCargaFormTraslado";

import VentaFormMovil from "./components/VentaFormMovil";
import VentaFormDetTraslado from "./components/VentaFormDetTraslado";

import SeguridadList from "./components/SeguridadList";

import Inicio from "./components/Inicio";
import { useState,useEffect } from 'react';
import OCargaFormMovil from './components/OCargaFormMovil';
//import LoginBoton from "./components/LoginBoton" //new
//import LogoutBoton from "./components/LogoutBoton" //new
//import LoginPerfil from "./components/LoginPerfil" //new


function App() {
  //verificamos si es pantalla pequeña y arreglamos el grid de fechas
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  const [fecha_ini, setFechaIni] = useState("");
  const [fecha_proceso, setFechaProceso] = useState("");
  const handleChange = e => {
    //Para todos los demas casos ;)
    if (e.target.name==="fecha_ini"){
      setFechaIni(e.target.value);  
    }else{
      setFechaProceso(e.target.value);
    }
  }
  useEffect( ()=> {
      //procesar fecha actual al inicio
      const fechaActual = new Date();
      let ano = fechaActual.getFullYear();
      let mes = fechaActual.getMonth()+1;
      let dia = fechaActual.getDate();      
      let strMes = mes.toString().padStart(2,'0');
      let strDia = dia.toString().padStart(2,'0');
      //let strFecha = strDia + "-" + strMes + "-" + ano; //no valido cuando empieza por dia
      let strFecha = ano + "-" + strMes + "-" + strDia; //OK valido empieza por año
      //console.log(strFecha)
      setFechaProceso(strFecha);

      let strFechaIni = ano + "-" + strMes + "-" + "01"; //OK valido empieza por año
      setFechaIni(strFechaIni);
  },[]);

  return (
    <BrowserRouter>

      <div>
      <Menu fecha_ini={fecha_ini} fecha_proceso={fecha_proceso}>
      
      </Menu>
      
      <Grid container spacing={0}
          direction={isSmallScreen ? 'column' : 'row'}
          alignItems={isSmallScreen ? 'center' : 'center'}
          justifyContent={isSmallScreen ? 'center' : 'center'}
      >
          <Grid item xs={2} sm={2}>
            <TextField variant="outlined" 
                //label="fecha"
                sx={{display:'block',
                    margin:'.0rem 0'}}
                name="fecha_ini"
                size="small"
                type="date"
                value={fecha_ini}
                onChange={handleChange}
                inputProps={{ style:{color:'white'} }}
                InputLabelProps={{ style:{color:'white'} }}
              />
          </Grid>
          <Grid item xs={2} sm={2}>
            <TextField variant="outlined" 
                //label="fecha"
                sx={{display:'block',
                    margin:'.0rem 0'}}
                name="fecha_proceso"
                size="small"
                type="date"
                value={fecha_proceso}
                onChange={handleChange}
                inputProps={{ style:{color:'white'} }}
                InputLabelProps={{ style:{color:'white'} }}
              />
          </Grid>

      </Grid>

      <Container>
        <Routes>
          
          <Route path="/ocargadet/:fecha_proceso/:ano/:numero/:item/:modo/edit" element={<OCargaFormDet />} />
          <Route path="/ocargadet/:fecha_proceso/:ano/:numero/:item/:modo/clon" element={<OCargaFormDet />} />

          <Route path="/ocarga/:ano/:numero/:tipo/edit" element={<OCargaForm />} />
          <Route path="/ocargamovil/:ano/:numero/:tipo/edit" element={<OCargaFormMovil />} />
          <Route path="/ocargadet/:fecha_ini/:fecha_proceso" element={<OCargaList />} />
          
          { /* Agregar desde Panel (un registro01 Libre)
               Agregar Clonado desde Panel (un registro01 con Numero Orden y datos adicionales)
               Agregar desde Form Orden (un registro01 con Numero Orden)   */ }
          <Route path="/ocargadet01/:fecha_proceso/:tipo/new" element={<OCargaFormDet01 />} /> 
          <Route path="/ocargadet01/:fecha_proceso/:ano/:numero/:item/:modo/clon" element={<OCargaFormDet01 />} />
          <Route path="/ocargadet01/:fecha_proceso/:ano/:numero/:tipo/:agrega/new" element={<OCargaFormDet01 />} />

          <Route path="/ocargadet01/:fecha_proceso/:ano/:numero/:item/:modo/edit" element={<OCargaFormDet01 />} />
          <Route path="/ocargadet02/:fecha_proceso/:ano/:numero/:item/:modo/edit" element={<OCargaFormDet02 />} />
          <Route path="/ocargadet03/:fecha_proceso/:ano/:numero/:item/:modo/edit" element={<OCargaFormDet03 />} />
          
          <Route path="/ocargadettraslado/:fecha_proceso/:tipo/new" element={<OCargaFormTraslado />} />

          <Route path="/contabilidades" element={<ContabilidadesList />} />
          {/*  modo=edit, modo=clon  */}

          <Route path="/ventadettraslado/:cod/:serie/:num/:elem/:fecha/new" element={<VentaFormDetTraslado />} />
          <Route path="/ventadettraslado/:cod/:serie/:num/:elem/:item/edit" element={<VentaFormDetTraslado />} /> 

          <Route path="/ventadet/:cod/:serie/:num/:elem/:fecha/new" element={<VentaFormDet />} />
          <Route path="/ventadet/:cod/:serie/:num/:elem/:item/edit" element={<VentaFormDet />} /> 
          <Route path="/ventadettrans/:cod/:serie/:num/:elem/:item/edit" element={<VentaFormDetTrans />} /> 
          <Route path="/venta/:fecha_ini/:fecha_proceso/:email" element={<VentaList />} />
          <Route path="/venta/new" element={<VentaForm />} />
          <Route path="/ventamovil/new" element={<VentaFormMovil />} />
          <Route path="/venta/:cod/:serie/:num/:elem/edit" element={<VentaForm />} /> 
          <Route path="/ventamovil/:cod/:serie/:num/:elem/edit" element={<VentaFormMovil />} /> 

          <Route path="/correntista" element={<CorrentistaList />} />          
          <Route path="/correntista/new" element={<CorrentistaForm />} />
          <Route path="/correntista/:id/edit" element={<CorrentistaForm />} /> 

          <Route path="/zonadet" element={<ZonaDetList />} />
          <Route path="/zonadet/:id" element={<ZonaDetList />} />
          <Route path="/zonadet/new" element={<ZonaDetForm />} />
          <Route path="/zonadet/:id/edit" element={<ZonaDetForm />} /> 

          <Route path="/" element={<Inicio />} />
          <Route path="/zona" element={<ZonaList />} />
          <Route path="/zona/new" element={<ZonaForm />} />
          <Route path="/zona/:id/edit" element={<ZonaForm />} />

          <Route path="/producto" element={<ProductoList />} />
          <Route path="/producto/:id/edit" element={<ProductoForm />} />
          <Route path="/producto/new" element={<ProductoForm />} />

          <Route path="/seguridad" element={<SeguridadList />} />          
          {/*Edit Route */}
        </Routes>
      </Container>
      
      </div>
    </BrowserRouter>


    );
}

export default App;
