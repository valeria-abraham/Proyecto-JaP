const MONEDA = "UYU"; // Defino la moneda con la que quiero trabajar
var carrito = []; // Para cargar los productos en el carrito
var carrito_length = 0;
var card = [];
var costo_total = 0;

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
        <div class="list-group-item mt-2" style="border:1px solid white">
            <div class="row" >
                <div class="col-sm-12 col-md-2 col-lg-2">
                    <a href="product-info.html">
                        <img class="d-block rounded img-carrito" src=` +
      art.src +
      `>
                    </a>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4" style="text-align:left;padding-right: 0px;padding-left: 0px;">
                    <h5>` +
      art.name +
      `</h5>
                    <p> Costo unitario ` +
      art.currency +
      ` ` +
      art.unitCost +
      `</p>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3" style="
                padding-left: 0px;
                padding-right: 0px;
            ">
                    <div class="justify-content-between">
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
      <button type="button" class="btn btn-anchor" onclick="removeItemCart(` +
      i +
      `)"><i class="far fa-trash-alt"></i> </button> 
                    </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3" style="
                padding-left: 0px;
                padding-right: 0px;
            ">
                    <div class="row" style="margin-left:0px;">
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
  costo_total = total_total;
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
  // Función que guarda el tipo de pago y lo muestra
  let html = "";
  let selected = document.getElementsByName("payment");
  let pago = 0;
  if (selected[0].checked) {
    html = `<button type="button" class="btn-non-format2 disabled">Ha seleccionado el pago por transferencia bancaria.</button>`;
    pago = selected[0].value;
    modal = `<div class="row mt-2">
    <div class="col-sm-12 col-md-12 col-lg-12">
      <div class="card bg-crema mb-1">
        <div class="card-body text-center">
          <p> El número de cuenta donde depositar es: <strong>1234567890</strong> </p>
        </div>
      </div>
    </div>
  </div>`;
    document.getElementById("modal-payment").innerHTML = modal;
  } else if (selected[1].checked) {
    html = `<button type="button" class="btn-non-format2 disabled">Ha seleccionado el pago por tarjeta de crédito.</button>`;
    pago = selected[1].value;
    modal = `<div class = "row">
  <div class="col-sm-12 col-md-12 col-lg-12 f-w-600 mb-2">
  <label class="labels">Número de tarjeta:</label
  ><input
    type="text"
    class="form-control"
    placeholder="xxxx - xxxx - xxxx - xxxx"
    id="card-number"
    value=""
    autocomplete="off"
  />
</div>
<div class="col-sm-12 col-md-12 col-lg-12 f-w-600 mb-2">
  <label class="labels">CVV:</label
  ><input
    type="text"
    class="form-control"
    placeholder="xxx (detrás de la tarjeta)"
    id="cvv"
    value=""
    autocomplete="off"
  />
</div>
<div class="col-sm-12 col-md-12 col-lg-12 f-w-600 mb-2">
  <label class="labels">Fecha de vencimiento:</label
  ><input
    type="month"
    class="form-control"
    placeholder="noviembre-2021"
    id="valid-date"
    value=""
    autocomplete="off"
  />
</div>
<div class="col-sm-12 col-md-12 col-lg-12 f-w-600 mb-2">
  <label class="labels">Titular de la tarjeta:</label
  ><input
    type="text"
    class="form-control"
    placeholder="Valeria Abraham"
    id="card-name"
    value=""
    autocomplete="off"
  />
