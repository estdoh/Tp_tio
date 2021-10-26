"use strict";

document.addEventListener("DOMContentLoaded", async () => {
    const url = 'https://60d10b827de0b2001710a01d.mockapi.io/api/v1/peliculas';

    // Variables para el paginador. 
    const peliculasPorPag = 5;
    let totalPeliculas, totalPaginas;
    let paginaActual = 1;


    let peliculas = [];
    //Variables que permiten acceder al DOM.
    let tbodyHorarios = document.querySelector("#tabla-horarios-body");
    let formAdministracion = document.querySelector("#form-administracion");
    let formFiltros = document.querySelector('#form-filtros');
    // let btnVaciar = document.querySelector('#btn-vaciar');
    // let btnCargaMultiple = document.querySelector('#btn-carga-multiple');

    peliculas = await obtenerDatos(1);
    armarPaginador();

    //LLama a la funcion tabla inicial
    cargarDatosTabla(peliculas);

    //Filtros
    formFiltros.addEventListener('submit', (event) => {
        let formData = new FormData(formFiltros);
        let categoria = formData.get('categoria');
        let tarjeta = formData.get('tarjeta');
        if (categoria || tarjeta) {
            tbodyHorarios.innerHTML = '';
            let peliculasFiltradas = [];
            peliculas.forEach((pelicula) => {
                if (categoria && tarjeta) {
                    if (pelicula.categoria == categoria && tarjeta == pelicula.promocion.tarjeta)
                        peliculasFiltradas.push(pelicula);
                } else
                    if (categoria) {
                        if (pelicula.categoria == categoria)
                            peliculasFiltradas.push(pelicula);
                    } else {
                        if (pelicula.promocion.tarjeta == tarjeta)
                            peliculasFiltradas.push(pelicula);
                    }
            });
            cargarDatosTabla(peliculasFiltradas);
        } else {
            tbodyHorarios.innerHTML = '';
            cargarDatosTabla(peliculas);
        }


        event.preventDefault();
    });

    formFiltros.addEventListener('reset', () => {
        tbodyHorarios.innerHTML = '';
        cargarDatosTabla(peliculas);
    })



    // //Suscripcion a los eventos clicks de cada uno de los botones
    // btnVaciar.addEventListener('click', () => {
    //     //Vacio el arreglo para sincronizarlo con la tabla
    //     peliculas = [];
    //     tbodyHorarios.innerHTML = '';
    // });

    // btnCargaMultiple.addEventListener('click', () => {
    //     //Peliculas extra que se van a cargar con el boton de carga multiple (x3)
    //     let peliculasExtra = [
    //         {
    //             "nombre": "Pequeños secretos",
    //             "categoria": "2D",
    //             "horario": {
    //                 "dia": new Date("2021-06-02").toLocaleDateString(),
    //                 "hora": "17:00"
    //             },
    //             "promocion": {
    //                 "descuento": 10,
    //                 "tarjeta": "BBVA"
    //             }
    //         },
    //         {
    //             "nombre": "Tom y Jerry",
    //             "categoria": "3D",
    //             "horario": {
    //                 "dia": new Date("2021-06-03").toLocaleDateString(),
    //                 "hora": "18:00"
    //             },
    //             "promocion": {
    //                 "descuento": 35,
    //                 "tarjeta": "Banco Nación"
    //             }
    //         },
    //         {
    //             "nombre": "Tiburón blanco",
    //             "categoria": "3D",
    //             "horario": {
    //                 "dia": new Date("2021-06-10").toLocaleDateString(),
    //                 "hora": "23:30"
    //             },
    //             "promocion": {
    //                 "descuento": 10,
    //                 "tarjeta": "Santander"
    //             }
    //         }

    //     ];

    //     for (let i = 0; i < peliculasExtra.length; i++) {
    //         cargarElementoTabla(peliculasExtra[i], tbodyHorarios);
    //         //Mantengo sincronizado el arreglo original con los datos de la tabla
    //     }
    // });

    //Para crear nueva pelicula desde el form
    formAdministracion.addEventListener('submit', async (event) => {
        event.preventDefault();

        let formData = new FormData(formAdministracion);
        let nuevaPelicula = obtenerInfoForm(formData);
        let respuesta = await cargarNuevaPelicula(nuevaPelicula);
        if (respuesta) {
            //Carga el objeto de nuevaPelicula a la tabla
            cargarElementoTabla(respuesta, tbodyHorarios);
            // Sincronizo la tabla con los datos de la api
            peliculas = await obtenerDatos(1);
            tbodyHorarios.innerHTML = '';
            cargarDatosTabla(peliculas);
            actualizarPaginador();
        }
    });



    function obtenerInfoForm(formData) {
        let inputPelicula = formData.get('pelicula');
        let inputCategoria = formData.get('categoria');
        let inputDia = formData.get('dia');
        let inputHora = formData.get('horario');
        let inputDescuento = formData.get('descuento');
        let inputTarjeta = formData.get('tarjeta');
        let nuevaPelicula = {
            "nombre": inputPelicula,
            "categoria": inputCategoria,
            "horario": {
                "dia": inputDia,
                "hora": inputHora
            },
            "promocion": {
                "descuento": inputDescuento,
                "tarjeta": inputTarjeta
            }
        }

        return nuevaPelicula;
    }

    //Funcion que carga un objeto JSON pelicula pasado por parámetro a la tabla de horarios
    function cargarElementoTabla(pelicula) {
        let fila = document.createElement('tr');

        crearFila(fila, pelicula);

        //Inserta una fila en el body de la tabla
        tbodyHorarios.appendChild(fila);
    }

    //Funcion para cargar la tabla con las peliculas de la mockAPI.
    function cargarDatosTabla(peliculas) {
        //Recorro el arreglo peliculas y lo muestro en el DOM
        for (let i = 0; i < peliculas.length; i++) {
            cargarElementoTabla(peliculas[i]);
        }
    }

    function crearFila(fila, pelicula) {
        let fechaHora = `${pelicula.horario.dia} - ${pelicula.horario.hora}`;
        let promocion = `${pelicula.promocion.descuento}% - ${pelicula.promocion.tarjeta}`;

        // Celda para boton borrar
        let tdBorrar = document.createElement('td');

        // Celda para boton editar
        let tdEditar = document.createElement('td');

        let btnEliminar = crearBoton(pelicula.id, 'Eliminar', fila, pelicula);
        let btnEditar = crearBoton(pelicula.id, 'Editar', fila, pelicula);

        if (pelicula.promocion.descuento > 20)
            fila.classList.add('fila-resaltada');
        fila.innerHTML = `<td> ${pelicula.nombre} </td>
                          <td> ${pelicula.categoria} </td>
                          <td> ${fechaHora}</td>
                          <td> ${promocion}</td>`;
        tdEditar.appendChild(btnEditar);
        tdBorrar.appendChild(btnEliminar);
        fila.appendChild(tdEditar);
        fila.appendChild(tdBorrar);
        return fila;
    }

    function crearBoton(id, tipo, fila, pelicula) {
        let boton = document.createElement("button");
        boton.name = tipo + id;
        boton.databuttonname = tipo + id;
        boton.innerHTML = `${tipo}`;
        boton.addEventListener('click', async () => {
            if (tipo === 'Editar') {
                let bancoSeleccionado;

                switch (pelicula.promocion.tarjeta) {
                    case 'Banco Santander':
                        bancoSeleccionado = `<option value="">Seleccionar tarjeta</option>
                            <option value="Banco Santander" selected>Banco Santander</option>
                            <option value="Banco Nacion">Banco Nación</option>
                            <option value="BBVA">BBVA</option>`
                        break;
                    case 'Banco Nacion':
                        bancoSeleccionado = `<option value="">Seleccionar tarjeta</option>
                            <option value="Banco Santander">Banco Santander</option>
                            <option value="Banco Nacion" selected>Banco Nación</option>
                            <option value="BBVA">BBVA</option>`;
                        break;
                    case 'BBVA':
                        bancoSeleccionado = `<option value="">Seleccionar tarjeta</option>
                            <option value="Banco Santander">Banco Santander</option>
                            <option value="Banco Nacion" >Banco Nación</option>
                            <option value="BBVA" selected>BBVA</option>`;
                        break;
                    default:
                        bancoSeleccionado = `<option value="" selected>Seleccionar tarjeta</option>
                            <option value="Banco Santander">Banco Santander</option>
                            <option value="Banco Nacion">Banco Nación</option>
                            <option value="BBVA">BBVA</option>`;
                        break;
                }

                fila.innerHTML = `<td><input type="text" class="editar-input" id="nombre-${id}" value="${pelicula.nombre}"></td>
                    <td><input type="text" class="editar-input" id="categoria-${id}" value="${pelicula.categoria}"></td>
                    <td><input type="date" class="editar-input" id="dia-${id}" value="${pelicula.horario.dia}">
                        <input type="time" id="hora-${id}" value="${pelicula.horario.hora}">
                    </td>
                    <td>
                        <input type="number" class="editar-input" id="promocion-${id}" value="${pelicula.promocion.descuento}">
                        <select class="editar-select" name="tarjeta" id="tarjeta-${id}">
                            ${bancoSeleccionado}
                        </select>
                    </td>
                    <td><button id="guardar-${id}">Guardar</button></td>
                    <td><button id="reset-${id}">Cancelar</button></td>`;

                let btnGuardar = document.querySelector(`#guardar-${id}`);
                let btnReset = document.querySelector(`#reset-${id}`);

                btnGuardar.addEventListener('click', async () => {
                    let nombre = document.querySelector(`#nombre-${id}`).value;
                    let categoria = document.querySelector(`#categoria-${id}`).value;
                    let hora = document.querySelector(`#hora-${id}`).value;
                    let dia = document.querySelector(`#dia-${id}`).value;
                    let promocion = document.querySelector(`#promocion-${id}`).value;
                    let tarjeta = document.querySelector(`#tarjeta-${id}`).value;
                    let nuevaPelicula = {
                        "nombre": nombre,
                        "categoria": categoria,
                        "horario": {
                            "dia": dia,
                            "hora": hora
                        },
                        "promocion": {
                            "descuento": promocion,
                            "tarjeta": tarjeta
                        }
                    };
                    const respuesta = await editarFila(nuevaPelicula, id);
                    if (respuesta) {
                        peliculas = await obtenerDatos(paginaActual);
                        // Sincronizo la tabla con los datos de la api
                        tbodyHorarios.innerHTML = '';
                        cargarDatosTabla(peliculas);
                        actualizarPaginador();
                    }
                    else
                        console.log("Error al editar fila");
                })

                btnReset.addEventListener('click', () => {
                    crearFila(fila, pelicula);
                })


            } else {
                let respuesta = await borrarFila(id);
                if (respuesta) {
                    peliculas = await obtenerDatos(1);
                    // Sincronizo la tabla con los datos de la api
                    tbodyHorarios.innerHTML = '';
                    cargarDatosTabla(peliculas);
                    actualizarPaginador();
                }
            }

        });
        return boton;
    }


    async function borrarFila(id) {
        try {
            let respuesta = await fetch(`${url}/${id}`, {
                "method": "DELETE",
                "mode": 'cors',
                "headers": { "Content-Type": "application/json" },
            });
            if (respuesta.status === 200)
                return true;
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    async function editarFila(nuevaPelicula, id) {
        try {
            let res = await fetch(`${url}/${id}`, {
                "method": "PUT",
                "mode": 'cors',
                "headers": { 'Content-Type': 'application/json' },
                "body": JSON.stringify(nuevaPelicula)
            });
            if (res.status === 200) {
                return await res.json();
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function cargarNuevaPelicula(nuevaPelicula) {
        try {
            let res = await fetch(url, {
                "method": "POST",
                "mode": "cors",
                "headers": {
                    "Content-Type": 'application/json'
                },
                "body": JSON.stringify(nuevaPelicula)
            });
            if (res.status === 201) {
                return await res.json();
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Devuelve el arreglo de peliculas de la mockAPI.
    async function obtenerDatos(pagina) {
        try {
            //Armo URL para paginar segun documentacion
            const newUrl = `${url}?page=${pagina}&limit=${peliculasPorPag}`;
            let res = await fetch(newUrl);
            if (res.status === 200) {
                let json = await res.json();
                totalPeliculas = json.count;
                return json.items;
            } else {
                tbodyHorarios.innerHTML = `<tr> <td colspan="6">Error al cargar datos.</td> </tr>`
            }
        } catch (error) {
            console.log(error);
        }
    }

    function armarPaginador() {
        const cantPaginas = calcularPaginas();
        totalPaginas = cantPaginas;
        let divPaginador = document.querySelector('#paginador');
        divPaginador.innerHTML = '';
        for (let i = 0; i < cantPaginas; i++) {
            let btnPaginador = document.createElement('button');
            btnPaginador.id = `btn-paginador${i + 1}`;
            let img = document.createElement('img');
            img.src = `https://img.icons8.com/ios/30/000000/${i + 1}.png`;
            btnPaginador.appendChild(img);
            divPaginador.appendChild(btnPaginador);
            btnPaginador.addEventListener('click', async () => {
                peliculas = await obtenerDatos(i + 1);
                tbodyHorarios.innerHTML = '';
                paginaActual = i + 1;
                cargarDatosTabla(peliculas);
            })
        }
    }

    function actualizarPaginador() {
        if (totalPaginas != calcularPaginas()) {
            armarPaginador();
        }
    }

    function calcularPaginas() {
        return totalPeliculas / peliculasPorPag;
    }
});