function saveProfile() {
  var info = {
    firstname: document.getElementById("first-name").value,
    firstsurname: document.getElementById("first-surname").value,
    secondname: document.getElementById("second-name").value,
    secondsurname: document.getElementById("second-surname").value,
    age: document.getElementById("age").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone-number").value,
  };
  localStorage.setItem("info", JSON.stringify(info));
}

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
  }
});
