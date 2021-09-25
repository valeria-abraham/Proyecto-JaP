const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

var showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function(url){
    var result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

function showName(){ //función que muestra el nombre en la barra de navegación de la página
  // let htmlContentToAppend=`<a class="py-2 d-none d-md-inline-block" href="my-profile.html">`+localStorage.getItem("Nombre")+`</a>`;
  let htmlContentToAppend=`<div class="dropdown">
  <a class="py-2 d-none d-md-inline-block dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    `+localStorage.getItem("Nombre")+`
  </a>
  <div class="dropdown-menu dropdown-menu-dark " aria-labelledby="dropdownMenuLink">
    <a class="dropdown-item" style="color:#fff" href="my-profile.html">Mi perfil</a>
    <a class="dropdown-item" style="color:#fff" href="cart.html">Mi carrito</a>
    <div class="dropdown-divider"></div>
    <button class="dropdown-item btn-tomato" type="button" onclick="logOut()">Cerrar sesión</button>
  </div>
</div>`;
  
  if(document.getElementById("mi-nombre")!=null){ //solo muestra si está presente la barra de navegación arriba
  document.getElementById("mi-nombre").innerHTML=htmlContentToAppend;
  }
}

function isConnected(){ //esta función verifica que se haya hecho el inicio de sesión
  let nombre=localStorage.getItem("Nombre");
  if(nombre!=undefined || nombre!=null){
    showName(); //si estoy conectada muestro mi nombre de usuario en la barra de navegación
  }else if(window.location.pathname.slice(-10)!="index.html"){//veo si no estoy ya en la página de login
    window.location.href = "index.html"; //si no estoy conectada mando a la página de login
  }
}

function logOut(){
  localStorage.clear()
  window.location.href = "index.html"
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  isConnected();
});