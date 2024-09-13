document.addEventListener("DOMContentLoaded", () => {
    const selectAseguradoras = document.getElementById("companiaSeguro");

    function listarAseguradoras() {
        fetch(`http://www.polizaswebapp.somee.com/api/Aseguradora`)
            .then(response => response.json())
            .then(data => {
                selectAseguradoras.innerHTML = ""; // Limpiar opciones existentes
                // Agregar opción inicial estática
                const optionDefault = document.createElement("option");
                optionDefault.textContent = "Compañias ya registradas";
                selectAseguradoras.appendChild(optionDefault);

                // Agregar opciones dinámicamente
                data.forEach(aseguradora => {
                    const option = document.createElement("option");
                    option.textContent = aseguradora.Nombre;
                    option.value = aseguradora.id_Aseguradora;
                    selectAseguradoras.appendChild(option);
                });

                console.log(data);
            })
            .catch(error => console.error("Error al obtener datos de la API:", error));
    }

    listarAseguradoras();

    // Agregar evento al botón de guardar póliza
    document.getElementById("btn-guardarPoliza").addEventListener("click", (event) => {
        event.preventDefault();
        registrarPoliza();
    });

    // Función para registrar una nueva aseguradora
    function registrarAseguradora() {
        Swal.fire({
            title: 'Registrar Aseguradora',
            html:
                '<span class="input-group-text">ID Aseguradora (NIT)</span>' +
                '<input id="idAseguradora" type="text" aria-label="ID de la Aseguradora" class="form-control" placeholder="1234567890">' +
                '<span class="input-group-text">Nombre</span>' +
                '<input id="nombreAseguradora" type="text" aria-label="Nombre de la Aseguradora" class="form-control" placeholder="Seguros S.A.S.">' +
                '<span class="input-group-text">Teléfono</span>' +
                '<input id="telefonoAseguradora" type="text" aria-label="Teléfono" class="form-control" placeholder="60585569">' +
                '<span class="input-group-text">Dirección</span>' +
                '<input id="direccionAseguradora" type="text" aria-label="Dirección" class="form-control" placeholder="Bogotá">',
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const idAseguradora = document.getElementById('idAseguradora').value.trim();
                const nombre = document.getElementById('nombreAseguradora').value.trim();
                const telefono = document.getElementById('telefonoAseguradora').value.trim();
                const direccion = document.getElementById('direccionAseguradora').value.trim();

                if (!idAseguradora || !nombre || !telefono || !direccion) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                }

                // Crear objeto con los datos a enviar
                const data = {
                    id_Aseguradora: idAseguradora,
                    Nombre: nombre,
                    Telefono: telefono,
                    Direccion: direccion
                };

                // Realizar la petición POST a la API para registrar la aseguradora
                return fetch('http://www.polizaswebapp.somee.com/api/Aseguradora', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al registrar la aseguradora');
                    }
                    return response.json();
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Error',
                        text: `Error al registrar la aseguradora: ${error.message}`,
                        icon: 'error',
                        background: '#f3f3f2'
                    });
                });
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '¡Listo!',
                    text: 'La aseguradora se registró correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    background: '#f3f3f2'
                });

                // Llamar a la función para volver a listar las aseguradoras
                listarAseguradoras();
            }
        });
    }

    // Agregar evento al botón de registrar aseguradora
    const botonregistrarAseguradora = document.getElementById('btn-regisAsegura');
    if (botonregistrarAseguradora) {
        botonregistrarAseguradora.addEventListener('click', registrarAseguradora);
    }

    // Función para registrar una nueva póliza
    function registrarPoliza() {
        const numeroPoliza = document.getElementById("numeroPoliza").value.trim();
        const idAseguradora = document.getElementById("companiaSeguro").value;
        const tipoPoliza = document.getElementById("tipoPoliza").value;
        const montoCobertura = document.getElementById("montoCobertura").value.trim();
        const fechaInicio = document.getElementById("fechaInicio").value;
        const fechaVencimiento = document.getElementById("fechaVencimiento").value;
        const descripcion = document.getElementById("descripcion").value.trim();
        const idUsuario = document.getElementById("usuarioResponsable").value.trim();
    
        if (!numeroPoliza || !idAseguradora || !tipoPoliza || !montoCobertura || !fechaInicio || !fechaVencimiento || !descripcion || !idUsuario) {
            Swal.fire({
                title: "Error",
                text: "Todos los campos son obligatorios.",
                icon: "error",
                background: '#f3f3f2'
            });
            return;
        }
    
        const polizaData = {
            id_Poliza: numeroPoliza,
            id_Aseguradora: idAseguradora,
            Tipo: tipoPoliza,
            Cobertura: montoCobertura,
            fechaInicio: fechaInicio,
            fechaVencimiento: fechaVencimiento,
            Descripcion: descripcion,
            id_Usuario: idUsuario
        };
    
        fetch("http://www.polizaswebapp.somee.com/api/Poliza", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(polizaData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al registrar la póliza");
            }
            return response.json();
        })
        .then(data => {
            Swal.fire({
                title: "¡Listo!",
                text: "La póliza se registró correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
                background: '#f3f3f2'
            });
            // Limpiar el formulario
            document.getElementById("numeroPoliza").value = "";
            document.getElementById("companiaSeguro").selectedIndex = 0;
            document.getElementById("tipoPoliza").selectedIndex = 0;
            document.getElementById("montoCobertura").value = "";
            document.getElementById("fechaInicio").value = "";
            document.getElementById("fechaVencimiento").value = "";
            document.getElementById("descripcion").value = "";
            document.getElementById("usuarioResponsable").value = "";
        })
        .catch(error => {
            Swal.fire({
                title: "Error",
                text: `Error al registrar la póliza: ${error.message}`,
                icon: "error",
                background: '#f3f3f2'
            });
        });
    }
    
});
