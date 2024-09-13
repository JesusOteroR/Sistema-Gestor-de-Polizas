document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("cuerpoTablaPolizas");
    const pagination = document.querySelector('.pagination');
    const pageSize = 10; // Número de registros por página
    let currentPage = 1; // Página actual
    let polizas = []; // Array para almacenar todos los registros
    let filteredPolizas = []; // Array para almacenar pólizas filtradas
    let aseguradorasMap = {}; // Mapa para almacenar nombres de aseguradoras
    
    // Consulta para sacar el nombre de la aseguradora
    fetch(`http://www.polizaswebapp.somee.com/api/Aseguradora`)
        .then(response => response.json())
        .then(data => {
            data.forEach(aseguradora => {
                aseguradorasMap[aseguradora.id_Aseguradora] = aseguradora;
            });
        })
        .catch(error => console.error("Error al obtener aseguradoras:", error));
    
    // Función para listar todas las pólizas
    function listarPolizas() {
        fetch(`http://www.polizaswebapp.somee.com/api/Poliza`)
            .then(response => response.json())
            .then(data => {
                polizas = data; // Guardar los datos en el array
                filteredPolizas = [...polizas]; // Inicialmente, no filtrar
                ordenarPolizasPorCobertura(); // Ordenar las pólizas antes de renderizar
                renderTable();
                setupPagination();
            })
            .catch(error => console.error("Error al obtener datos de la API:", error));
    }
    
    // Función para ordenar las pólizas por días restantes de cobertura
    function ordenarPolizasPorCobertura() {
        filteredPolizas.sort((a, b) => {
            const diasRestantesA = calcularDiasRestantes(a.fechaVencimiento);
            const diasRestantesB = calcularDiasRestantes(b.fechaVencimiento);
            return diasRestantesA - diasRestantesB; // Ordenar de menos a más días restantes
        });
    }
    
    // Función para renderizar la tabla
    function renderTable() {
        tabla.innerHTML = "";
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const paginatedPolizas = filteredPolizas.slice(start, end);
    
        paginatedPolizas.forEach(poliza => {
            const row = document.createElement("tr");
            const aseguradora = aseguradorasMap[poliza.id_Aseguradora] || { Nombre: "Desconocido" };
    
            const monto = formatearNumero(poliza.Cobertura); 
            const diasRestantes = calcularDiasRestantes(poliza.fechaVencimiento);
    
            let claseEstilo = "";
            let textoCobertura = "";
    
            if (diasRestantes === 0) {
                claseEstilo = "expirada"; // Aplica esta clase para pólizas con días negativos
                textoCobertura = "Quedan 0 días de cobertura"; // Texto específico para días 0
            } else if (diasRestantes < 0) {
                claseEstilo = "expirada"; // Aplica esta clase para pólizas con días negativos
                textoCobertura = "Quedan 0 días de cobertura"; // Texto específico para días negativos
            } else if (diasRestantes <= 10) {
                claseEstilo = "poco-cobertura";
                textoCobertura = `Quedan ${diasRestantes} días de cobertura`;
            } else if (diasRestantes <= 20) {
                claseEstilo = "media-cobertura";
                textoCobertura = `Quedan ${diasRestantes} días de cobertura`;
            } else {
                textoCobertura = `Quedan ${diasRestantes} días de cobertura`;
            }
    
            row.innerHTML = `
                <td><input type="checkbox" name="option" value="${poliza.id_Poliza}"></td>
                <td class="text-center">${poliza.id_Poliza}</td>
                <td class="text-center">
                    <a href="#" class="aseguradora-link" data-id="${poliza.id_Aseguradora}">
                        ${aseguradora.Nombre}
                    </a>
                </td>
                <td class="text-center">${poliza.Tipo}</td>
                <td class="text-center">${monto}</td>
                <td class="text-center ${claseEstilo}">${textoCobertura}</td>
                <td class="text-center">${poliza.Descripcion}</td>
                <td class="text-center">${poliza.id_Usuario}</td>
            `;
            tabla.appendChild(row);
        });
    
        // Agregar el manejador de eventos para los enlaces de aseguradoras
        document.querySelectorAll('.aseguradora-link').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const aseguradoraId = link.getAttribute('data-id');
                const aseguradora = aseguradorasMap[aseguradoraId];
    
                Swal.fire({
                    title: `Información de la Aseguradora`,
                    html: `
                        <p><strong>ID:</strong> ${aseguradora.id_Aseguradora}</p>
                        <p><strong>Nombre:</strong> ${aseguradora.Nombre}</p>
                        <p><strong>Teléfono:</strong> ${aseguradora.Telefono}</p>
                        <p><strong>Dirección:</strong> ${aseguradora.Direccion}</p>
                    `,
                    icon: 'info'
                });
            });
        });
    
        initCheckboxEvent();
    }
    
    // Función para configurar la paginación de pólizas
    function setupPagination() {
        const pageCount = Math.ceil(filteredPolizas.length / pageSize);
        pagination.innerHTML = ""; // Limpiar el contenedor de paginación
    
        // Botón para ir a la página anterior
        const botonAnterior = document.createElement("button");
        botonAnterior.innerHTML = "&laquo;"; // Flecha hacia la izquierda
        botonAnterior.classList.add("btn", "btn-sm", "btn-primary", "mx-1");
        botonAnterior.disabled = currentPage === 1; // Desactivar si está en la primera página
        botonAnterior.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
                setupPagination();
            }
        });
        pagination.appendChild(botonAnterior);
    
        // Botones de páginas
        for (let i = 1; i <= pageCount; i++) {
            const boton = document.createElement("button");
            boton.textContent = i;
            boton.classList.add("btn", "btn-sm", "btn-primary", "mx-1");
            boton.addEventListener("click", () => {
                currentPage = i;
                renderTable();
                setupPagination();
            });
            if (i === currentPage) {
                boton.classList.add("active");
            }
            pagination.appendChild(boton);
        }
    
        // Botón para ir a la página siguiente
        const botonSiguiente = document.createElement("button");
        botonSiguiente.innerHTML = "&raquo;"; // Flecha hacia la derecha
        botonSiguiente.classList.add("btn", "btn-sm", "btn-primary", "mx-1");
        botonSiguiente.disabled = currentPage === pageCount; // Desactivar si está en la última página
        botonSiguiente.addEventListener("click", () => {
            if (currentPage < pageCount) {
                currentPage++;
                renderTable();
                setupPagination();
            }
        });
        pagination.appendChild(botonSiguiente);
    }
    
    // Función para calcular los días restantes
    function calcularDiasRestantes(fechaVencimiento) {
        const hoy = new Date();
        const vencimiento = new Date(fechaVencimiento);
        const diferenciaTiempo = vencimiento - hoy;
        const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24)); // Convertir milisegundos a días
        return diferenciaDias < 0 ? 0 : diferenciaDias; // Si la diferencia es negativa, devolver 0
    }
    
    // Función para formatear números
    function formatearNumero(numero) {
        return new Intl.NumberFormat('es-CO').format(numero); // 'es-CO' para formato en Colombia
    }
    
    // Función para filtrar pólizas por número
    function buscarPoliza() {
        const searchInput = document.getElementById('searchInput').value.trim();
        filteredPolizas = polizas.filter(poliza => poliza.id_Poliza.toString().includes(searchInput));
        ordenarPolizasPorCobertura(); // Ordenar después de filtrar
        renderTable();
        setupPagination();
    }
    
    // Funciones para manejar eventos de checkbox
    function initCheckboxEvent() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="option"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    checkboxes.forEach(box => {
                        if (box !== this) {
                            box.checked = false;
                        }
                    });
                }
            });
        });
    }
    
    // Inicializar la lista de pólizas
    listarPolizas();
    
    // Configurar el botón de búsqueda
    document.getElementById('searchButton').addEventListener('click', buscarPoliza);
    
    // Configurar la búsqueda en tiempo real (opcional)
    document.getElementById('searchInput').addEventListener('input', buscarPoliza);
    
    
    function listarAseguradoras(selectElement) {
        fetch(`http://www.polizaswebapp.somee.com/api/Aseguradora`)
            .then(response => response.json())
            .then(data => {
                selectElement.innerHTML = ""; // Limpiar opciones existentes

                const optionDefault = document.createElement("option");
                optionDefault.textContent = "Selecciona una compañía aseguradora";
                optionDefault.value = "";
                selectElement.appendChild(optionDefault);

                data.forEach(aseguradora => {
                    const option = document.createElement("option");
                    option.textContent = aseguradora.Nombre;
                    option.value = aseguradora.id_Aseguradora;
                    selectElement.appendChild(option);
                });

                console.log(data);
            })
            .catch(error => console.error("Error al obtener datos de la API:", error));
    }

    function modificarPoliza() {
        const selected = document.querySelector('input[type="checkbox"]:checked');
    
        if (selected) {
            const polizaId = selected.value;
    
            fetch(`http://www.polizaswebapp.somee.com/api/Poliza/${polizaId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al obtener los datos de la póliza');
                    }
                    return response.json();
                })
                .then(poliza => {
                    const poli = poliza[0]; // Obtenemos la póliza del array
    
                    Swal.fire({
                        background: '#f3f3f2',
                        title: 'Modificar Póliza',
                        html: `
                            <div class="input-group mb-3">
                                <span class="input-group-text">Número de Póliza</span>
                                <div class="form-control bg-light">${poli.id_Poliza}</div>
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">Compañía Aseguradora</span>
                                <select class="form-select" aria-label="Default select example" id="companiaSeguro">
                                    <!-- Opciones se llenarán aquí -->
                                </select>
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">Tipo</span>
                                <input type="text" id="modificarTipo" class="form-control" value="${poli.Tipo}">
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">Cobertura</span>
                                <input type="text" id="modificarCobertura" class="form-control" value="${poli.Cobertura}">
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">Fecha Inicio</span>
                                <input type="date" id="modificarFechaInicio" class="form-control" value="${poli.fechaInicio}">
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">Fecha Vencimiento</span>
                                <input type="date" id="modificarFechaVencimiento" class="form-control" value="${poli.fechaVencimiento}">
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">Descripción</span>
                                <input type="text" id="modificarDescripcion" class="form-control" value="${poli.Descripcion}">
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">Usuario Responsable</span>
                                <input type="text" id="modificarUsuario" class="form-control" value="${poli.id_Usuario}">
                            </div>
                        `,
                        showCancelButton: true,
                        confirmButtonText: 'Guardar',
                        cancelButtonText: 'Cancelar',
                        showLoaderOnConfirm: true,
                        preConfirm: () => {
                            const modificarAseguradora = document.getElementById("companiaSeguro").value.trim();
                            const modificarTipo = document.getElementById("modificarTipo").value.trim();
                            const modificarCobertura = document.getElementById("modificarCobertura").value.trim();
                            const modificarFechaInicio = document.getElementById("modificarFechaInicio").value.trim();
                            const modificarFechaVencimiento = document.getElementById("modificarFechaVencimiento").value.trim();
                            const modificarDescripcion = document.getElementById("modificarDescripcion").value.trim();
                            const modificarUsuario = document.getElementById("modificarUsuario").value.trim();
    
                            const datosPoliza = {
                                id_Poliza: poli.id_Poliza,
                                id_Aseguradora: modificarAseguradora,
                                Tipo: modificarTipo,
                                Cobertura: modificarCobertura,
                                fechaInicio: modificarFechaInicio,
                                fechaVencimiento: modificarFechaVencimiento,
                                Descripcion: modificarDescripcion,
                                id_Usuario: modificarUsuario
                            };
    
                            return fetch(`http://www.polizaswebapp.somee.com/api/Poliza/${polizaId}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(datosPoliza)
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Error al modificar la póliza');
                                }
                                return response.json();
                            })
                            .catch(error => {
                                Swal.showValidationMessage(`Error: ${error.message}`);
                            });
                        }
                    })
                    .then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire({
                                title: '¡Listo!',
                                text: 'La póliza se modificó correctamente.',
                                icon: 'success',
                                confirmButtonText: 'Aceptar'
                            });
                            listarPolizas(1); // Actualiza la lista de pólizas
                        }
                    });
    
                    // Cargar aseguradoras después de que se crea el modal
                    const selectAseguradoras = document.getElementById("companiaSeguro");
                    listarAseguradoras(selectAseguradoras);
    
                })
                .catch(error => {
                    Swal.fire({
                        title: "Error",
                        text: `Error al obtener los datos de la póliza: ${error.message}`,
                        background: '#f3f3f2',
                        icon: "error"
                    });
                });
        } else {
            Swal.fire({
                title: "Error",
                text: "No has seleccionado ninguna póliza para modificar.",
                background: '#f3f3f2',
                icon: "error"
            });
        }
    }
    
    

    function eliminarPoliza() {
        const selected = document.querySelector('input[type="checkbox"]:checked');

        if (selected) {
            const polizaId = selected.value;
            Swal.fire({
                title: "¿Quieres eliminar esta póliza?",
                text: "No podrás recuperar esta información.",
                icon: "warning",
                background: '#f3f3f2',
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, eliminar"
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`http://www.polizaswebapp.somee.com/api/Poliza/${polizaId}`, {
                        method: "DELETE",
                    })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Error al eliminar la póliza");
                        }
                        Swal.fire({
                            title: "Eliminada",
                            text: "Póliza eliminada exitosamente.",
                            background: '#f3f3f2',
                            icon: "success"
                        });
                        listarPolizas(); // Llama a la función para listar las pólizas actualizadas
                    })
                    .catch((error) => console.error("Error al eliminar póliza:", error));
                }
            });
        } else {
            Swal.fire({
                title: "Error",
                text: "No has seleccionado ninguna póliza para eliminar.",
                background: '#f3f3f2',
                icon: "error"
            });
        }
    }

    document.getElementById('btn-eliminar').addEventListener('click', eliminarPoliza);

    const botonModificarPoliza = document.getElementById("btn-modificar");

    if (botonModificarPoliza) {
        botonModificarPoliza.addEventListener('click', modificarPoliza);
    }

    initCheckboxEvent();
   

    
});



