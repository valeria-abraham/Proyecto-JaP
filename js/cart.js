const MONEDA = 'UYU';
let carrito = [];

function showCarrito(carrito) {
    let html = "";
    for (let i = 0; i < carrito.articles.length; i++) {
        let art = carrito.articles[i];
        let ex = exchange(art.currency,MONEDA,parseFloat(art.unitCost))
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
                            <input class="input-" type="number" id="` + i + `" value="` + art.count + `" min = 1 onchange="update(`+i+`)">
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

function subtotalArt(articulo){ // función que toma el precio, cantidad e id del articulo para calcular el subtotal 
    let art = carrito.articles[articulo];
    let cant = document.getElementById(articulo).value
    let ex = exchange(art.currency,MONEDA,parseFloat(art.unitCost));
    if (cant < 1){
        cant = 1;
        document.getElementById(art).value = 1;
    }
    document.getElementById("subtotal-art"+articulo).innerHTML = `<p>` + ex[0] + ` ` +  cant * ex[1] + `</p>`;
    return cant * ex[1]
}

function showTotal(){
    let html_art = "";
    let html_envio = "";
    let html_total = "";
    let total  = 0;
    for (let i = 0; i < carrito.articles.length; i++){
        total += subtotalArt(i)
    } 
    let envio = 0.15 // dejo envio premium hasta que se seleccione un botón (siguiente entrega)
    let total_total = total+total*envio
    html_art = `<p class="mt-2" style="text-align:end; font-size: 1.5em;">`+total+`</p>`;
    html_envio = `<p class="mt-2" style="text-align:end; font-size: 1.5em;">`+envio*total+`</p>`;
    html_total = `<p class="mt-2" style="text-align:end; font-size: 1.5em; font-weight:600;">`+total_total+`</p>`;
    document.getElementById("tot-art").innerHTML = html_art;
    document.getElementById("tot-envio").innerHTML = html_envio;
    document.getElementById("total-total").innerHTML = html_total;
    let html_moneda=`<p class="mt-2" style="text-align:end; font-size: 1.5em;"> `+MONEDA+` </p>`;
    document.getElementById("mon").innerHTML = html_moneda;
    document.getElementById("mone").innerHTML = html_moneda;
    html_moneda=`<p class="mt-2" style="text-align:end; font-size: 1.5em;font-weight:600;"> `+MONEDA+` </p>`;
    document.getElementById("mont").innerHTML = html_moneda;
}

function update(articulo){
    subtotalArt(articulo);
    showTotal();
}

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData('https://japdevdep.github.io/ecommerce-api/cart/654.json').then(function (resultObj) { // obtengo el json del producto
        if (resultObj.status === "ok") {
            carrito = resultObj.data;
            showCarrito(carrito)
            showTotal()
        }
    });
});