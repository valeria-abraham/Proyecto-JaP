//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
var currentComments=[];
const ORDER_ASC_BY_SCORE= "menorMayor";
const ORDER_DESC_BY_SCORE="Mayormenor";
const ORDER_ASC_BY_DATE= "ANTES";
const ORDER_DESC_BY_DATE="DESPUES";
var currentSortCriteria = undefined;

function sortComments(criteria, array){ //función que ordena los comentarios por puntuación o fecha
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

function showStars(n,max){
  let number=parseInt(n);
  let htmlStars="";
  let m=parseInt(max)
  for(let i=1;i<=number;i++){ // En vez de poner estrellas pongo autitos porque el producto es un auto
    htmlStars+=`<span class="fa fa-car checkedred"></span>`
  }
  for(let i=number+1;i<=m;i++){
    htmlStars+=`<span class="fa fa-car"></span>`
  }
  return htmlStars;
}

function showComments(commentInfo){
    let htmlContentToAppend="";
    for(let i = 0; i <commentInfo.length; i++){ //recorro la lista al revés
        let comment = commentInfo[i];
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
        

    document.getElementById("comment").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowComments(sortCriteria, commentsArray){
  currentSortCriteria = sortCriteria;

  if(commentsArray != undefined){
      currentComments = commentsArray;
  }

  currentComments = sortComments(currentSortCriteria, currentComments);

  //Muestro los productos ordenados
  showComments(currentComments);
}

function addComments(commentsArray){
  let date= new Date();
  let formatDate= date.getFullYear().toString()+"-"
  +(date.getMonth()+1).toString().padStart(2,'0')+"-"+
  date.getDate().toString().padStart(1,'0')+" "+date.getHours().toString().padStart(2,'0')+":"
  +date.getMinutes().toString().padStart(2,'0')+":"+date.getSeconds().toString().padStart(2,'0');
  let message=document.getElementById("textarea").value;
  let score=1;
  var selected = document.getElementsByName("estrellas");
  for(i = 0; i < selected.length; i++) {
      if(selected[i].checked){
      score=selected[i].value;
  }}
  if(message.trim()!=""){ // Para que no admita comentarios vacíos
    comment={
      description: message,
      dateTime: formatDate,
      score: score,
      user: localStorage.getItem("Nombre")
    }
    currentComments.push(comment)
    sortAndShowComments(ORDER_ASC_BY_DATE,currentComments);
  }
}

function showProductInfo(productInfo){
  let htmlNombre = `<h1 style="font-weight:800; text-align: center;">`+ productInfo.name +`</h1>`;
  document.getElementById("product-name").innerHTML = htmlNombre;
  let htmlInfo = `
    <p class="card-text" style="text-align:justify;">`+productInfo.description+`</p>
      <div class="col-12">
        <div class="row">
          <div class="col-5">
            <p class="badge badge-tomato" style="font-size:1.3em">`+productInfo.currency+` `+productInfo.cost+`</p>
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
  // Cargo las imagenes en el carousel
  let htmlImages=`<div class="carousel-inner">`;
  let htmlLista="";
  for(let i = 0; i <productInfo.images.length; i++){
    let image = productInfo.images[i];
    if (i===0){ // Hago por separado el primero que lleva la clase active
      htmlLista+=`<li data-target="#carouselExampleIndicators" data-slide-to="`+i+`" class="active"></li>`;
    }else{
      htmlLista+=`<li data-target="#carouselExampleIndicators" data-slide-to="`+i+`"></li>`;
    }
    // Cargo las imágenes
    if (i===0){ // Hago por separado el primero que lleva la clase active
      htmlImages+=` 
      <div class="carousel-item active">
        <img class="d-block w-100 rounded" src=`+image+` alt="First slide">
      </div>`;
    }else{
      htmlImages+=` 
      <div class="carousel-item">
        <img class="d-block w-100 rounded" src=`+image+` alt="First slide">
      </div>`;
    }} 
    // Cargo la parte final de las flechas del carousel
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

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            showProductInfo(resultObj.data)
        }
    });
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentComments=resultObj.data;
            sortAndShowComments(ORDER_ASC_BY_SCORE,currentComments)
        }
    });
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
    document.getElementById("submit-comment").addEventListener("click", function(){
      addComments(currentComments);
      document.getElementById("textarea").value=""; // Para limpiar donde se escribe
      var ele = document.getElementsByName("estrellas"); // Para limpiar la selección de puntos
      for(var i=0;i<ele.length;i++)
        ele[i].checked = false;
    });
    document.getElementById("clean-comment").addEventListener("click", function(){
      document.getElementById("textarea").value="";
      var ele = document.getElementsByName("estrellas"); // Para limpiar la selección de puntos
      for(var i=0;i<ele.length;i++)
        ele[i].checked = false;
    });
});