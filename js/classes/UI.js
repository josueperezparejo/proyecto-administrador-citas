import { eliminarCita, cargarEdicion, DB } from '../funciones.js';
import { contenedorCitas } from '../selectores.js';

class UI {
    imprimirAlerta(mensaje, tipo) {
        const alerta = document.querySelector('.alert-active');

        if (!alerta) {
            const divMensaje = document.createElement('div');
            divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12', 'alert-active');

            if (tipo === 'error') {
                divMensaje.classList.add('alert-danger');
            } else {
                divMensaje.classList.add('alert-success');
            }

            divMensaje.textContent = mensaje;
            document.querySelector('#add-citas').appendChild(divMensaje);

            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
        }
    }

    imprimirCitas() {
        this.limpiarHTML();

        const objectStore = DB.transaction('citas').objectStore('citas');

        objectStore.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;

            // Revisa si hay Citas para Imprimir 
            const total = objectStore.count();
            total.onsuccess = function () {
                if (total.result <= 0) {
                    const noCitas = document.createElement('p');
                    noCitas.classList.add('text-center', 'fw-bold', 'text-danger')
                    noCitas.textContent = 'Aun no hay Citas, Agrega algunas...'

                    contenedorCitas.appendChild(noCitas)
                    return
                };
            }

            // Si hay citas Itera sobre ellas y las Imprime en el HTML
            if (cursor) {
                const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cursor.value;

                const divCita = document.createElement('div');
                divCita.classList.add('cita', 'p-3', 'border-bottom', 'border-2', 'border-secondary-subtle');
                divCita.dataset.id = id;

                const mascotaParrafo = document.createElement('h2');
                mascotaParrafo.classList.add('card-title', 'text-capitalize');
                mascotaParrafo.innerHTML = `${mascota}`;

                const propietarioParrafo = document.createElement('p');
                propietarioParrafo.classList.add('mb-2', 'text-capitalize');
                propietarioParrafo.innerHTML = `<span class="fw-bold">Propietario: </span> ${propietario}`;

                const telefonoParrafo = document.createElement('p');
                telefonoParrafo.classList.add('mb-2');
                telefonoParrafo.innerHTML = `<span class="fw-bold">Teléfono: </span> ${telefono}`;

                const fechaParrafo = document.createElement('p');
                fechaParrafo.classList.add('mb-2');
                fechaParrafo.innerHTML = `<span class="fw-bold">Fecha: </span> ${fecha}`;

                const horaParrafo = document.createElement('p');
                horaParrafo.classList.add('mb-2');
                horaParrafo.innerHTML = `<span class="fw-bold">Hora: </span> ${hora}`;

                const sintomasParrafo = document.createElement('p');
                sintomasParrafo.classList.add('mb-2');
                sintomasParrafo.innerHTML = `<span class="fw-bold">Síntomas: </span> ${sintomas}`;

                const divBotones = document.createElement('div');

                const btnEliminar = document.createElement('button');
                btnEliminar.onclick = () => {
                    // sweetalert
                    Swal.fire({
                        title: 'Estas Seguro?',
                        text: "No podras recuperarlo!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si, Eliminarlo!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire(
                                'Eliminado!',
                                'Eliminado Correctamente.',
                                'success'
                            )

                            eliminarCita(id)
                        }
                    })
                };

                btnEliminar.classList.add('btn', 'btn-danger', 'me-2');
                btnEliminar.innerHTML = 'Eliminar <svg width="1rem" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

                const btnEditar = document.createElement('button');
                btnEditar.onclick = () => cargarEdicion(cursor.value);

                btnEditar.classList.add('btn', 'btn-info', 'me-2');
                btnEditar.innerHTML = 'Editar <svg width="1rem" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';

                divBotones.appendChild(btnEliminar);
                divBotones.appendChild(btnEditar);

                divCita.appendChild(mascotaParrafo);
                divCita.appendChild(propietarioParrafo);
                divCita.appendChild(telefonoParrafo);
                divCita.appendChild(fechaParrafo);
                divCita.appendChild(horaParrafo);
                divCita.appendChild(sintomasParrafo);
                divCita.appendChild(divBotones);

                contenedorCitas.appendChild(divCita);

                cursor.continue();
            }
        }
    }

    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

export default UI;