const MONEDA = "UYU"; // Defino la moneda con la que quiero trabajar
let carrito = []; // Para cargar los productos en el carrito
var carrito_length = 0;

function showCarrito(carrito) {
  // Función que muestra los productos en el carrito
  let html = "";
  for (let i = 0; i < carrito.articles.length; i++) {
    // Recorro todos los artículos del json
    let art = carrito.articles[i];
    let ex = exchange(art.currency, MONEDA, parseFloat(art.unitCost)); // Llamo a la función que hace la conversión de moneda
    // Vemos en el contenido para unir al código HTML, a cada input (para poner la cantidad) le asigno un id que
    // corresponde con su orden en el json, además llamo a la función update() cuando se cambia el valor (onchange)
    // Muestro también el nombre, la foto y el precio unitario del producto
    html +=
      `
        <div class="list-group-item list-group-item-action mt-2" style="border:1px solid white">
            <div class="row" >
                <div class="col-2">
                    <a href="product-info.html">
                        <img class="d-block rounded img-carrito" src=` +
      art.src +
      `>
                    </a>
                </div>
                <div class="col-4"style="text-align:left;">
                    <h5>` +
      art.name +
      `</h5>
                    <p> Costo unitario ` +
      art.currency +
      ` ` +
      art.unitCost +
      `</p>
                </div>
                <div class="col-3">
                    <div class="d-flex w-100 justify-content-between">
                        <span> 
                            Cantidad: 
                            <input class="input-" type="number" id="` +
      i +
      `" value="` +
      art.count +
      `" min = 1 onchange="update(` +
      i +
      `)">
                        </span>
                    </div>
                </div>
                <div class="col-3">
                    <div class="row d-flex w-100" style="margin-left:20px;">
                        <h5 class="mr-2">Subtotal:  </h5>
                        <div id="subtotal-art` +
      i +
      `">
                            <p>` +
      ex[0] +
      ` ` +
      parseFloat(art.count) * ex[1] +
      `</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    if (i < carrito.articles.length - 1) {
      // Para que se separen por una línea y quede lindo
      html += `<div class="dropdown-divider-cart"></div>`;
    }
  }
  document.getElementById("cart").innerHTML = html;
}

function exchange(from, to, amount) {
  // Función que convierte la moneda, con parámetros en orden: moneda original, moneda destino, cantidad
  let result = [to]; // Hago una lista para cargar el resultado, como primer objeto dentro tengo la moneda destino
  if (from === "UYU" && to === "USD") {
    // Comparo los diferentes cambios posibles que quiero
    result.push(parseFloat(amount) / 40);
  } else if (from === "USD" && to === "UYU") {
    result.push(parseFloat(amount) * 40);
  } else {
    result.push(parseFloat(amount)); // Por si está en UYU y no lo quiero cambiar
  }
  return result; // Devuelvo la moneda destino y el precio
}

function subtotalArt(articulo) {
  // Función que toma el id del artículo y nos da su subtotal
  let art = carrito.articles[articulo]; // Cargo al articulo en cuestión
  let cant = document.getElementById(articulo).value; // Llamo al valor del input, que es la cantidad
  let ex = exchange(art.currency, MONEDA, parseFloat(art.unitCost)); // Llamo a la función para obtener la conversión y el precio
  if (cant < 1) {
    // Si se pone menos que 1 en el input no se calcula el subtotal
    cant = 1;
    document.getElementById(art).value = 1;
  }
  document.getElementById("subtotal-art" + articulo).innerHTML =
    `<p>` + ex[0] + ` ` + cant * ex[1] + `</p>`; // Mostramos la moneda y el subtotal
  return cant * ex[1]; // También devolvemos el subtotal para calcular el total
}

function showTotal() {
  // Función que calcula el total y lo muestra (con el subtotal y el costo de envío)
  let html_art = "";
  let html_envio = "";
  let html_total = "";
  let total = 0;
  for (let i = 0; i < carrito_length; i++) {
    total += subtotalArt(i); // Sumo el subtotal de cada articulo
  }
  let envio = shipping(); // Dejo el valor de premium hasta la siguiente entrega
  let total_total = total + total * envio; // Calculo el total entero, subtotal de los artículos más el costo de envío
  html_art =
    `<p class="mt-2" style="text-align:end; font-size: 1.5em;">` +
    total +
    `</p>`;
  html_envio =
    `<p class="mt-2" style="text-align:end; font-size: 1.5em;">` +
    envio * total +
    `</p>`;
  html_total =
    `<p class="mt-2" style="text-align:end; font-size: 1.5em; font-weight:600;">` +
    total_total +
    `</p>`;
  document.getElementById("tot-art").innerHTML = html_art;
  document.getElementById("tot-envio").innerHTML = html_envio;
  document.getElementById("total-total").innerHTML = html_total;
  let html_moneda =
    `<p class="mt-2" style="text-align:end; font-size: 1.5em;"> ` +
    MONEDA +
    ` </p>`;
  document.getElementById("mon").innerHTML = html_moneda;
  document.getElementById("mone").innerHTML = html_moneda;
  html_moneda =
    `<p class="mt-2" style="text-align:end; font-size: 1.5em;font-weight:600;"> ` +
    MONEDA +
    ` </p>`;
  document.getElementById("mont").innerHTML = html_moneda;
}

function update(articulo) {
  // Función que llama a las funciones que calculan el subtotal de los artículos y el total entero
  subtotalArt(articulo);
  showTotal();
}

function savePayment() {
  let html = "";
  let selected = document.getElementsByName("payment");
  let pago = 0;
  if (selected[0].checked) {
    html = `<button type="button" class="btn-non-format2 disabled">Ha seleccionado el pago por transferencia bancaria.</button>`;
    pago = selected[0].value;
  } else if (selected[1].checked) {
    html = `<button type="button" class="btn-non-format2 disabled">Ha seleccionado el pago por tarjeta de crédito.</button>`;
    pago = selected[1].value;
  } else {
    html = `<button type="button" class="btn-non-format2 disabled">No se ha seleccionado una forma de pago.</button>`;
    pago = 0;
  }
  localStorage.setItem("payment", pago);
  document.getElementById("payment").innerHTML = html;
}

function shipping() {
  let selected = document.getElementsByName("envio-precio");
  let envio = 0;
  for (i = 0; i < selected.length; i++) {
    if (selected[i].checked) {
      envio = selected[i].value; // Asigna el valor del envío según lo seleccionado
    }
  }
  return envio;
}

function clearPayment() {
  let selected = document.getElementsByName("payment"); // Para limpiar la selección de pago
  for (
    i = 0;
    i < selected.length;
    i++ // recorre todas las opciones de botones radio que hay con el nombre envio-precio
  ) {
    selected[i].checked = false;
  }
  if (localStorage.getItem("payment") != null) {
    // Para borrar la información del pago cada vez que recargo la página
    localStorage.removeItem("payment");
  }
  document.getElementById("payment").innerHTML = `<button type="button" class="btn-non-format2 disabled">No se ha seleccionado una forma de pago.</button>`;
}

function validation() {
  let envio = shipping();
  let payment = localStorage.getItem("payment");
  let calle = document.getElementById("calle").value;
  let num = document.getElementById("num-puerta").value;
  let esq = document.getElementById("esq").value;
  let pais = document.getElementById("pais").value;
  let html = "";
  if (envio != 0 && payment != null && calle != "" && num != "" && esq != "" && pais !="") {
    html = `<div class="row mt-2">
    <div class="col-md-12">
      <div class="card bg-not-tomato mb-1">
        <div class="card-body text-center">
          Ha realizado su compra con éxito :)
        </div>
      </div>
    </div>
  </div>`;
    document.getElementById("not-complete-alert").innerHTML = html;
  } else {
    html = `<div class="row mt-2">
    <div class="col-md-12">
      <div class="card bg-tomato mb-1">
        <div class="card-body text-center">
          No has entrado todos los campos requeridos para realizar la compra (método de pago, dirección y tipo de envío).
        </div>
      </div>
    </div>
  </div>`;
    document.getElementById("not-complete-alert").innerHTML = html;
  }
}

document.addEventListener("DOMContentLoaded", function (e) {
  if (localStorage.getItem("payment") != null) {
    // Para borrar la información del pago cada vez que recargo la página
    localStorage.removeItem("payment");
  }
  getJSONData("https://japdevdep.github.io/ecommerce-api/cart/654.json").then(
    function (resultObj) {
      // obtengo el json del producto
      if (resultObj.status === "ok") {
        carrito = resultObj.data;
        carrito_length = carrito.articles.length; // Para no tener problemas llamando a la función showTotal() en cualquier lado
        showCarrito(carrito); // Llamo a la función que muestra los artículos del carrito
        showTotal(); // Llamo por primera vez a la función que muestra el total (con las cantidades originales del json)
      }
    }
  );
});
