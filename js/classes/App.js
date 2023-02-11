import { crearDB, datosCita, nuevaCita } from '../funciones.js';
import { mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario } from '../selectores.js';

class App {
    constructor() {
        this.initApp();
    }

    initApp() {
        document.addEventListener('DOMContentLoaded', () => {
            eventListeners();
            crearDB();
        });

        eventListeners();
        function eventListeners() {
            mascotaInput.addEventListener('change', datosCita);
            propietarioInput.addEventListener('change', datosCita);
            telefonoInput.addEventListener('change', datosCita);
            fechaInput.addEventListener('change', datosCita);
            horaInput.addEventListener('change', datosCita);
            sintomasInput.addEventListener('change', datosCita);

            // Formulario Citas
            formulario.addEventListener('submit', nuevaCita);
        }
    }
}

export default App;