</div>
</div>
<button type="button" class="btn btn-tomato" onclick="validatePayment()"> Verificar </button> 
<div id="payment-alert"></div>`;
    document.getElementById("modal-payment").innerHTML = modal;
  } else {
    html = `<button type="button" class="btn-non-format2 disabled">No se ha seleccionado una forma de pago.</button>`;
    pago = 0;
  }
  localStorage.setItem("payment", pago);
  document.getElementById("payment").innerHTML = html;
}

function validatePayment() {
  let html = "";
  if (
    document.getElementById("card-number").value != "" &&
    document.getElementById("valid-date").value != "" &&
    document.getElementById("cvv").value != "" &&
    document.getElementById("card-name").value != ""
  ) {
    html = `<div class="row mt-2">
    <div class="col-sm-12 col-md-12 col-lg-12">
      <div class="card bg-not-tomato mb-1">
        <div class="card-body text-center">
          Ha quedado registrada su tarjeta para realizar esta compra, puede finalizarla haciendo click en <strong>Cerrar</strong> y luego en <strong>Finalizar compra</strong>.
        </div>
      </div>
    </div>
  </div>`;
    document.getElementById("payment-alert").innerHTML = html;
    return 0;
  } else {
    html = `<div class="row mt-2">
    <div class="col-sm-12 col-md-12 col-lg-12">
      <div class="card bg-tomato mb-1">
        <div class="card-body text-center">
        Faltan completar datos de su tarjeta 
          
        </div>
      </div>
    </div>
  </div>`;
    document.getElementById("payment-alert").innerHTML = html;
    return 1;
  }
}

function shipping() {
  // Función que calcula y devuelve el costo de envío según el botón apretado
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
  // Función que borra el tipo de pago elegido
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
  document.getElementById("modal-payment").innerHTML = "";
  document.getElementById(
    "payment"
  ).innerHTML = `<button type="button" class="btn-non-format2 disabled">No se ha seleccionado una forma de pago.</button>`;
}

function validation() {
  // Función que valida los datos ingresados para finalizar la compra
  // Llamamos a todos los campos donde debería haber algo elegido
  let envio = shipping(); // La función devuelve 0 si no se apretó ningún botón
  let payment = localStorage.getItem("payment"); // Guardamos en el localStorage el tipo de pago como un número, si no se eligió se devuelve null
  let calle = document.getElementById("calle").value; // Elementos de los input de la dirección de envío
  let num = document.getElementById("num-puerta").value;
  let esq = document.getElementById("esq").value;
  let pais = document.getElementById("pais").value;
  let html = "";
  if (payment === 2 && validatePayment() === 1) {
    payment = null;
  }
  if (
    envio != 0 &&
    payment != null &&
    calle != "" &&
    num != "" &&
    esq != "" &&
    pais != "" &&
    costo_total != 0
  ) {
    // Si se completaron todos los datos requeridos mostramos que la compra se realizó con éxito
    html = `<div class="row mt-2">
    <div class="col-sm-12 col-md-12 col-lg-12">
      <div class="card bg-not-tomato mb-1">
        <div class="card-body text-center">
          Ha realizado su compra con éxito :)
        </div>
      </div>
    </div>
  </div>`;
    document.getElementById("not-complete-alert").innerHTML = html;
  } else {
    // Si hay alguno que no se haya rellenado mostramos que falta algo para llenar
    html = `<div class="row mt-2">
    <div class="col-sm-12 col-md-12 col-lg-12">
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

function removeItemCart(id) {
  // Función que remueve el item del carrito deseado
  let i = 0;
  for (let art of carrito.articles) {
    art.count = document.getElementById(i).value; // Guardamos la cantidad que tiene en el momento de borrar
    i++;
  }
  carrito.articles.splice(id, 1); // Sacamos el elemento dado del array
  carrito_length = carrito.articles.length; // Para que ande el showTotal()
  showCarrito(carrito);
  showTotal();
}

document.addEventListener("DOMContentLoaded", function (e) {
  if (localStorage.getItem("payment") != null) {
    // Para borrar la información del pago cada vez que recargo la página
    localStorage.removeItem("payment");
  }
  getJSONData("https://japdevdep.github.io/ecommerce-api/cart/654.json").then(
    function (resultObj) {
      // Obtengo el json del producto
      if (resultObj.status === "ok") {
        carrito = resultObj.data;
        carrito_length = carrito.articles.length; // Para no tener problemas llamando a la función showTotal() en cualquier lado
        showCarrito(carrito); // Llamo a la función que muestra los artículos del carrito
        showTotal(); // Llamo por primera vez a la función que muestra el total (con las cantidades originales del json)
      }
    }
  );
});
