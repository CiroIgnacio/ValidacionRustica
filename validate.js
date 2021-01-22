//Continuando con una extension del formulario de la clase pasada, esta vez ademas de animarlo vamos a intentar validarlo
//1)Asignarle un evento de blur a cada input del formulario de manera tal que se cumplan las siguientes validaciones sin usar
//expresiones regulares :
//1.1)nombre : El nombre debe ser de una o dos palabras como máximo, si se ingresaran más solo se agarrarán las dos primeras.
//Cada palabra debe ser de por lo menos dos letras como mínimo. Se deben escapar los espacios de adelante y atras de cada palabra.
//1.2)apellido : El apellido debe ser de una o dos palabras como máximo, si se ingresaran más solo se agarrarán las dos primeras.
//Cada palabra debe ser de por lo menos cuatro letras como mínimo. Se deben escapar los espacios de adelante y atras de cada palabra.
//1.3)email : El email debe respetar el formato nombre@dominio.com pudiendo contener el nombre caracteres especiales como -_.
//1.4)reemail : Su valor debe ser identico al de email
//1.5)contraseña : La contraseña debe tener como mínimo 6 letras sin espacios y los caracteres especiales que se pueden usar son ?!_-.
//1.6)titulo : El titulo puede ser opcional. Si el mismo está faltante, se debe usar el string "Post Anonimo"
//1.7)mensaje : El mensaje debe tener como mínimo una letra. Puede ser cualquier caracter siempre y cuando el mismo no se
//imprima en pantalla sin ser escapado, de lo contrario podríamos tener un ataque XSS.

let inputs = document.querySelectorAll("input,textarea");
let registroInv = 0;
inputs.forEach(function (input) {
  input.setAttribute("novalidate", true);
  input.addEventListener("focus", function (e) {
    e.target.parentNode.children[0].classList.add("subir");
    e.target.parentNode.classList.add("animacionBorde");
  });

  input.addEventListener("blur", function (e) {
    if (e.target.value.length <= 0) {
      e.target.parentNode.children[0].classList.remove("subir");
      e.target.parentNode.classList.remove("animacionBorde");
    }
// Valida nombre y apellido
    if (e.target.id == "nombre" || e.target.id == "apellido") {
      if (e.target.id == "nombre") {
        let nombreCont = e.target.value.trim().split(" ");
        if (nombreCont.length < 1) {
          registroInv++;
        } else {
          registroInv = 0;
          for (let i = 0; i < nombreCont.length; i++) {
            if (nombreCont[i].length < 2) {
              registroInv++;
            }
          }
          if(nombreCont.length > 1){
            let nombreValido = nombreCont[0] + " " + nombreCont[1];
            nombreCont.value = nombreValido;
          }
        }
      } else {
        let apellidoCont = e.target.value.trim().split(" ");
        if (apellidoCont.length < 1) {
          registroInv++;
        } else {
          registroInv = 0;
          for (let i = 0; i < apellidoCont.length; i++) {
            if (apellidoCont[i].length < 4) {
              registroInv++;
            }
          }
          if (apellidoCont.length > 1){
            let apellidoValido = apellidoCont[0] + " " + apellidoCont[1];
            apellidoCont.value = apellidoValido;
            }
        }
      }
    } // Valida email
    else if (e.target.id == "email") {
        let emailValido = true;
        let arroba = 0;
        for(let i = 0; i < e.target.value.length; i++){ // Toda esta locura es para que cumpla con los requisitos del mail bansándome en UTF-16 ASCII 
            if ((e.target.value.charCodeAt(i) < 48 && e.target.value.charCodeAt(i) != 45 && e.target.value.charCodeAt(i) != 46 )
                || (e.target.value.charCodeAt(i) > 57 && e.target.value.charCodeAt(i) < 65 && e.target.value.charCodeAt(i) != 64) || 
                (e.target.value.charCodeAt(i) > 90 && e.target.value.charCodeAt(i) < 97 && e.target.value.charCodeAt(i) != 95 )){
                emailValido = false;
            }
            else {
                if (e.target.value.charCodeAt(i) == 64){
                    arroba++;
                }
            }    
        }
        if (emailValido && arroba == 1){
            registroInv = 0;
        }
        else {
            registroInv++;
        }
    } // Valida confirmación de email 
    else if (e.target.id == "reemail"){
      const email = document.getElementById("email");
      if (e.target.value == email.value) {
          registroInv = 0;
      } 
      else {
        registroInv++;
      }
    }
    else if (e.target.id == "password"){
      let passwordValida = true
      for(let i = 0; i < e.target.value.length; i++){
        if ((e.target.value.charCodeAt(i) < 48 && e.target.value.charCodeAt(i) != 46 && e.target.value.charCodeAt(i) != 33 )
                || (e.target.value.charCodeAt(i) > 57 && e.target.value.charCodeAt(i) < 65 && e.target.value.charCodeAt(i) != 63) || 
                (e.target.value.charCodeAt(i) > 90 && e.target.value.charCodeAt(i) < 97 && e.target.value.charCodeAt(i) != 95 )) {
                  passwordValida = false;
        } 
      }
      if (passwordValida && e.target.value.length > 6){
        registroInv = 0;
      }
      else {
        registroInv++;
      }
    }
    else if (e.target.id == "titulo"){
      e.target.value.length == 0 ? e.target.value = "Post Anomino" : false;
    }
  });
});

document.forms[0].addEventListener("submit", (e) => {
    inputs.forEach((input) => {
        if (input.value.length == 0) {
            registroInv++;
        }
    });
  if (!validar(registroInv)) {
    e.preventDefault();
  } else {
    inputs[inputs.length - 1].value = encodeURI(inputs[inputs.length - 1].value);
  }
});

const validar = (resultado) => {
  if (resultado > 0) {
    return false;
  }
  else {
      return true;
  }
};
// //2)Si no cumplieran con lo requerido, los mismos deberán mostrar un mensaje de 
//error customizado utilizando la API de validación de HTML5 que le corresponda en cada caso. 
//El elemento deberá además tener la clase error. 