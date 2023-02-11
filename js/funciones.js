import Citas from './classes/Citas.js';
import UI from './classes/UI.js';
import { mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario } from './selectores.js';

const ui = new UI();
const administrarCitas = new Citas();

const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

export let DB;
let editando = false;

export function datosCita(event) {
    citaObj[event.target.name] = event.target.value;
}

export function nuevaCita(event) {
    event.preventDefault();

    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son Obligatorios', 'error');
        return;
    }

    if (editando) {
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');
        const peticion = objectStore.put(citaObj);

        transaction.oncomplete = () => {
            administrarCitas.editarCita({ ...citaObj });

            // SweetAlert
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Actualizado Correctamente',
                showConfirmButton: false,
                timer: 1500
            });

            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
            editando = false;
        }

        transaction.onerror = () => {
            // SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Hubo un error!'
            })
        }
    } else {
        citaObj.id = Date.now();
        administrarCitas.agregarCita({ ...citaObj });

        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');
        const peticion = objectStore.add(citaObj);

        transaction.oncomplete = () => {
            // SweetAlert
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Agregado Correctamente',
                showConfirmButton: false,
                timer: 1500
            });
        }

        transaction.onerror = () => {
        // SweetAlert
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error!'
          })
        }
    }

    ui.imprimirCitas();
    reiniciarObjeto();

    formulario.reset();
}

export function reiniciarObjeto() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

export function eliminarCita(id) {
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');

    const resultado = objectStore.delete(id);

    transaction.oncomplete = () => {
        administrarCitas.eliminarCita(id);
        ui.imprimirCitas()
    }

    transaction.onerror = () => {
        // SweetAlert
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error!'
          })
    }
}

export function cargarEdicion(cita) {

    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
}

export function crearDB() {
    const crearDB = window.indexedDB.open('citas', 1);

    crearDB.onerror = function () {
        // SweetAlert
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error!'
          })
    }

    crearDB.onsuccess = function () {
        DB = crearDB.result;
        ui.imprimirCitas();
    }

    crearDB.onupgradeneeded = function (event) {
        const db = event.target.result;

        const objectStore = db.createObjectStore('citas', { keyPath: 'id', autoIncrement: true });

        objectStore.createIndex('mascota', 'mascota', { unique: false });
        objectStore.createIndex('cliente', 'cliente', { unique: false });
        objectStore.createIndex('telefono', 'telefono', { unique: false });
        objectStore.createIndex('fecha', 'fecha', { unique: false });
        objectStore.createIndex('hora', 'hora', { unique: false });
        objectStore.createIndex('sintomas', 'sintomas', { unique: false });
        objectStore.createIndex('id', 'id', { unique: true });
    }
}