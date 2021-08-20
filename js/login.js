function validar(){
    let nombre=document.getElementById("user").value;
    let password=document.getElementById("pwd").value;

    if(nombre!=""&&password!=""){
        window.location.href = "home.html";
    }else{
        alert("Poner usuario y contraseña")
    }
    
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

});