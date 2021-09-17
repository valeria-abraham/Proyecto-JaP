const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_SOLD_COUNT = "Cant. Vendidos";
const ORDER_ASC_BY_COST= "menorMayor";
const ORDER_DESC_BY_COST="Mayormenor";
var currentProductsArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;
var filteredList=[];

//función que ordena los productos alfabéticamente, por cantidad de vendidos (relevancia), o por precio
function sortProducts(criteria, array){
    let result = [];
    // la función dentro de sort devuelve 1 si a es mayor que b, -1 si es menor, 0 si son iguales
    // si es positivo la función sort coloca a "a" después de "b", si es negativo lo coloca antes y si es 0 los deja en las posiciones que ya estaban
    if (criteria === ORDER_ASC_BY_NAME){
        result = array.sort(function(a, b) { 
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_SOLD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_ASC_BY_COST){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.cost);
            let bCount = parseInt(b.cost);

            if ( aCount > bCount ){ return 1; }
            if ( aCount < bCount ){ return -1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_COST){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.cost);
            let bCount = parseInt(b.cost);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}
//función que muestra la lista de productos
function showProductsList(currentProductsArray){
    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductsArray.length; i++){
        let product = currentProductsArray[i];
//solo muestra si no está fuera del rango de máximo y mínimo o si no se deifinió eso aún
        if (((minCount == undefined) || (minCount != undefined && parseInt(product.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(product.cost) <= maxCount))){
//suma a la variable cada producto para poner en el html y mostrarlo, muestra su imagen, descripcion, nombre, cantidad de vendidos, moneda y precio
            htmlContentToAppend += `
            <a  href="product-info.html" class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">`+ product.name +`</h4>
                            <small class="text-muted">` + product.soldCount + ` vendidos</small>
                        </div>
                        <small class="text-muted">` + product.description + `</small>
                        <p>`+product.currency+` `+product.cost+`</p>
    
                    </div>
                </div>
            </a>`
        }
//se "mete" la variable con el contenido en formato html al archivo html
        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

//función que utiliza las otras dos, de manera que ordena los productos y después los muestra
function sortAndShowProducts(sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;

    if(productsArray != undefined){
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    //Muestro los productos ordenados
    showProductsList(currentProductsArray);
}

function search(){ //es la función para hacer la búsqueda en la barra
    var textInput=document.getElementById("search").value; //obtengo el texto introducido
    filteredList=currentProductsArray.filter(function(product){ //uso la función que filtra automáticamente y selecciono de dónde quiero buscar los caracteres introducidos
        return product.name.toLowerCase().indexOf(textInput.toLowerCase())>-1 || product.description.toLowerCase().indexOf(textInput.toLowerCase())>-1;
    })
    showProductsList(filteredList); // muestro los productos que corresponden a la búsqueda
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            sortAndShowProducts(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_SOLD_COUNT);
    });

    document.getElementById("sortDescCost").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_COST);
    });

    document.getElementById("sortAscCost").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_COST);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showProductsList(currentProductsArray);
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        showProductsList(currentProductsArray);
    });
    document.getElementById("search").addEventListener('keyup',function(){ 
        search(); //llamo a la función de búsqueda al escribir algo en la barra de búsqueda
    })
});