function saveProfile() {
  if (
    document.getElementById("first-name").value === "" ||
    document.getElementById("first-surname").value === "" ||
    document.getElementById("age").value === "" ||
    document.getElementById("email").value === "" ||
    document.getElementById("phone-number").value === ""
  ) {
    let html = `<div class="alert alert-tomato" role="alert">
    Debes llenar todos los datos <strong>requeridos</strong>, marcados con un <strong>*</strong>.
  </div>`;
    document.getElementById("alerta").innerHTML = html;
    showProfile(undefined)
  } else {
    var info = {
      // Creo un objeto JSON para guardar todos los datos entrados
      firstname: document.getElementById("first-name").value,
      firstsurname: document.getElementById("first-surname").value,
      secondname: document.getElementById("second-name").value,
      secondsurname: document.getElementById("second-surname").value,
      age: document.getElementById("age").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone-number").value,
    };
    localStorage.setItem("info", JSON.stringify(info)); // Convierto al objeto JSON en una string para poder guardarlo en el localStorage
    document.getElementById("alerta").innerHTML = '';
    showProfile(info); // Llamo a la función que lo muestra cada vez que se guarden nuevamente
  }
}

function showProfile(info) {
  // Función que muestra todos los datos entrados por el usuario
  let html = "";
  if (info != undefined) {
    // Muestro los datos del perfil
    html =`
    <div class="row mt-2">
      <div class="col-md-6">
        <p class="mb-1 f-w-600">Primer nombre</p>
        <h6 class="text-muted f-w-400">` + info.firstname + `</h6>
      </div>
      <div class="col-md-6">
        <p class="mb-1 f-w-600">Segundo nombre</p>
        <h6 class="text-muted f-w-400">
          ` + info.secondname + `
        </h6>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-md-6">
        <p class="mb-1 f-w-600">Primer apellido</p>
        <h6 class="text-muted f-w-400">
          ` + info.firstsurname + `
        </h6>
      </div>
      <div class="col-md-6">
        <p class="mb-1 f-w-600">Segundo apellido</p>
        <h6 class="text-muted f-w-400">
          ` + info.secondsurname + `
        </h6>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-md-6">
        <p class="mb-1 f-w-600">Teléfono</p>
        <h6 class="text-muted f-w-400">` + info.phone + `</h6>
      </div>
      <div class="col-md-6">
        <p class="mb-1 f-w-600">Edad (años)</p>
        <h6 class="text-muted f-w-400">` + info.age + `</h6>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-md-12">
        <p class="mb-1 f-w-600">E-mail</p>
        <h6 class="text-muted f-w-400">` + info.email + `</h6>
      </div>
    </div>`;
  } else {
    // Si no están cargados los datos todavía aviso
    html = `<div class="row mt-2">
    <div class="col-md-12">
      <div class="card bg-tomato">
        <div class="card-body text-center">
          No has entrado los datos de tu perfil entonces no los
          podemos mostrar :(
        </div>
      </div>
    </div>
  </div>`;
  }

  document.getElementById("datos-personales").innerHTML = html;
}

// function addPhoto(){
//   bannerImage = document.getElementById('bannerImg');
//   imgData = getBase64Image(bannerImage);
//   localStorage.setItem("imgData",imgData);
// }

// function showPhoto(){
//   var dataImage = localStorage.getItem('imgData');
//   bannerImg = document.getElementById('tableBanner');
//   bannerImg.src = "data:image/png;base64," + dataImage;
// }

// function getBase64Image(img) {
//   var canvas = document.createElement("canvas");
//   canvas.width = img.width;
//   canvas.height = img.height;

//   var ctx = canvas.getContext("2d");
//   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//   var dataURL = canvas.toDataURL("image/jpeg");
//   return dataURL;;
// }

document.addEventListener("DOMContentLoaded", function (e) {
  if (localStorage.getItem("info") != null) {
    var datos = JSON.parse(localStorage.getItem("info"));
    document.getElementById("first-name").value = datos.firstname;
    document.getElementById("first-surname").value = datos.firstsurname;
    document.getElementById("second-name").value = datos.secondname;
    document.getElementById("second-surname").value = datos.secondsurname;
    document.getElementById("age").value = datos.age;
    document.getElementById("email").value = datos.email;
    document.getElementById("phone-number").value = datos.phone;
    showProfile(datos);
  } else {
    let datos = undefined;
    showProfile(datos);
  }
});
