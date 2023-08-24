import {Grid,Card,CardContent,Typography,TextField,Button,CircularProgress,Select,MenuItem,InputLabel,Box,FormControl, List,ListItem,ListItemText,Dialog,DialogContent,DialogTitle} from '@mui/material'
import {useState,useEffect,useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import AddBoxRoundedIcon from '@mui/icons-material/ShoppingCart';
import BorderColorIcon from '@mui/icons-material/QrCodeRounded';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import FindIcon from '@mui/icons-material/FindInPage';

import DeleteIcon from '@mui/icons-material/DeleteForeverRounded';
import IconButton from '@mui/material/IconButton';
import LocalShippingIcon from '@mui/icons-material/LocalShippingTwoTone';
import { useAuth0 } from '@auth0/auth0-react'; //new para cargar permisos luego de verificar registro en bd
import logo from '../alsa.png';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import numeral from 'numeral';

import swal from 'sweetalert';

export default function VentaFormMovil() {
  //const back_host = process.env.BACK_HOST || "http://localhost:4000";
  const back_host = process.env.BACK_HOST || "https://alsa-backend-js-production.up.railway.app";  
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  //Select(Combos) para llenar, desde tabla
  const [operacion_select] = useState([
    {tipo_op:'VENTA'},
    {tipo_op:'TRASLADO'}
  ]);

  const [zona_select,setZonaSelect] = useState([]);
  const [vendedor_select,setVendedorSelect] = useState([]);
  const [cliente_select,setClienteSelect] = useState([]);
  //////////////////////////////////////////////////////////
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const textFieldRef = useRef(null); //foco del buscador
  const [razonSocialBusca, setRazonSocialBusca] = useState("");
  //////////////////////////////////////////////////////////

  const [formapago_select,setFormaPagoSelect] = useState([]);
  const [cond_venta_select] = useState([
    {cond_venta:'PESO LLEGADA'},
    {cond_venta:'PESO PARTIDA'}
  ]);
  const [cond_entrega_select] = useState([
    {cond_entrega:'PUESTO EN ALMACEN'},
    {cond_entrega:'RECOGIDO POR CLIENTE'}
  ]);
  
  //Permisos Nivel 02
  const {user, isAuthenticated } = useAuth0();
  const [permisosComando, setPermisosComando] = useState([]); //MenuComandos
  const [pVenta010201, setPVenta010201] = useState(false); //Grabar Cabecera Venta
  const [pVenta010202, setPVenta010202] = useState(false); //Agregar Detalle de Productos
  const [pVenta010203, setPVenta010203] = useState(false); //Det Editar Producto en Venta
  const [pVenta010204, setPVenta010204] = useState(false); //Det Editar Transporte en Venta
  const [pVenta010205, setPVenta010205] = useState(false); //Det Editar Eliminar Producto en Venta

  const [registrosdet,setRegistrosdet] = useState([]);
  //const fecha_actual = new Date();

  const createPdf = async () => {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Add logo to the top of the page
    //const logoImage = pdfDoc.embedPng(logo);
    const pngImage = await pdfDoc.embedPng(logo);
    const pngDims = pngImage.scale(0.5)

    page.drawImage(pngImage, {
      //x: page.getWidth() / 2 - pngDims.width / 2 + 75,
      //y: page.getHeight() / 2 - pngDims.height + 250,
      x: 210,
      y: 780,
      width: pngDims.width,
      height: pngDims.height,
    })

    const fontSize = 12;
    const lineHeight = fontSize * 1.2;
    const margin = 50;
    let x = margin;
    let y = height - margin - lineHeight - 10;
    
    y = y - 10;

    // Draw column headers
    page.drawText(venta.tipo_op + ": "+ params.cod+"-"+params.serie+"-"+params.num, { x:220, y, size: 16 });
    y=y-12; //aumentamos linea nueva
    y=y-5; //aumentamos linea nueva

    //Calculamos el punto x, acorde al largo de la razon social (centradito chochera ... claro pi cojuda)
    let centro;
    if (venta.razon_social===null) {
      centro = 0;
    }else{
      centro = (page.getWidth()/2) - (("CLIENTE: "+venta.razon_social).toString().length)/2 - margin - 40;
      page.drawText("CLIENTE: " + venta.razon_social?.toString() ?? "", { x:centro, y, size: 12 });
    }
    y=y-5; //aumentamos linea nueva
    y=y-12; //aumentamos linea nueva
    y=y-12; //aumentamos linea nueva
    
    ////////////////////////////////////////////////////////////////////
    page.drawRectangle({
      x: margin,
      y: y,
      width: (page.getWidth()-margin-50), //TODA ANCHO DE LA HOJA
      height: (lineHeight+7),
      borderWidth: 1,
      //color: rgb(0.778, 0.778, 0.778),
      borderColor: rgb(0.8,0.8,0.8)
    });
    page.drawText("FECHA: ", { x:55, y:y+4, size: 10 });
    page.drawText(venta.comprobante_original_fecemi, { x:100, y:y+4, size: 12 });

    page.drawText("ZONA: ", { x:55+140, y:y+4, size: 10 });
    page.drawText(venta.zona_venta, { x:100+140, y:y+4, size: 12 });

    ////////////////////////////////////////////////////////////////////
    page.drawText("VENDEDOR: ", { x:55+220+100, y:y+4, size: 10 });
    page.drawText(venta.vendedor, { x:260+160+30, y:y+4, size: 12 });
    
    ////////////////////////////////////////////////////////////////////
    
    //person.pedido?.toString() ?? ""
    y=y-12; //aumentamos linea nueva
    y=y-12; //aumentamos linea nueva
    y=y-5; //aumentamos linea nueva

    page.drawText("PAGO: ", { x:55, y:y+4, size: 10 });
    page.drawText(venta.formapago, { x:130, y:y+4, size: 10 });
    y=y-12; //aumentamos linea nueva
    page.drawText("VENTA: ", { x:55, y:y+4, size: 10 });
    page.drawText(venta.cond_venta, { x:130, y:y+4, size: 10 });
    y=y-12; //aumentamos linea nueva
    page.drawText("ENTREGA: ", { x:55, y:y+4, size: 10 });
    page.drawText(venta.cond_entrega, { x:130, y:y+4, size: 10 });

    ////////////////////////////////////////////////////////////////////
    // Draw table data
    let row = 1;
    let espaciadoDet = 0; //iniciamos en la 1era fila
    
    let precio_total = 0;
    espaciadoDet = espaciadoDet+20; ///NEW
    registrosdet.forEach((person) => {
      const text = `${person.descripcion}`;
      const textY = y - lineHeight; //corregimos aca, porque se duplicaba espacio en cada grupo
      page.drawRectangle({
        x: margin,
        y: y-espaciadoDet+2,
        width: (page.getWidth()-margin-50), //TODA ANCHO DE LA HOJA
        height: (lineHeight+2),
        borderWidth: 1,
        color: rgb(0.778, 0.778, 0.778),
        borderColor: rgb(0.8,0.8,0.8)
      });

      //1ERA LINEA
      //Desglosar 2da Linea, DECREMENTAR LA POS Y UNA LINEA MAS ABAJO //NEW
      page.drawText(person.cantidad.toString(), { x:margin, y:y+4-espaciadoDet, size: 12, font });
      page.drawText(person.unidad_medida?.toString() ?? "", { x:x+40, y:y+4-espaciadoDet, size: 12, font }); //Actualizar urgente
      page.drawText(text, { x:x+80, y:y+4-espaciadoDet, size: 12, font }); //Texto de Titulo de Barra ()
      page.drawText(person.moneda?.toString() ?? "", { x:x+410, y:y+4-espaciadoDet, size: 12, font }); //Actualizar urgente
      page.drawText(numeral(person.precio_unitario).format('0,0.00')?.toString() ?? "", { x:x+440, y:y+4-espaciadoDet, size: 12, font }); //Actualizar urgente
      
      precio_total = precio_total + person.precio_unitario*person.cantidad;
      page.drawText("IGV% "+person.porc_igv.toString(), { x:x+440, y:textY-espaciadoDet, size: 10, font }); //igv
      //No usaremos campo base, para pedidos
      //page.drawText("BAS.", { x:x+410, y:textY-espaciadoDet, size: 10, font }); //igv
      //page.drawText(numeral(person.precio_unitario/(1+person.porc_igv/100))?.format('0,0.00').toString() ?? "", { x:x+440, y:textY-espaciadoDet, size: 10, font,color:rgb(0,0,0.7) }); //Actualizar urgente

      page.drawText("ENTREGA", { x:x, y:textY-espaciadoDet, size: 7 });
      page.drawText("PLACA", { x:x+80, y:textY-espaciadoDet, size: 7 });
      page.drawText("TRANSPORTE", { x:x+130, y:textY-espaciadoDet, size: 7 });
      espaciadoDet = espaciadoDet+15;
      page.drawText(person.zona_entrega.toString(), { x:x, y: textY-espaciadoDet, size: 10, font });
      page.drawText(person.tr_placa?.toString() ?? "", { x:x+80, y: textY-espaciadoDet, size: 10, font }); //Actualizar urgente
      page.drawText(person.tr_razon_social?.toString() ?? "", { x:x+130, y: textY-espaciadoDet, size: 10, font }); //Actualizar urgente

      //2DA LINEA
      espaciadoDet = espaciadoDet+15;
      page.drawText("CHOFER", { x, y:textY-espaciadoDet, size: 7 });
      page.drawText("FECH.CARGA", { x:x+80, y:textY-espaciadoDet, size: 7 });
      page.drawText("NOMBRE", { x:x+130, y:textY-espaciadoDet, size: 7 });

      espaciadoDet = espaciadoDet+15;
      if (person.tr_celular===null) {
        page.drawText("-", { x, y: textY-espaciadoDet, size: 10, font });
      }else{
        page.drawText(person.tr_celular, { x, y: textY-espaciadoDet, size: 10, font });
      }
      if (person.tr_fecha_carga===null) {
        page.drawText("-", { x:x+80, y: textY-espaciadoDet, size: 10, font });
      }else{
        page.drawText(person.tr_fecha_carga.toString().substring(0,10), { x:x+80, y: textY-espaciadoDet, size: 10, font });
      }
      if (person.tr_chofer===null) {
        page.drawText("-", { x:x+130, y: textY-espaciadoDet, size: 10, font });
      }else{
        page.drawText(person.tr_chofer, { x:x+135, y: textY-espaciadoDet, size: 10, font });
      }

      //2ERA LINEA
      espaciadoDet = espaciadoDet+15;
      page.drawText("FACT. RUC", { x, y:textY-espaciadoDet, size: 7 });
      page.drawText("FACT. RAZON SOCIAL", { x:x+80, y:textY-espaciadoDet, size: 7 });
      page.drawText("FACT.", { x:x+450, y:textY-espaciadoDet, size: 7 });

      espaciadoDet = espaciadoDet+15;
      if (person.ref_documento_id===null) {
        page.drawText("-", { x, y: textY-espaciadoDet, size: 10, font });
      }else{
        page.drawText(person.ref_documento_id, { x, y: textY-espaciadoDet, size: 10, font });
      }
      if (person.ref_razon_social===null) {
        page.drawText("-", { x:x+80, y: textY-espaciadoDet, size: 10, font });
      }else{
        page.drawText(person.ref_razon_social, { x:x+80, y: textY-espaciadoDet, size: 10, font });
      }
      page.drawText(numeral(person.precio_unitario*person.cantidad).format('0,0.00'), { x:x+440, y: textY-espaciadoDet, size: 10, font });

      //al final del bucle, aumentamos una linea simple :) claro pi ...
      espaciadoDet = espaciadoDet+50;
      row++;
    });
    
    //Linea del total facturado, solo para casos que sea misma moneda en todos los detalles
    //en este caso, la facturacion es por cada detalle, saludos terricolas
    //page.drawText(numeral(precio_total).format('0,0.00'), { x:x+440, y: y-espaciadoDet, size: 10, font });

    //Final
    page.drawRectangle({
      x: margin,
      y: y-espaciadoDet-30,
      width: (page.getWidth()-margin-50), //TODA ANCHO DE LA HOJA
      height: (lineHeight+40),
      borderWidth: 1,
      //color: rgb(0.778, 0.778, 0.778),
      borderColor: rgb(0.8,0.8,0.8)
    });
    

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    // Crea una URL de objeto para el archivo Blob
    const url = URL.createObjectURL(blob);
    // Abre la URL en una nueva pestaña del navegador
    window.open(url, '_blank');
    
  }

  const [venta,setVenta] = useState({
      id_empresa:'1',  
      id_punto_venta:'1001',  
      tipo_op:'VENTA',
      id_zona_venta:'',
      zona_venta:'',
      id_vendedor:'',
      vendedor:'',
      comprobante_original_fecemi:'',
      documento_id:'', //cliente
      razon_social:'', //cliente
      debe:'0',
      peso_total:'0',

      id_formapago:'', //new
      formapago:'',       //new
      cond_venta:'',       //new
      cond_entrega:'',   //new

      registrado:'1'
  })

  const handleCodigoKeyDown = async (event) => {
    if (event.key === '+') {
        setShowModal(true);
    }
    if (event.key === '-') {
      setShowModal(false);
    }
    console.log(event.key);
    if (event.key === 'Enter') {
      //Selecciona el 1er elemento de la lista, en caso no haya filtrado nada
      handleClienteSelect(filteredClientes[0].documento_id, filteredClientes[0].razon_social);

      setShowModal(false);
    }
  };
  const handleClienteSelect = (codigo, cliente) => {
    setSearchText(codigo);
    //setVenta(prevState => ({ ...prevState, documento_id: codigo, razon_social:cliente}));
    /*setVenta({...venta, documento_id:codigo, razon_social:cliente});*/
    venta.documento_id = codigo;
    venta.razon_social = cliente;

    setShowModal(false);
    console.log(venta.documento_id,venta.razon_social);
  };
  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value.replace('+', '').replace('-',''));
    setVenta({...venta, documento_id:event.target.value.replace('+', '').replace('-','')});
  };
  const filteredClientes = cliente_select.filter((c) =>
  `${c.documento_id} ${c.razon_social}`.toLowerCase().includes(searchText.toLowerCase())
  );
  
  const [cargando,setCargando] = useState(false);
  const [editando,setEditando] = useState(false);
  
  const navigate = useNavigate();
  const params = useParams();

  const handleSubmit = async(e) => {
    e.preventDefault();
    setCargando(true);
    var data;

    //Cambiooo para controlar Edicion
    if (editando){
      await fetch(`${back_host}/venta/${params.cod}/${params.serie}/${params.num}/${params.elem}`, {
        method: "PUT",
        body: JSON.stringify(venta),
        headers: {"Content-Type":"application/json"}
      });
    }else{
      console.log(`${back_host}/venta`);
      console.log(venta);
      const res = await fetch(`${back_host}/venta`, {
        method: "POST",
        body: JSON.stringify(venta),
        headers: {"Content-Type":"application/json"}
      });
      //nuevo
      data = await res.json();
    }
    setCargando(false);
    
    setEditando(true);
    //Obtener json respuesta, para extraer cod,serie,num y elemento
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
      navigate(`/ventamovil/${data.comprobante_original_codigo}/${data.comprobante_original_serie}/${data.comprobante_original_numero}/${data.elemento}/edit`);
    }else{
      //navigate(`/venta/${data.comprobante_original_codigo}/${data.comprobante_original_serie}/${data.comprobante_original_numero}/${data.elemento}/edit`);
      navigate(`/ventamovil/${data.comprobante_original_codigo}/${data.comprobante_original_serie}/${data.comprobante_original_numero}/${data.elemento}/edit`);
    }
  };
  
  //Aqui se leen parametros en caso lleguen
  useEffect( ()=> {
    if (params.cod){
      //Esto porque despues buscar en modal, la variable showModal activa todo este proceso
      //ocasionando que el nuevo cliente, sea reemplazado por el anterior
      if (!editando){
      mostrarVenta(params.cod,params.serie,params.num,params.elem);
      mostrarVentaDetalle(params.cod,params.serie,params.num,params.elem);
      }
    }  
    cargaZonaCombo();
    cargaVendedorCombo();
    cargaClienteCombo();
    cargaFormaPagoCombo();

    //NEW codigo para autenticacion y permisos de BD
    if (isAuthenticated && user && user.email) {
      // cargar permisos de sistema
      cargaPermisosMenuComando('01'); //Alimentamos el useState permisosComando
      //console.log(permisosComando);
    }

    //foco
    if (showModal && textFieldRef.current) {
      textFieldRef.current.focus();
    }
  
  },[params.cod, isAuthenticated, user, showModal, textFieldRef.current, editando]);

  const cargaZonaCombo = () =>{
    axios
    .get(`${back_host}/zona`)
    .then((response) => {
        setZonaSelect(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
  }
  const cargaVendedorCombo = () =>{
    axios
    .get(`${back_host}/usuario/vendedores`)
    .then((response) => {
        setVendedorSelect(response.data);
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
  const cargaFormaPagoCombo = () =>{
    axios
    .get(`${back_host}/formapago`)
    .then((response) => {
        setFormaPagoSelect(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
  }

  const cargaPermisosMenuComando = async(idMenu)=>{
    //Realiza la consulta a la API de permisos (obtenerTodosPermisoComandos)
    fetch(`https://alsa-backend-js-production.up.railway.app/seguridad/${user.email}/${idMenu}`, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(permisosData => {
      // Guarda los permisos en el estado
      setPermisosComando(permisosData);
      console.log(permisosComando);
      let tienePermiso;
      // Verifica si existe el permiso de acceso 'ventas'
      tienePermiso = permisosData.some(permiso => permiso.id_comando === '01-02-01'); //Nuevo Producto Venta
      if (tienePermiso) {
        setPVenta010201(true);
      }
      tienePermiso = permisosData.some(permiso => permiso.id_comando === '01-02-02'); //Nuevo Producto Venta
      if (tienePermiso) {
        setPVenta010202(true);
      }
      tienePermiso = permisosData.some(permiso => permiso.id_comando === '01-02-03'); //Nuevo Producto Venta
      if (tienePermiso) {
        setPVenta010203(true);
      }
      tienePermiso = permisosData.some(permiso => permiso.id_comando === '01-02-04'); //Nuevo Producto Venta
      if (tienePermiso) {
        setPVenta010204(true);
      }
      tienePermiso = permisosData.some(permiso => permiso.id_comando === '01-02-05'); //Nuevo Producto Venta
      if (tienePermiso) {
        setPVenta010205(true);
      }
    })
    .catch(error => {
      console.log('Error al obtener los permisos:', error);
    });
  }

  //Rico evento change
  const handleChange = e => {
    var index;
    var sTexto;
    if (e.target.name === "id_zona_venta") {
      const arrayCopia = zona_select.slice();
      index = arrayCopia.map(elemento => elemento.id_zona).indexOf(e.target.value);
      sTexto = arrayCopia[index].nombre;
      setVenta({...venta, [e.target.name]: e.target.value, zona_venta:sTexto});
      return;
    }
    if (e.target.name === "id_vendedor") {
      const arrayCopia = vendedor_select.slice();
      index = arrayCopia.map(elemento => elemento.id_vendedor).indexOf(e.target.value);
      sTexto = arrayCopia[index].nombre;
      setVenta({...venta, [e.target.name]: e.target.value, vendedor:sTexto});
      return;
    }
    /*if (e.target.name === "documento_id") {
      const arrayCopia = cliente_select.slice();
      index = arrayCopia.map(elemento => elemento.documento_id).indexOf(e.target.value);
      sTexto = arrayCopia[index].razon_social;
      setVenta({...venta, [e.target.name]: e.target.value, razon_social:sTexto});
      return;
    }*/
    if (e.target.name === "id_formapago") {
      const arrayCopia = formapago_select.slice();
      index = arrayCopia.map(elemento => elemento.id_formapago).indexOf(e.target.value);
      sTexto = arrayCopia[index].nombre;
      setVenta({...venta, [e.target.name]: e.target.value, formapago:sTexto});
      return;
    }

    setVenta({...venta, [e.target.name]: e.target.value});
  }

  //funcion para mostrar data de formulario, modo edicion
  const mostrarVenta = async (cod,serie,num,elem) => {
    const res = await fetch(`${back_host}/venta/${cod}/${serie}/${num}/${elem}`);
    const data = await res.json();
    //Actualiza datos para enlace con controles, al momento de modo editar
    setVenta({  
                tipo_op:data.tipo_op,
                id_zona_venta:data.id_zona_venta,
                zona_venta:data.zona_venta,
                id_vendedor:data.id_vendedor,
                vendedor:data.vendedor,
                comprobante_original_codigo:data.comprobante_original_codigo,
                comprobante_original_serie:data.comprobante_original_serie,
                comprobante_original_numero:data.comprobante_original_numero,
                elemento:data.elemento,
                comprobante_original_fecemi:data.comprobante_original_fecemi,
                documento_id:data.documento_id, //cliente
                razon_social:data.razon_social, //cliente
                debe:data.debe,
                peso_total:data.peso_total,

                id_formapago:data.id_formapago, //new
                formapago:data.formapago,       //new
                cond_venta:data.cond_venta,       //new
                cond_entrega:data.cond_entrega,   //new

                registrado:data.registrado
              });
    //console.log(data);
    setSearchText(data.documento_id); //data de cliente para form
    setEditando(true);
  };
  
  const mostrarVentaDetalle = async (cod,serie,num,elem) => {
    const res = await fetch(`${back_host}/ventadet/${cod}/${serie}/${num}/${elem}`);
    const dataDet = await res.json();
    setRegistrosdet(dataDet);
    setEditando(true);
  };

  const eliminarVentaDetalleItem = async (cod,serie,num,elem,item) => {
    await fetch(`${back_host}/ventadet/${cod}/${serie}/${num}/${elem}/${item}`, {
      method:"DELETE"
    });
    
    setRegistrosdet(registrosdet.filter(registrosdet => registrosdet.comprobante_original_codigo !== cod ||
                                                        registrosdet.comprobante_original_serie !== serie ||
                                                        registrosdet.comprobante_original_numero !== num ||
                                                        registrosdet.elemento !== elem ||
                                                        registrosdet.item !== item                                                        
    ));
    //console.log(data);
  }

  const confirmaEliminacionDet = (cod,serie,num,elem,item)=>{
    swal({
      title:"Eliminar Detalle de Venta",
      text:"Seguro ?",
      icon:"warning",
      timer:"3000",
      buttons:["No","Si"]
    }).then(respuesta=>{
        if (respuesta){
          eliminarVentaDetalleItem(cod,serie,num,elem,item);
            swal({
            text:"Detalle de venta eliminado con exito",
            icon:"success",
            timer:"2000"
          });
      }
    })
  }

  //Body para Modal de Busqueda Incremental de Pedidos

  const body=(
  <div>
      {
      registrosdet.map((indice) => (
        indice ?
        <div>
        <Card sx={{mt:0.1}}
                style={{
                  background:'#1e272e',
                  padding:'1rem',
                  height:'2rem',
                  marginTop:".2rem"
                }}
                key={indice.ref_documento_id}
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
                  
                  { pVenta010203 ? 
                    //Editar Producto 
                    (      
                    <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                                sx={{ textAlign: 'left' }}
                                onClick = {()=> {
                                          //navigate(`/ventadet/${indice.comprobante_original_codigo}/${indice.comprobante_original_serie}/${indice.comprobante_original_numero}/${indice.elemento}/${indice.item}/edit`)
                                        if (venta.tipo_op=="TRASLADO"){
                                          navigate(`/ventadettraslado/${indice.comprobante_original_codigo}/${indice.comprobante_original_serie}/${indice.comprobante_original_numero}/${indice.elemento}/${indice.item}/edit`)
                                        }else{
                                          navigate(`/ventadet/${indice.comprobante_original_codigo}/${indice.comprobante_original_serie}/${indice.comprobante_original_numero}/${indice.elemento}/${indice.item}/edit`)
                                        }

                                        }
                                      }
                    >
                    <BorderColorIcon />
                    </IconButton>
                    ):
                    (
                      <IconButton color="inherit" aria-label="upload picture" component="label" size="small"
                      sx={{ textAlign: 'left' }}
                    >
                    <BorderColorIcon />
                    </IconButton>
                    )
                  }

                  { pVenta010204 ? 
                    //Modificar Transporte 010204
                    (      
                    <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                                sx={{ textAlign: 'left' }}
                                onClick = {()=> navigate(`/ventadettrans/${indice.comprobante_original_codigo}/${indice.comprobante_original_serie}/${indice.comprobante_original_numero}/${indice.elemento}/${indice.item}/edit`)}
                    >
                      <LocalShippingIcon />
                    </IconButton>
                    ):
                    (
                      <IconButton color="inherit" aria-label="upload picture" component="label" size="small"
                      sx={{ textAlign: 'left' }}
                    >
                      <LocalShippingIcon />
                    </IconButton>

                    )
                  }

                  { pVenta010205 ? 
                    //Eliminar Producto
                    (      
                    <IconButton color="warning" aria-label="upload picture" component="label" size="small"
                                sx={{ textAlign: 'left' }}
                                onClick = { () => confirmaEliminacionDet(indice.comprobante_original_codigo
                                                                          ,indice.comprobante_original_serie
                                                                          ,indice.comprobante_original_numero
                                                                          ,indice.elemento
                                                                          ,indice.item)
                                          }
                    >
                      <DeleteIcon />
                    </IconButton>
                    ):
                    (
                      <IconButton color="inherit" aria-label="upload picture" component="label" size="small"
                      sx={{ textAlign: 'left' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )
                  }

                  </Grid>
                
                  <Grid item xs={12} sm={6}>
                    <Typography fontSize={15} marginTop="0rem" >
                    {indice.cantidad} {indice.unidad_medida} {indice.descripcion}
                    </Typography>
                  </Grid>

              </Grid>

          </Grid>

          </CardContent>
        </Card>
        </div>
        : null
      ))
      }
  </div>
  )

  return (
  <div> 
      <div></div>
    <Grid container spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
    >
      
      <Grid item xs={3}
      >
            <Card sx={{mt:1}}
                  style={{
                    background:'#1e272e',
                    //maxWidth: '400px', // Ajusta este valor según tu preferencia
                    padding:'1rem'
                  }}
                  >
                <Typography variant='h5' color='white' textAlign='center'>
                    {editando ? ("Editar " + venta.tipo_op + " : " + params.cod+"-"+params.serie+"-"+params.num) : ("Registrar Venta")}
                </Typography>
                
                <CardContent >
                    <form onSubmit={handleSubmit} >

                      <Grid container spacing={0.5}
                            direction="column"
                            //alignItems="center"
                            justifyContent="center"
                      >
                            <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label" 
                                                inputProps={{ style:{color:'white'} }}
                                                InputLabelProps={{ style:{color:'white'} }}
                                                sx={{mt:1, color:'green'}}
                              >OPERACION</InputLabel>
                              <Select
                                      labelId="operacion_select"
                                      size="small"
                                      id={venta.tipo_op}
                                      value={venta.tipo_op}
                                      name="tipo_op"
                                      sx={{display:'block',
                                      margin:'.5rem 0', color:"white"}}
                                      label="Operacion"
                                      onChange={handleChange}
                                    >
                                      {   
                                          operacion_select.map(elemento => (
                                          <MenuItem key={elemento.tipo_op} value={elemento.tipo_op}>
                                            {elemento.tipo_op}
                                          </MenuItem>)) 
                                      }
                              </Select>
                            </FormControl>
                            </Box>

                          {/* primera linea--------------------------------- */}
                          <FormControl fullWidth sx={{margin:'-1rem 0'}}>
                            <InputLabel id="demo-simple-select-label" 
                                        inputProps={{ style:{color:'white'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                        sx={{mt:1, color:"green"}}
                            >Zona</InputLabel>
                            <Select
                              labelId="zona_select"
                              size="small"
                              id={venta.id_zona_venta}
                              value={venta.id_zona_venta}
                              name="id_zona_venta"
                              sx={{display:'block',
                              margin:'.9rem 0', color:"white"}}
                              label="Zona"
                              onChange={handleChange}
                              inputProps={{ style:{color:'white'} }}
                              InputLabelProps={{ style:{color:'white'} }}
                            >
                              {   
                                  zona_select.map(elemento => (
                                  <MenuItem key={elemento.id_zona} 
                                            value={elemento.id_zona}
                                  >
                                    {elemento.nombre}
                                  </MenuItem>)) 
                              }
                            </Select>
                          </FormControl>

                          <TextField variant="outlined" 
                                    //label="fecha"
                                    fullWidth
                                    size="small"
                                    sx={{display:'block',
                                          margin:'.5rem 0'}}
                                    name="comprobante_original_fecemi"
                                    type="date"
                                    //format="yyyy/MM/dd"
                                    value={venta.comprobante_original_fecemi}
                                    onChange={handleChange}
                                    inputProps={{ style:{color:'white'} }}
                                    InputLabelProps={{ style:{color:'white'} }}
                          />
                          
                          <Box sx={{ minWidth: 120 }}>
                                  <FormControl fullWidth sx={{margin:'-0.5rem 0'}}>
                                    <InputLabel id="demo-simple-select-label" 
                                                inputProps={{ style:{color:'white'} }}
                                                InputLabelProps={{ style:{color:'white'} }}
                                                sx={{mt:1, color:"green"}}
                                    >Vendedor</InputLabel>
                                    <Select
                                      labelId="vendedor_select"
                                      size="small"
                                      id={venta.id_vendedor}
                                      value={venta.id_vendedor}
                                      name="id_vendedor"
                                      sx={{display:'block',
                                      margin:'.9rem 0', color:"white"}}
                                      label="Vendedor"
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                                    >
                                      {   
                                          vendedor_select.map(elemento => (
                                          <MenuItem key={elemento.id_vendedor} value={elemento.id_vendedor}>
                                            {elemento.nombre}
                                          </MenuItem>)) 
                                      }
                                    </Select>
                                  </FormControl>
                          </Box>

                          <Grid container spacing={0}
                                //direction="column"
                                alignItems="center"
                                justifyContent="left"
                          >
                              <Grid item xs={10}>
                                  <TextField variant="outlined" 
                                              label="Cliente"
                                              size="small"
                                              sx={{mt:1}}
                                              fullWidth
                                              name="documento_id"
                                              //value={venta.documento_id}
                                              //onChange={handleChange}
                                              value={venta.documento_id}
                                              onChange={handleChange} //new para busqueda
                                              onKeyDown={handleCodigoKeyDown} //new para busqueda
                                              inputProps={{ style:{color:'white',width: 140} }}
                                              InputLabelProps={{ style:{color:'green'} }}
                                  />

                                  {/* Seccion para mostrar Dialog tipo Modal, para busqueda incremental clientes */}
                                  <Dialog
                                    open={showModal}
                                    onClose={() => setShowModal(false)}
                                    maxWidth="md"
                                    fullWidth
                                    PaperProps={{
                                      style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        marginTop: '10vh', // Ajusta este valor según tus necesidades
                                        background:'#1e272e',
                                        color:'white'
                                      },
                                    }}
                                  >
                                    <DialogTitle>Listado de Clientes</DialogTitle>
                                      <TextField variant="standard" 
                                                  maxWidth="md"
                                                  autoFocus
                                                  size="small"
                                                  //sx={{display:'block',
                                                  //      margin:'.5rem 0'}}
                                                  sx={{mt:-1}}
                                                  name="documento_id_modal"
                                                  inputRef={textFieldRef} // Referencia para el TextField
                                                  value={searchText}
                                                  onChange={handleSearchTextChange} //new para busqueda
                                                  onKeyDown={handleCodigoKeyDown} //new para busqueda
                                                  inputProps={{ style:{color:'white',width: 140} }}
                                                  InputLabelProps={{ style:{color:'white'} }}
                                        />
                                    <DialogContent>
                                      <List>
                                        {filteredClientes.map((c) => (
                                          <ListItem key={c.documento_id} onClick={() => handleClienteSelect(c.documento_id, c.razon_social)}>
                                            <ListItemText primary={`${c.documento_id} - ${c.razon_social}`} 
                                            />
                                          </ListItem>
                                        ))}
                                      </List>
                                    </DialogContent>
                                  </Dialog>
                                  {/* FIN Seccion para mostrar Dialog tipo Modal */}

                              </Grid>

                              <Grid item xs={1}>
                                  <IconButton color="success" aria-label="upload picture" component="label" size="small"
                                      sx={{mt:-1}}
                                      onClick = { () => {
                                          //mostrar modal
                                          setShowModal(true);
                                        }
                                      }
                                    >
                                    <PersonSearchIcon />
                                  </IconButton>
                              </Grid>
                              <Grid item xs={0.5}>
                                  <IconButton color="warning" aria-label="upload picture" component="label" size="small"
                                      sx={{mt:-1}}
                                      onClick = { () => {
                                          //busqueda en internet
                                          
                                        }
                                      }
                                    >
                                    <FindIcon />
                                  </IconButton>
                              </Grid>

                              <TextField variant="outlined" 
                                      //label="RAZON SOCIAL"
                                      fullWidth
                                      size="small"
                                      //sx={{display:'block',
                                      //      margin:'.5rem 0'}}
                                      sx={{mt:0}}
                                      name="razon_social"
                                      value={venta.razon_social || razonSocialBusca}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                              />

                          </Grid>

                          <Box sx={{ minWidth: 120, mt:1 }}
                                   //sx={{mt:-3}}
                            >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label" 
                                                  inputProps={{ style:{color:'white'} }}
                                                  InputLabelProps={{ style:{color:'white'} }}
                                                  sx={{mt:1, color:'#5DADE2'}}
                                      >COND. PAGO [ SEL.]</InputLabel>
                                      <Select
                                        labelId="id_formapago"
                                        id={venta.id_formapago}
                                        value={venta.id_formapago}
                                        name="id_formapago"
                                        size="small"
                                        sx={{display:'block',
                                        margin:'.6rem 0', color:"white"}}
                                        label="Forma Pago"
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                      >
                                        {   
                                            formapago_select.map(elemento => (
                                            <MenuItem   key={elemento.id_formapago} 
                                                        value={elemento.id_formapago}>
                                              {elemento.nombre}
                                            </MenuItem>)) 
                                        }
                                      </Select>
                                    </FormControl>
                            </Box>

                            <Box sx={{mt:0}}>
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label" 
                                                        inputProps={{ style:{color:'white'} }}
                                                        InputLabelProps={{ style:{color:'white'} }}
                                                        sx={{mt:1, color:'#5DADE2'}}
                                      >COND. VENTA [ SEL.]</InputLabel>
                                      <Select
                                              labelId="cond_venta_select"
                                              id={venta.cond_venta}
                                              value={venta.cond_venta}
                                              name="cond_venta"
                                              size="small"
                                              sx={{display:'block',
                                              margin:'.1rem', color:"white"}}
                                              label="Condicion Venta"
                                              onChange={handleChange}
                                            >
                                              {   
                                                  cond_venta_select.map(elemento => (
                                                  <MenuItem key={elemento.cond_venta} value={elemento.cond_venta}>
                                                    {elemento.cond_venta}
                                                  </MenuItem>)) 
                                              }
                                      </Select>
                                    </FormControl>
                            </Box>

                            <Box sx={{mt:0}}>
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label" 
                                                        inputProps={{ style:{color:'white'} }}
                                                        InputLabelProps={{ style:{color:'white'} }}
                                                        sx={{mt:1, color:'#5DADE2'}}
                                      >COND. ENTREGA [ SEL.]</InputLabel>
                                      <Select
                                              labelId="cond_entrega_select"
                                              id={venta.cond_entrega}
                                              value={venta.cond_entrega}
                                              name="cond_entrega"
                                              size="small"
                                              sx={{display:'block',
                                              margin:'.1rem', color:"white"}}
                                              label="Condicion Entrega"
                                              onChange={handleChange}
                                            >
                                              {   
                                                  cond_entrega_select.map(elemento => (
                                                  <MenuItem key={elemento.cond_entrega} value={elemento.cond_entrega}>
                                                    {elemento.cond_entrega}
                                                  </MenuItem>)) 
                                              }
                                      </Select>
                                    </FormControl>
                            </Box>


                          <Grid container spacing={0.5}>
                              <Grid item xs={2}>
                                  { pVenta010202 ?
                                    //Agregar Detalle Producto (Venta)
                                    (
                                      <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                                          sx={{margin:'.5rem 0'}}
                                          onClick = {()=> {
                                                //navigate(`/ventadet/${venta.comprobante_original_codigo}/${venta.comprobante_original_serie}/${venta.comprobante_original_numero}/${venta.elemento}/${venta.comprobante_original_fecemi}/new`);
                                                if (venta.tipo_op=="TRASLADO"){
                                                  navigate(`/ventadettraslado/${venta.comprobante_original_codigo}/${venta.comprobante_original_serie}/${venta.comprobante_original_numero}/${venta.elemento}/${venta.comprobante_original_fecemi}/new`);
                                                }else{
                                                  navigate(`/ventadet/${venta.comprobante_original_codigo}/${venta.comprobante_original_serie}/${venta.comprobante_original_numero}/${venta.elemento}/${venta.comprobante_original_fecemi}/new`);
                                                }
    
                                                }
                                          }
                                      >
                                      <AddBoxRoundedIcon />
                                    </IconButton>
                                    ):
                                    (
                                      <IconButton color="inherit" aria-label="upload picture" component="label" size="small"
                                          sx={{margin:'.5rem 0', color:"white"}}
                                      >
                                      <AddBoxRoundedIcon />
                                    </IconButton>
                                    )
                                  }
                              </Grid>

                              <Grid item xs={8}>
                                { pVenta010201 ?
                                  //Grabar Datos Cabecera (Venta)
                                  (
                                  <Button variant='contained' 
                                          color='primary' 
                                          type='submit'
                                          fullWidth
                                          sx={{display:'block',
                                          margin:'.5rem 0'}}
                                          disabled={
                                                    !venta.id_zona_venta || 
                                                    !venta.comprobante_original_fecemi || 
                                                    !venta.id_vendedor || 
                                                    !venta.documento_id
                                                    }
                                          >
                                          { cargando ? (
                                          <CircularProgress color="inherit" size={24} />
                                          ) : (
                                            editando ?
                                          'Modificar' : 'Grabar')
                                          }
                                  </Button>
                                  ):
                                  (
                                  <span></span>
                                  )
                                }
                              </Grid>
                              <Grid item xs={2}>
                                <Button variant='contained' 
                                              color='warning' 
                                              //size='small'
                                              //startIcon={<AssessmentRoundedIcon />}
                                              onClick={createPdf}
                                              fullWidth
                                              sx={{display:'block',margin:'.5rem 0'}}
                                              //sx={{margin:'.5rem 0', height:55}}
                                              >
                                  PDF
                                </Button>
                              </Grid>
                          </Grid>

                          {body}

                      </Grid>
                    </form>
                </CardContent>
            </Card>
      </Grid>

        
      

    </Grid>
  </div>    
  );
}
