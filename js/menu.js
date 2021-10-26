"use strict";

//MENU MOBILE DESPLEGABLE
document.addEventListener("DOMContentLoaded", () => {
    let desplegable = document.querySelector(".menu-navbar");
    let btnMenu = document.querySelector(".menu-hamburguesa");
    btnMenu.addEventListener("click", () => {
        desplegable.classList.toggle("menu-navbar-visible");
    })
})