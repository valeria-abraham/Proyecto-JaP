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
    document.getElementById("not-complete-alert").innerHTML = html;
    showProfile(undefined);
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
    document.getElementById("not-complete-alert").innerHTML = "";
    showProfile(info); // Llamo a la función que lo muestra cada vez que se guarden nuevamente
  }
}

function showProfile(info) {
  // Función que muestra todos los datos entrados por el usuario
  let html = "";
  if (info != undefined) {
    // Muestro los datos del perfil
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
  const imgPath = document.querySelector("input[type=file]").files[0];
  const reader = new FileReader();
  reader.addEventListener(
    "load",
    function () {
      // convert image file to base64 string and save to localStorage
      localStorage.setItem("profileImage", reader.result);
    },
    false
  );
  if (imgPath) {
    reader.readAsDataURL(imgPath);
  }
  showPhoto();
}

function showPhoto() {
  var dataImage = localStorage.getItem("profileImage");
  if (dataImage != null) {
    let profileImage = document.getElementById("profile-image");
    profileImage.src = dataImage;
    document.getElementById("not-image").innerHTML = "";
  } else {
    let html = `<p class="mb-1 text-justify"> No se ha cargado una imagen :( </p>`;
    document.getElementById("not-image").innerHTML = html;
  }
}

document.addEventListener("DOMContentLoaded", function (e) {
  if (localStorage.getItem("info") != null) {
    var profile = JSON.parse(localStorage.getItem("info"));
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
