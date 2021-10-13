
function showCarrito(carrito) {
    let html = "";
    for (let i = 0; i < carrito.articles.length; i++) {
        let art = carrito.articles[i];
        let ex = exchange(art.currency,'UYU',parseFloat(art.unitCost))
        html += `
        <div class="list-group-item list-group-item-action mt-2" style="border:1px solid white">
            <div class="row" >
                <div class="col-2">
                    <a href="product-info.html">
                        <img class="d-block rounded img-carrito" src=`+art.src+`>
                    </a>
                </div>
                <div class="col-4"style="text-align:left;">
                    <h5>` + art.name + `</h5>
                    <p> Costo unitario ` + art.currency + ` ` + art.unitCost + `</p>
                </div>
                <div class="col-3">
                    <div class="d-flex w-100 justify-content-between">
                        <span> 
                            Cantidad: 
                            <input class="input-" type="number" name="` + i + `" value="` + art.count + `" min=1>
                        </span>
                    </div>
                </div>
                <div class="col-3">
                    <div class="row d-flex w-100" style="margin-left:20px;">
                        <h5 class="mr-2">Subtotal:  </h5>
                        <div id="subtotal-art` + i + `">
                            <p>` + ex[0] + ` ` +  parseFloat(art.count) * ex[1] + `</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
        if(i<carrito.articles.length-1){ // Para que se separen por una línea y quede lindo
            html+=`<div class="dropdown-divider-cart"></div>`;
          }
    }
    document.getElementById("cart").innerHTML = html;
}

function exchange(from,to,amount){
    let result = [to];
    if (from === 'UYU' && to === 'USD'){
        result.push( parseFloat(amount)/40);
    }else if (from === 'USD' && to === 'UYU'){
        result.push( parseFloat(amount)*40);
    }else{
        result.push( parseFloat(amount));
    }
    return result;
}

function subtotalArt(cost,art){ // función que toma el precio, cantidad e id del articulo para calcular el subtotal 
    let html = ""; 
    let idhtml = "subtotal-art"
    let count = 0 // hay que tomar la cantidad desde el input
    idhtml+=art
    html+=`<p>` + ex[0] + ` ` +  count* ex[1] + `</p>`
    document.getElementById(idhtml).innerHTML = html;
}

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData('https://japdevdep.github.io/ecommerce-api/cart/654.json').then(function (resultObj) { // obtengo el json del producto
        if (resultObj.status === "ok") {
            showCarrito(resultObj.data)
        }
    });
});