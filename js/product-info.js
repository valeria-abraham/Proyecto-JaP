const ORDER_ASC_BY_SCORE= "menorMayor";
const ORDER_DESC_BY_SCORE="Mayormenor";
const ORDER_ASC_BY_DATE= "ANTES";
const ORDER_DESC_BY_DATE="DESPUES";
var currentSortCriteria = undefined;
// ^^ Variables para orden de comentarios 
var currentComments=[];
// ^^ Arreglo para cargar los comentarios viejos más los nuevos 
var currentProduct=[];

//función que ordena los comentarios por puntuación o fecha
function sortComments(criteria, array){ 
  let result = [];
  // la función dentro de sort devuelve 1 si a es mayor que b, -1 si es menor, 0 si son iguales
  // si es positivo la función sort coloca a "a" después de "b", si es negativo lo coloca antes y si es 0 los deja en las posiciones que ya estaban
  if (criteria === ORDER_ASC_BY_SCORE){
      result = array.sort(function(a, b) {
          let aCount = parseInt(a.score);
          let bCount = parseInt(b.score);

          if ( aCount > bCount ){ return 1; }
          if ( aCount < bCount ){ return -1; }
          return 0;
      });
  }else if (criteria === ORDER_DESC_BY_SCORE){
      result = array.sort(function(a, b) {
          let aCount = parseInt(a.score);
          let bCount = parseInt(b.score);

          if ( aCount > bCount ){ return -1; }
          if ( aCount < bCount ){ return 1; }
          return 0;
      });
  }else if (criteria === ORDER_ASC_BY_DATE){
    result = array.sort(function(a, b) {
        // para poder leer la fecha bien uso esta función que convierte el string a fecha
        let aCount = new Date(a.dateTime); 
        let bCount = new Date(b.dateTime);

        if ( aCount > bCount ){ return 1; }
        if ( aCount < bCount ){ return -1; }
        return 0;
      });
  }else if (criteria === ORDER_DESC_BY_DATE){
      result = array.sort(function(a, b) {
        let aCount = new Date(a.dateTime);
        let bCount = new Date(b.dateTime);

          if ( aCount > bCount ){ return -1; }
          if ( aCount < bCount ){ return 1; }
          return 0;
      });
  };

  return result;
}

// función que agarra la puntuación dada (en número) y el máximo posible de puntuación y lo muestra
function showStars(n,max){ 
  let number=parseInt(n); // convierto el número dado a un entero
  let htmlStars=""; // creo la variable para cargar el código HTML
  let m=parseInt(max) // convierto el máximo a entero
  for(let i=1;i<=number;i++){ 
    // cargo a la variable htmlStars la cantidad de estrellas pintadas que concuerda con la puntuación dada (checkedred)
    // En vez de poner estrellas pongo autitos porque el producto es un auto
    htmlStars+=`<span class="fa fa-car checkedred"></span>`
  }
  for(let i=number+1;i<=m;i++){ 
    // cargo a htmlStars la cantidad de estrellas sin pintar 
    htmlStars+=`<span class="fa fa-car checkedgrey"></span>`
  }
  return htmlStars; // Devuelvo la variable con el código HTML cargado
}

// función que muestra los comentarios
function showComments(commentInfo){
    let htmlContentToAppend=""; 
    for(let i = 0; i <commentInfo.length; i++){ // recorro todo el array, comentario por comentario
        let comment = commentInfo[i];
        // llamo dentro de la variable a la función showStars con el score dado y pongo el máximo que es 5
        // también cargo el resto de la información del comentario
        htmlContentToAppend+=`
        <div class="card bg-light mb-3 " style="max-width: 100%;">
          <div class="card-header">
            <div class="row">
              <div class="col-6">
                `+comment.user+`
              </div>
              <div class="col-4"></div>
              <div class="col-2" style="text-align: right;">
              ${showStars(comment.score,5)} 
              </div>
            </div>
          </div>
          <div class="card-body">
            <p class="card-text">`+comment.description+`</p>
            <p class="card-text"><small class="text-muted">`+comment.dateTime+`</small></p> 
          </div>
        </div>
        `
    // mando todo al HTML al elemento con id comment, que es un div
    document.getElementById("comment").innerHTML = htmlContentToAppend; 
    }
}

