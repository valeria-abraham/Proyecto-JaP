function validar() {
  // obtengo del formulario los valores de los elementos nombre y contraseña para validar
  let nombre = document.getElementById("user").value;
  let password = document.getElementById("pwd").value;
  //para validar la condicion es que no este vacio ningun campo
  //uso .trim() para evitar que se tome como valido ingresar solo espacios sin ningun caracter
  if (nombre.trim() != "" && password.trim() != "") {
    // cargo en el storage el nombre de la persona
    localStorage.setItem("Nombre", nombre);
    //llevo a la página home que sería el inicio una vez ingresado el usuario
    window.location.href = "home.html";
  } else {
    //si no se pone nada aparece una alerta
    alert("Poner usuario y contraseña");
  }
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}
