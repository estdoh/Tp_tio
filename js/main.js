"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // Obtengo un número aleatorio y realizo suma.
    let numeroRandom1 = Math.floor(Math.random() * (10 - 1) + 1);
    let numeroRandom2 = Math.floor(Math.random() * (10 - 1) + 1);
    // Obtengo el elemento donde se mostrará el captcha
    let codigoCaptcha = document.querySelector('#codigo-captcha');
    // Obtengo el elemento que me indica que el captcha ingresado es válido.
    let resultadoValidoCaptcha = document.querySelector('#resultado-valido-captcha');
    // Por defecto le agrego la clase ocultar captcha para que no se muestre.
    resultadoValidoCaptcha.classList.add("ocultar-captcha");
    // Obtengo el elemento que me indica que el captcha ingresado es inválido.
    let resultadoInvalidoCaptcha = document.querySelector('#resultado-invalido-captcha');
    // Por defecto le agrego la clase ocultar captcha para que no se muestre.
    resultadoInvalidoCaptcha.classList.add("ocultar-captcha");
    // Agrego el valor del numero random (captcha) al html.
    codigoCaptcha.innerHTML = `${numeroRandom1} + ${numeroRandom2}`;
    // Obtengo el botón de suscripción.
    let formSuscripcion = document.querySelector('#form-suscripcion');
    // Agrego el evento click al botón suscribirse
    formSuscripcion.addEventListener('submit', (event) => {
        let formData = new FormData(formSuscripcion);

        let randomSuma = numeroRandom1 + numeroRandom2;

        // Obtengo el valor del input ingresado por el usuario
        let valorCaptcha = formData.get('captcha');
        /* 
        Si el valor ingresado es igual al numero random del captcha agrego clase mostrar-captcha al 
        elemento resultadoValidoCaptcha y elimino la clase anterior. También agrega la clase ocultar-captcha 
        al resultadoInvalidoCaptcha.
        */
        if (valorCaptcha == randomSuma) {
            resultadoValidoCaptcha.classList.remove("ocultar-captcha");
            resultadoValidoCaptcha.classList.add("mostrar-captcha");
            resultadoInvalidoCaptcha.classList.remove("mostrar-captcha");
            resultadoInvalidoCaptcha.classList.add("ocultar-captcha");
        }

        /*
        Caso contrario, agrego clase mostrar-captcha al elemento resultadoInvalidoCaptcha y 
        elimino la clase anterior. También elimino la clase mostrar-captcha al resultadoValidoCaptcha.
        */
        else {
            resultadoValidoCaptcha.classList.add("ocultar-captcha");
            resultadoValidoCaptcha.classList.remove("mostrar-captcha");
            resultadoInvalidoCaptcha.classList.remove("ocultar-captcha");
            resultadoInvalidoCaptcha.classList.add("mostrar-captcha");
        }

        // Evita action en formulario
        event.preventDefault();
    });
});