// función que recibe un criterio de orden y un array, y lo muestra ordenado
function sortAndShowComments(sortCriteria, commentsArray){
  currentSortCriteria = sortCriteria;

  if(commentsArray != undefined){
      currentComments = commentsArray;
  }
  currentComments = sortComments(currentSortCriteria, currentComments);
  //Muestro el array de los comentarios ordenados
  showComments(currentComments);
}

// función que añade nuevos comentarios al array dado
function addComments(){
  let date= new Date(); // creo la variable con la fecha de realizado el comentario (tipo fecha)
  // le doy formato a la fecha para mostrarla de acuerdo a como está en el json de los otros comentarios (tipo string) 
  let formatDate= date.getFullYear().toString()+"-"
  +(date.getMonth()+1).toString().padStart(2,'0')+"-"+
  date.getDate().toString().padStart(1,'0')+" "+date.getHours().toString().padStart(2,'0')+":"
  +date.getMinutes().toString().padStart(2,'0')+":"+date.getSeconds().toString().padStart(2,'0');
  let message=document.getElementById("textarea").value; // obtengo desde el html lo que se escribe en la caja
  let score=1; // creo la variable que voy a usar para cargar la puntuación
  var selected = document.getElementsByName("estrellas"); 
  // cargo a la variable selected todos los elementos con el nombre estrella
  //que son los tag input para seleccinoar la puntuación
  // recorre todas las opciones de botones radio que hay con el nombre estrellas
  for(i = 0; i < selected.length; i++) { 
     if(selected[i].checked){ // filtra el botón apretado
      score=selected[i].value; // le asigna a score el valor del botón apretado
  }}
  if(message.trim()!=""){ // Para que no admita comentarios vacíos
    comment={ // armo el nuevo objeto comment
      description: message,
      dateTime: formatDate,
      score: score,
      user: localStorage.getItem("Nombre")
    }
    currentComments.push(comment) // cargo el nuevo comentario al array con todos los comentarios previos
    sortAndShowComments(ORDER_ASC_BY_DATE,currentComments); // los muestro en orden ascendente, el más reciente abajo del todo
  }
}

// función que muestra la información del producto, recibe un array con la información del json del producto
function showProductInfo(productInfo){
  // cargo con diferentes variables el código HTML
  // primero cargo el nombre del producto y lo mando al elemento con id product-name
  let htmlNombre = `<h1 style="font-weight:800; text-align: center;">`+ productInfo.name +`</h1>`;
  document.getElementById("product-name").innerHTML = htmlNombre;
  // ahora cargo la información del producto que va en la card de id product-information
  let htmlInfo = `
    <p class="card-text" style="text-align:justify;">`+productInfo.description+`</p>
      <div class="col-12">
        <div class="row">
          <div class="col-5">
            <a class="badge badge-tomato" style="font-size:1.3em" href="cart.html">`+productInfo.currency+` `+productInfo.cost+`</a>
          </div>
          <div class="col-3" style="text-align:right">
            <small class="text-muted"> Vendidos: `+productInfo.soldCount+` </small>
          </div>
          <div class="col-4" style="text-align:right">
            <small class="text-muted"> Categoría: <a href="category-info.html">`+productInfo.category+` </a></small>
          </div>
        </div>
      </div>  
  `;
  document.getElementById("product-information").innerHTML = htmlInfo;  
  // Cargo las imágenes en el carousel
  let htmlImages=`<div class="carousel-inner">`;
  let htmlLista="";
  // como hay más de una imagen hago un for para cargarlas todas
  // además, tengo que diferenciar entre la primera imagen y las demás por bootstrap y el carousel
  for(let i = 0; i <productInfo.images.length; i++){
    let image = productInfo.images[i];
    if (i===0){ // Hago por separado el primero que lleva la clase active
      htmlLista+=`<li data-target="#carouselExampleIndicators" data-slide-to="`+i+`" class="active"></li>`;
      htmlImages+=` 
      <div class="carousel-item active">
        <img class="d-block w-100 rounded" src=`+image+` alt="First slide">
      </div>`;
    }else{
      htmlLista+=`<li data-target="#carouselExampleIndicators" data-slide-to="`+i+`"></li>`;
      htmlImages+=` 
      <div class="carousel-item">
        <img class="d-block w-100 rounded" src=`+image+` alt="First slide">
      </div>`;
    }} 
    // Cargo la parte final de las flechas de navegación del carousel
    htmlImages+=`
    </div>
    <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>`;
  document.getElementById("carousel-list").innerHTML=htmlLista; // Cargo primero lo que va dentro del tag ol
  document.getElementById("carousel-images-in").innerHTML=htmlImages; // Cargo el resto
}

