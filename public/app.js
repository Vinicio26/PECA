  // Initialize Firebase
  var Secondconfig = {
    apiKey: "AIzaSyBTZfH9lRwUNpf0uhgOunvsc-ejCcwvv_Y",
   authDomain: "receptordatos-8bfe9.firebaseapp.com",
   databaseURL: "https://receptordatos-8bfe9.firebaseio.com",
   projectId: "receptordatos-8bfe9",
   storageBucket: "receptordatos-8bfe9.appspot.com",
   messagingSenderId: "976420438297"
  };

var movil =firebase.initializeApp(Secondconfig, "second");
//configuración personal de Firebase
var main = firebase.initializeApp({
  apiKey: "AIzaSyAhhvOvGa9w0Bp0-2-caCXMCT09Y2FsKQ4",
   authDomain: "registrou-33260.firebaseapp.com",
    projectId: "registrou-33260",
},"Principal");
console.log(main.name);  // "[DEFAULT]"
console.log(movil.name);        // "other"

// Initialize Cloud Firestore through Firebase
var db = main.firestore();
  // configuracion inicial de firebase

  //inicializamos firebase
  var toOpened=true;
    var mensaje;
    var mensaje2;
    var nada  = document.getElementById('nada');
    var pulso = document.getElementById('pulso');
    var pulsoMin= document.getElementById('js-pulsoMinimo');
    var pulsoMax= document.getElementById('js-pulsoMaximo');
    var maximo=parseInt(pulsoMax.value);
    var minimo=parseInt(pulsoMin.value);
    var latitudId=document.getElementById('latitud');//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    var longitudId=document.getElementById('longitud');//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    var longitud=parseFloat(longitudId.value);//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    var latitud=parseFloat(latitudId.value);//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    var dbRefPulsoMin = movil.database().ref().child('TecHeart').child('PulsoMin');
  	var dbRefPulsoMax = movil.database().ref().child('TecHeart').child('PulsoMax');
  	var dbRefLat=movil.database().ref().child('TecHeart').child('Lat');//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  	var dbRefLong=movil.database().ref().child('TecHeart').child('Long');//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  	dbRefLong.on('value', snap=>{
  		longitud = snap.val();
      longitudId.value = ConvertirEntero(snap.val());
  		console.log(longitud);
  	});
  	dbRefLat.on('value', snap=>{
  		latitud=snap.val();
      latitudId.value=ConvertirEntero(snap.val());
  		console.log(latitud);
  		initMap(ConvertirEntero(latitud),ConvertirEntero(longitud));
  	});
  	dbRefPulsoMax.on('value', snap => {
    pulsoMax.value = snap.val();
  	});
  	dbRefPulsoMin.on('value', snap => {
    pulsoMin.value = snap.val();
  	});
  	var dbRef = movil.database().ref().child('TecHeart').child('PulsoActual');
  	dbRef.on('value', snap=> {
      pulso.value=snap.val();
      pulsoActual = document.getElementById('pulso').value;
      maximo = parseFloat(pulsoMax.value);
      minimo = parseFloat(pulsoMin.value);
      console.log(pulsoActual);
      console.log(ConvertirEntero(pulsoActual));
      nada.innerHTML= ConvertirEntero(pulsoActual);
      // console.log(pulsoMin);
      // console.log(pulsoMax);
      console.log(maximo);
      console.log(minimo);
      if (pulsoActual!='""') {
                        //condicion para condicion cardiaca
        if (ConvertirEntero(pulsoActual) < minimo && toOpened==true) {
          document.getElementById("btnUbicar1").click();
          toOpened=false;
        }
        else if (ConvertirEntero(pulsoActual) > maximo && toOpened==true) {
          document.getElementById("btnUbicar1").click();
          toOpened=false;
        }
        else if (ConvertirEntero(pulsoActual) >= minimo && ConvertirEntero(pulsoActual) <= maximo) {
          //alert(" tienes pulso normal");
        }

      }
      else
      {
        alert("No llegan datos");
      }
      var id=document.getElementById('idPaciente').value;
      actualizarFirestore(id);

  });
  //codigo posible
  //se guardan los datos
    //se hace referencia al formulario por medio de la clase
  $('.js-form').on('submit', event => {
    event.preventDefault();
    //se capturan las variables por medio de los id
    const PulsoMin=$('#js-pulsoMinimo').val();
    const PulsoMax=$('#js-pulsoMaximo').val();
    //prueba de captura de datos en la consola (presiona f12 y ve a la parte de consola para ver los datos
    // enviados previamente)
    console.log(PulsoMax);
    console.log(PulsoMin);
    //se actualizan los datos en firebase con el metodo push
    movil.database().ref().child('TecHeart').update({PulsoMin});
    movil.database().ref().child('TecHeart').update({PulsoMax});
  });
