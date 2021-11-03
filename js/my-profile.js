function saveProfile() {
  // Función que guarda el perfil del usuario hasta que se limpie el localStorage
  if (
    // Tomo requeridos los datos siguientes
    document.getElementById("first-name").value === "" ||
    document.getElementById("first-surname").value === "" ||
    document.getElementById("age").value === "" ||
    document.getElementById("email").value === "" ||
    document.getElementById("phone-number").value === ""
  ) {
    // Si no se completaron saco una alerta que indique que faltan cosas
    let html = `<div class="alert alert-tomato" role="alert">
    Debes llenar todos los datos <strong>requeridos</strong>, marcados con un <strong>*</strong>.
  </div>`;
    document.getElementById("not-complete-alert").innerHTML = html;
    showProfile(undefined);
  } else {
    // Si completaron todo lo requerido armo el objeto información
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
    document.getElementById("not-complete-alert").innerHTML = ""; // Para no mostrar más la alerta si hubo antes
    showProfile(info); // Llamo a la función que lo muestra cada vez que se guarden nuevamente
  }
}

function showProfile(info) {
  // Función que muestra todos los datos entrados por el usuario
  let html = "";
  if (info != undefined) {
    // Si está definido muestro los datos del perfil
    html =
      `
    <div class="row mt-2">
      <div class="col-md-6">
        <p class="mb-1 f-w-600">Primer nombre</p>
        <h6 class="text-muted f-w-400">` +
      info.firstname +
      `</h6>
      </div>
      <div class="col-md-6">
        <p class="mb-1 f-w-600">Segundo nombre</p>
        <h6 class="text-muted f-w-400">
          ` +
      info.secondname +
      `
        </h6>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-md-6">
        <p class="mb-1 f-w-600">Primer apellido</p>
        <h6 class="text-muted f-w-400">
          ` +
      info.firstsurname +
      `
        </h6>
      </div>
      <div class="col-md-6">
        <p class="mb-1 f-w-600">Segundo apellido</p>
        <h6 class="text-muted f-w-400">
          ` +
      info.secondsurname +
      `
        </h6>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-md-6">
        <p class="mb-1 f-w-600">Teléfono</p>
        <h6 class="text-muted f-w-400">` +
      info.phone +
      `</h6>
      </div>
      <div class="col-md-6">
        <p class="mb-1 f-w-600">Edad (años)</p>
        <h6 class="text-muted f-w-400">` +
      info.age +
      `</h6>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-md-12">
        <p class="mb-1 f-w-600">E-mail</p>
        <h6 class="text-muted f-w-400">` +
      info.email +
      `</h6>
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
  document.getElementById("profile-data").innerHTML = html;
}

function addPhoto() {
  const imgPath = document.getElementById("input-image").files[0]; // Carga algo tipo blob a partir del input
  const reader = new FileReader();
  reader.onload = function () {
    // Cuando se cargue lo nuevo
    localStorage.setItem("profileImage", reader.result); // Guardamos en el localStorage
  };

  if (imgPath) {
    // Si hay algo cargado lo lee como URL para poder verlo
    reader.readAsDataURL(imgPath);
  }
  showPhoto(); // Mostramos la foto
}

function showPhoto() {
  // Función que muestra la foto
  var dataImage = localStorage.getItem("profileImage"); // A partir del localStorage llamamos a los datos de la imagen
  if (dataImage != null) {
    // Si hay algo cargado la mostramos
    let profileImage = document.getElementById("profile-image");
    profileImage.src = dataImage; // Lo que tenemos guardado es la source de la imagen, por eso definimos el atributo src del tag img con id profile-image
    document.getElementById("not-image").innerHTML = ""; // Sacamos el mensaje de no hay imagen
  } else {
    // Si no hay nada cargado mostramos el mensaje
    let html = `<p class="mb-1 text-justify"> No se ha cargado una imagen :( </p>`;
    document.getElementById("not-image").innerHTML = html;
  }
}

document.addEventListener("DOMContentLoaded", function (e) {
  if (localStorage.getItem("info") != null) {
    // Si hay información en el objeto info:
    var profile = JSON.parse(localStorage.getItem("info")); // Creamos la variable profile que contiene los datos del objeto info parseados a JSON
    // Para que queden mostrados en los campos de imput
    document.getElementById("first-name").value = profile.firstname;
    document.getElementById("first-surname").value = profile.firstsurname;
    document.getElementById("second-name").value = profile.secondname;
    document.getElementById("second-surname").value = profile.secondsurname;
    document.getElementById("age").value = profile.age;
    document.getElementById("email").value = profile.email;
    document.getElementById("phone-number").value = profile.phone;
    // Mostramos los datos en el perfil no modificable
    showProfile(profile);
  } else {
    // Si no hay nada adentro del objeto info le ponemos algo indefinido a la función showProfile para que nos muestre que no hay nada ingresado
    let profile = undefined;
    showProfile(profile);
  }
  showPhoto();
});