// función que muestra la información de los productos relacionados del producto principal de la pagina
//tomo related como el array del producto relacionado y product el del producto principal de la página
function showRelatedProducts(relatedArray,product){ 
  let html = "";
  // Vamos desde 0 hasta la longitud del array de los productos relacionados al principal
  for(i = 0; i < product.relatedProducts.length; i++){ 
    let index = product.relatedProducts[i]; // Obtenemos el índice de uno de los productos relacionados 
    let related = relatedArray[index]; // Llamamos al producto relacionado desde el array de todos los productos (relatedArray)
    html+=`
    <a  href="product-info.html" class="list-group-item list-group-item-action" style="border:1px solid #fff">
      <div class="row">
          <div class="col-3">
              <img src="`+related.imgSrc+`" alt="`+related.description+`" class="img-thumbnail">
          </div>
          <div class="col-9">
              <div class="d-flex w-100 justify-content-between">
                  <h4 class="mb-1">`+related.name+`</h4>
                  <small class="text-muted">`+related.soldCount+` vendidos</small>
              </div>
              <small class="text-muted">`+related.description+`</small>
              <p>`+related.currency+` `+related.cost+`</p>
          </div>
      </div>
    </a>
    `
    if(i<product.relatedProducts.length-1){ // Para que se separen por una línea y quede lindo
      html+=`<div class="dropdown-divider"></div>`;
    }
  }
  document.getElementById("related-products").innerHTML=html; // Cargamos al código html
}

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj){ // obtengo el json del producto
        if (resultObj.status === "ok"){
            currentProduct=resultObj.data // Cargamos la variable con el producto principal de la página
            showProductInfo(currentProduct) // muestro la información del producto
        }
    });
    getJSONData(PRODUCTS_URL).then(function(resultObj){ // obtengo el json del producto
      if (resultObj.status === "ok"){
        showRelatedProducts(resultObj.data,currentProduct) // muestro la información del producto relacionado
        // llamo a la función con el json obtenido de PRODUCTS_URL y con el producto principal de esta página
      }
  });
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){ // obtengo el json de los comentarios
        if (resultObj.status === "ok"){
          currentComments=resultObj.data; // asigno el currentComments para usarlo después si hay más añadidos en la página
          sortAndShowComments(ORDER_ASC_BY_SCORE,currentComments) // los muestro con un orden arbitrario
        }
    });
    // dependiendo del botón apretado ordeno los comentarios
    document.getElementById("sortAscScore").addEventListener("click", function(){
      sortAndShowComments(ORDER_ASC_BY_SCORE,currentComments);
    });
    document.getElementById("sortDescScore").addEventListener("click", function(){
      sortAndShowComments(ORDER_DESC_BY_SCORE,currentComments);
    });
    document.getElementById("sortAscTime").addEventListener("click", function(){
      sortAndShowComments(ORDER_ASC_BY_DATE,currentComments);
    });
    document.getElementById("sortDescTime").addEventListener("click", function(){
      sortAndShowComments(ORDER_DESC_BY_DATE,currentComments);
    });
    // al apretar el botón de enviar
    document.getElementById("submit-comment").addEventListener("click", function(){
      addComments(); // Añado el nuevo comentario
      document.getElementById("textarea").value=""; // Para limpiar donde se escribe
      var ele = document.getElementsByName("estrellas"); // Para limpiar la selección de puntos
      for(var i=0;i<ele.length;i++) // recorre todas las opciones de botones radio que hay con el nombre estrellas
        ele[i].checked = false;
    });
    // al apretar el botón de limpiar el comentario y puntuación
    document.getElementById("clean-comment").addEventListener("click", function(){
      document.getElementById("textarea").value=""; // Para limpiar donde se escribe
      var ele = document.getElementsByName("estrellas"); // Para limpiar la selección de puntos
      for(var i=0;i<ele.length;i++) // recorre todas las opciones de botones radio que hay con el nombre estrellas
        ele[i].checked = false;
    });
});