function validarCondicion()
{
  toOpened=true;
};
//Agregar documentos
function guardar(){
    var nombre = document.getElementById('nombre').value;
    var celu = document.getElementById('telefono').value;
    var direccion = document.getElementById('direccion').value;
    var edad = document.getElementById('edad').value;
    var minimo = document.getElementById('pulso-minimo').value;
    var maximo = document.getElementById('pulso-maximo').value;
    var expediente = document.getElementById('expediente').value;




    db.collection("users").add({
        NombreCompleto: nombre,
        Telefono: celu,
        Direccion: direccion,
        Edad: edad,
        PulsoMinimo: minimo,
        PulsoMaximo: maximo,
        Expediente: expediente,
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        document.getElementById('nombre').value = '';
        document.getElementById('telefono').value = '';
        document.getElementById('direccion').value = '';
        document.getElementById('edad').value = '';
        document.getElementById('pulso-minimo').value = '';
        document.getElementById('pulso-maximo').value = '';
        document.getElementById('expediente').value = '';

    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

//Leer documentos

var tabla = document.getElementById('tabla');
db.collection("users").onSnapshot((querySnapshot) => {
    tabla.innerHTML = '';
    var id=document.getElementById('idPaciente').value;
    var cont=1;
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().PulsoActual}`);
        if(doc.id==id){
            document.getElementById('pulso-actualModal').value=doc.data().PulsoActual;
        };
        tabla.innerHTML += `
        <tr>
        <td>${doc.data().NombreCompleto}</td>
        <td>${doc.data().Telefono}</td>
        <td>${doc.data().Direccion}</td>
        <td>${doc.data().Edad}</td>
        <td>${doc.data().PulsoActual}</td>
        <td>${doc.data().PulsoMinimo}</td>
        <td>${doc.data().PulsoMaximo}</td>
        <td>${doc.data().Expediente}</td>
        <td><button class="btn btn-danger" onclick="eliminar('${doc.id}')">Eliminar</button></td>
        <td><button class="btn btn-warning" onclick="editar('${doc.id}',
        '${doc.data().NombreCompleto}',
        '${doc.data().Telefono}',
        '${doc.data().Direccion}',
        '${doc.data().Edad}',
        '${doc.data().PulsoMinimo}',
        '${doc.data().PulsoMaximo}',
        '${doc.data().Expediente}',
      )">Editar</button></td>
      <td><button type="button" id="btnUbicar${cont}" class="btn btn-primary" data-toggle="modal" data-target="#hola" onclick="ubicar('${doc.id}',
      '${doc.data().NombreCompleto}',
      '${doc.data().PulsoActual}',
      '${doc.data().PulsoMinimo}',
      '${doc.data().PulsoMaximo}'
    )">Ubicacion</button></td>
        </tr>
        `
        cont++;
    });
});


//borrar documentos
function eliminar(id){
    db.collection("users").doc(id).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}
//actualizar pulso en tiempo real desde firebase a Firestore
function actualizarFirestore(id){
    var washingtonRef = db.collection("users").doc(id);
    var actual = ConvertirEntero(pulso.value);
    return washingtonRef.update({
        PulsoActual: actual,
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
};


//editar documentos
function editar(id,NombreCompleto,Telefono,Direcion,Edad,PulsoMinimo,PulsoMaximo,Expediente){

    document.getElementById('nombre').value = NombreCompleto;
    document.getElementById('telefono').value = Telefono;
    document.getElementById('direccion').value = Direcion;
    document.getElementById('edad').value = Edad;
    document.getElementById('pulso-minimo').value = PulsoMinimo;
    document.getElementById('pulso-maximo').value = PulsoMaximo;
    document.getElementById('expediente').value = Expediente;

    var boton = document.getElementById('boton');
    boton.innerHTML = 'Editar';

    boton.onclick = function(){
        var washingtonRef = db.collection("users").doc(id);
        // Set the "capital" field of the city 'DC'

        var nombre = document.getElementById('nombre').value;
        var celu = document.getElementById('telefono').value;
        var direccion = document.getElementById('direccion').value;
        var edad = document.getElementById('edad').value;
        var minimo = document.getElementById('pulso-minimo').value;
        var maximo = document.getElementById('pulso-maximo').value;
        var expediente = document.getElementById('expediente').value;

        //se capturan las variables por medio de los id
        const PulsoMin=minimo;
        const PulsoMax=maximo;
        //prueba de captura de datos en la consola (presiona f12 y ve a la parte de consola para ver los datos
        // enviados previamente)
        console.log(PulsoMax);
        console.log(PulsoMin);
        //se actualizan los datos en firebase con el metodo push
        movil.database().ref().child('TecHeart').update({PulsoMin});
        movil.database().ref().child('TecHeart').update({PulsoMax});

        return washingtonRef.update({
            NombreCompleto: nombre,
            Telefono: celu,
            Direccion: direccion,
            Edad: edad,
            PulsoMinimo: minimo,
            PulsoMaximo: maximo,
            Expediente: expediente

        })
        .then(function() {
            console.log("Document successfully updated!");
            boton.innerHTML = 'Guardar';

            document.getElementById('nombre').value = '';
            document.getElementById('telefono').value = '';
            document.getElementById('direccion').value = '';
            document.getElementById('edad').value = '';
            document.getElementById('pulso-minimo').value = '';
            document.getElementById('pulso-maximo').value = '';
            document.getElementById('expediente').value = '';

        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }
};

function ubicar(id,NombreCompleto,actual,PulsoMinimo,PulsoMaximo,latitud,longitud){
  document.getElementById('idPaciente').value=id;
  document.getElementById('nombreModal').value = NombreCompleto;
document.getElementById('pulso-actualModal').value=actual;
  document.getElementById('pulso-minimoModal').value = PulsoMinimo;
  document.getElementById('pulso-maximoModal').value = PulsoMaximo;

};
function ConvertirEntero(mensaje) {
  if (mensaje!='""' || mensaje!=null) {
    var inicio = mensaje.indexOf('"') + 1;
    var NumCaracter = mensaje.lastIndexOf('"') - 1;
    var res = parseFloat(mensaje.substr(inicio, NumCaracter));
    return res;
  }
  else
  {
    return "No hay datos, por favor revise la base de datos";
  }

};
