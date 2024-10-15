document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("cuerpoTablaAseguradora");
  const botones = document.getElementById("btn-gestionUsuarios");

  let inicioRegistros = 1;
  let tamañoMaximoRegistros = 5;

  function listarAseguradora(inicioRegistros) {
    fetch(`http://www.polizaswebapp.somee.com/api/Aseguradora`)
      .then((response) => response.json())
      .then((data) => {
        tabla.innerHTML = "";
        data.forEach((aseguradora) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                      <td><input type="checkbox" name="option" value="${aseguradora.id_Aseguradora}"></td>
                      <td class="text-center">${aseguradora.id_Aseguradora}</td>
                      <td class="text-center">${aseguradora.Nombre}</td>
                      <td class="text-center">${aseguradora.Telefono}</td>
                      <td class="text-center">${aseguradora.Direccion}</td>
                  `;
          tabla.appendChild(row);
        });
        console.log(data);
        // Re-inicializar los eventos de checkbox después de listar usuarios
        initCheckboxEvent();
      })
      .catch((error) =>
        console.error("Error al obtener datos de la API:", error)
      );
  }

  listarAseguradora(inicioRegistros);

  function initCheckboxEvent() {
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"][name="option"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        if (this.checked) {
          checkboxes.forEach((box) => {
            if (box !== this) {
              box.checked = false;
            }
          });
        }
      });
    });
  }


 // Función para el botón registrar en gestión de aseguradora
function registrarAseguradora() {
  Swal.fire({
    background: "#f3f3f2",
    title: "Registrar Aseguradora",
    html: `
      <div class="input-group mb-3">
        <span class="input-group-text">NIT</span>
        <input type="text" id="nuevoId" class="form-control" placeholder="NIT de Aseguradora">
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text">Nombre de Aseguradora</span>
        <input type="text" id="nuevaAseguradora" class="form-control" placeholder="Aseguradora Nueva">
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text">Teléfono</span>
        <input type="text" id="nuevoTelefono" class="form-control" placeholder="123456789">
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text">Dirección</span>
        <input type="text" id="nuevaDireccion" class="form-control" placeholder="Calle Falsa 123">
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    showLoaderOnConfirm: true,
    preConfirm: () => {
      const nuevoId = document.getElementById("nuevoId").value.trim();
      const nuevaAseguradora = document
        .getElementById("nuevaAseguradora")
        .value.trim();
      const nuevoTelefono = document
        .getElementById("nuevoTelefono")
        .value.trim();
      const nuevaDireccion = document
        .getElementById("nuevaDireccion")
        .value.trim();

      if (
        nuevoId === "" ||
        nuevaAseguradora === "" ||
        nuevoTelefono === "" ||
        nuevaDireccion === ""
      ) {
        Swal.showValidationMessage("Por favor, completa todos los campos");
        return;
      }

      const nuevaAseguradoraData = {
        id_Aseguradora: nuevoId, 
        Nombre: nuevaAseguradora,
        Telefono: nuevoTelefono,
        Direccion: nuevaDireccion,
      };

      return fetch(`http://www.polizaswebapp.somee.com/api/Aseguradora`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaAseguradoraData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al registrar la aseguradora");
          }
          return response.json();
        })
        .catch((error) => {
          Swal.showValidationMessage(`Error: ${error.message}`);
        });
    },
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "¡Listo!",
        text: "La aseguradora se guardó correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      listarAseguradora(1); // Actualiza la lista de aseguradoras
    }
  });
}


