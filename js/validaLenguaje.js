let contenido = ""; //variable que almacenara todo el contenido del archivo

//Oculta y aparece las etiquetas que muestran un mensaje en la interfaz
function mensajes_Interfaz (msj,tipo){ 
    let msj_Archivo =  document.getElementById('mensajes');
    let consola = document.getElementById("consola");
    let resultado = document.getElementById('contenido');

    switch (tipo) {
        case 1: // Tipo 1 para mensajes de cargado archivo
            msj_Archivo.style.display="block";
            msj_Archivo.style.background="#c4fb6d";
            msj_Archivo.style.color="#373640"
            msj_Archivo.innerText= msj;
        break;

        case 2: // Tipo 2 para mensajes no cargados archivo
            msj_Archivo.style.display="block";
            msj_Archivo.style.background="#ff414d";
            msj_Archivo.style.color="white"
            msj_Archivo.innerText= msj;
        break;
        
        case 3: //Tipo 2 para consola y resultado éxitoso
            resultado.style.display="block";
            resultado.innerHTML=msj[0];
            resultado.style.background="#c4fb6d"
            resultado.style.color="#373640"
            consola.style.display="inline-block";
            consola.value=msj[1];
        break;

        case 4: //Tipo 2 para consola y resultado fallido
            resultado.style.display="block";
            resultado.innerHTML=msj[0];
            resultado.style.background="#ff414d";
            resultado.style.color="while"
            consola.style.display="inline-block";
            consola.value=msj[1];
        break;

        case 5: // Tipo 3 ocultar todo
            msj_Archivo.style.display="none";
            msj_Archivo.innerHTML=""
            consola.style.display="none";
            consola.value="";
            resultado.style.display="none";
            resultado.innerHTML="";
        break;
    }
}

window.addEventListener('load', () => {
    document.getElementById('archivoTexto').addEventListener('change', abrirArchivo);
});

function abrirArchivo(evento){ // cargar archivo y guardarlo en la variable "contenido"
    let archivo = evento.target.files[0]; //Obtiene el archivo
    mensajes_Interfaz("",5);

    if (archivo){
        let reader = new FileReader();
        reader.readAsText(archivo);
        reader.onload = function(e) {
            contenido = e.target.result;
        };
        mensajes_Interfaz("Archivo cargado: "+archivo.name,1);
    } else{
        contenido=""; // vacia el contenido del archivo anterior si lo hubo
        mensajes_Interfaz("No se ha seleccionado un archivo.",2);
    }
}


function iniciarValidacion(){//secuencia de validación de programa 
    if(contenido.length==0) //verifica si hay contenido a evaluar
        mensajes_Interfaz("Suba un archivo por favor.",2);
    else{
        contenido = formatearContenido();
        let resul = valida(contenido)

        if  (resul[0])
            mensajes_Interfaz(["!El programa es válido¡",resul[1]],3);
        else
            mensajes_Interfaz(["El programa no es válido",resul[1]],4);
    }
}


function formatearContenido (){
    var lines = contenido.split("\n"); // partir texto por linea
    let cont ="";//variable temporal para manipular texto
    
    for (let i = 0; i < lines.length; i++)
        cont+=lines[i].trim();//limpia las sangrias y saltos de linea

    let aux="";
    for (let index = 0; index < cont.length; index++) { // ciclo para eliminar espacios extras en el contenido

        if (cont.charAt(index)==" " && cont.charAt(index+1)==" "){
            index+=1;
            while(cont.charAt(index+1)==" ")   index++;
        }
        aux += cont.charAt(index);
    }
    return aux;
}



function valida (contenido){
    let caracter="";
    let estado="q0";
    let consol="";

    for (let index = 0; index < contenido.length; index++) {
        consol += "Estado: "+estado+"   carácter: "+caracter;

        index = index==75?76:index;
        caracter = contenido.charAt(index);
        caracter= caracter==" "?"esp":caracter;
        estado = tabla[estado][caracter];
        
        consol +="   Siguiente Estado: "+estado+" \n";
        
        if (estado=="q202")
            return [false,consol];

        if (index == contenido.length-1 && estado =="q201")
            return [true,consol];
    }
}

function error (index){
    let cadError = "";
    while (contenido.charAt(index)!=" "){
        cadError += contenido.charAt(index);
        index++;
    }
    return cadError;
}
