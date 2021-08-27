
function showName(){
    let htmlContentToAppend=`<a class="py-2 d-none d-md-inline-block" href="my-profile.html">`+localStorage.getItem("Nombre")+`</a>`;
    document.getElementById("mi-nombre").innerHTML=htmlContentToAppend;

}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    showName();
});