// Función para modificar aseguradora
function modificarAseguradora() {
  const selected = document.querySelector('input[type="checkbox"]:checked');

  if (selected) {
    const aseguradoraId = selected.value;

    fetch(`http://www.polizaswebapp.somee.com/api/Aseguradora/${aseguradoraId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos de la aseguradora");
        }
        return response.json();
      })
      .then((aseguradoraArray) => {
        // Accedemos al primer elemento del array
        const aseguradora = aseguradoraArray[0]; 

        Swal.fire({
          background: "#f3f3f2",
          title: "Modificar Aseguradora",
          html: `
              <div class="input-group mb-3">
                  <span class="input-group-text">NIT</span>
                  <div class="form-control bg-light">${aseguradora.id_Aseguradora}</div>                  
              </div>
              <div class="input-group mb-3">
                  <span class="input-group-text">Nombre de Aseguradora</span>
                  <input type="text" id="modificarNombreAseguradora" class="form-control" value="${aseguradora.Nombre}">
              </div>
              <div class="input-group mb-3">
                  <span class="input-group-text">Teléfono</span>
                  <input type="text" id="modificarTelefonoAseguradora" class="form-control" value="${aseguradora.Telefono}">
              </div>
              <div class="input-group mb-3">
                  <span class="input-group-text">Dirección</span>
                  <input type="text" id="modificarDireccionAseguradora" class="form-control" value="${aseguradora.Direccion}">
              </div>
          `,
          showCancelButton: true,
          confirmButtonText: "Guardar",
          cancelButtonText: "Cancelar",
          showLoaderOnConfirm: true,
          preConfirm: () => {
            const modificarNombre = document.getElementById("modificarNombreAseguradora").value.trim();
            const modificarTelefono = document.getElementById("modificarTelefonoAseguradora").value.trim();
            const modificarDireccion = document.getElementById("modificarDireccionAseguradora").value.trim();

            if (modificarNombre === "" || modificarTelefono === "" || modificarDireccion === "") {
              Swal.showValidationMessage("Por favor, completa todos los campos");
              return false;
            }

            const aseguradoraModificada = {
              id_Aseguradora: aseguradora.id_Aseguradora, 
              Nombre: modificarNombre,
              Telefono: modificarTelefono,
              Direccion: modificarDireccion,
            };

            return fetch(
              `http://www.polizaswebapp.somee.com/api/Aseguradora/${aseguradoraId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(aseguradoraModificada),
              }
            )
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Error al modificar la aseguradora");
                }
                return response.json();
              })
              .catch((error) => {
                Swal.showValidationMessage(`Error: ${error.message}`);
              });
          },
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "¡Listo!",
              text: "La aseguradora se modificó correctamente.",
              icon: "success",
              confirmButtonText: "Aceptar",
            });
            listarAseguradora(1); // Actualiza la lista de aseguradoras
          }
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: `Error al obtener los datos de la aseguradora: ${error.message}`,
          background: "#f3f3f2",
          icon: "error",
        });
      });
  } else {
    Swal.fire({
      title: "Error",
      text: "No has seleccionado ninguna aseguradora para modificar.",
      background: "#f3f3f2",
      icon: "error",
    });
  }
}



  // Función para eliminar aseguradora
  function eliminarAseguradora() {
    const selected = document.querySelector('input[type="checkbox"]:checked');
    if (selected) {
      const aseguradoraId = selected.value;
      Swal.fire({
        title: "¿Quieres eliminar esta aseguradora?",
        text: "No podrás recuperar la información",
        icon: "warning",
        background: "#f3f3f2",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(
            `http://www.polizaswebapp.somee.com/api/Aseguradora/${aseguradoraId}`,
            {
              method: "DELETE",
            }
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error("Error al eliminar la aseguradora");
              }
              return response.json();
            })
            .then(() => {
              Swal.fire({
                title: "Eliminado",
                text: "La aseguradora ha sido eliminada",
                icon: "success",
                background: "#f3f3f2",
              });
              listarAseguradora(1); // Actualiza la lista de aseguradoras
            })
            .catch((error) => {
              Swal.fire({
                title: "Error",
                text: `Error al eliminar la aseguradora: ${error.message}`,
                background: "#f3f3f2",
                icon: "error",
              });
            });
        }
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "No has seleccionado ninguna aseguradora para eliminar.",
        background: "#f3f3f2",
        icon: "error",
      });
    }
  }

  // Inicializa los eventos de los botones de gestión de usuarios
  const botonEliminarAseguradora = document.getElementById("btn-eliminarAseguradora");
  const botonregistrarAseguradora = document.getElementById("btn-registroAseguradora");
  const botonModificarAseguradora = document.getElementById("btn-modificarAseguradora");

  if (botonEliminarAseguradora) {
    botonEliminarAseguradora.addEventListener("click", eliminarAseguradora);
  }

  if (botonregistrarAseguradora) {
    botonregistrarAseguradora.addEventListener("click", registrarAseguradora);
  }

  if (botonModificarAseguradora) {
    botonModificarAseguradora.addEventListener("click", modificarAseguradora);
  }

  // Inicializa los eventos de checkbox
  initCheckboxEvent();



});
