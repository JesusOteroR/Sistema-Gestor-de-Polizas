document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("cuerpoTablaUsuario");
  const botones = document.getElementById("btn-gestionUsuarios");

  let inicioRegistros = 1;
  let tamañoMaximoRegistros = 5;

  function listarUsuarios(inicioRegistros) {
    fetch(`http://www.polizaswebapp.somee.com/api/Usuario`)
      .then((response) => response.json())
      .then((data) => {
        tabla.innerHTML = "";
        data.forEach((user) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                      <td><input type="checkbox" name="option" value="${user.id_Usuario}"></td>
                      <td class="text-center">${user.id_Usuario}</td>
                      <td class="text-center">${user.Contraseña}</td>
                      <td class="text-center">${user.Nombre}</td>
                      <td class="text-center">${user.Apellido}</td>
                      <td class="text-center">${user.Cargo}</td>
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

  listarUsuarios(inicioRegistros);

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

  // Función para el boton registrar en gestión de usuario
  function registrarUsuario() {
    Swal.fire({
      background: "#f3f3f2",
      title: "Registrar Usuario",
      html: `
              <div class="input-group mb-3">
                  <span class="input-group-text">Nombre de Usuario</span>
                  <input type="text" id="nuevoUsuario" class="form-control" placeholder="Usuario22">
              </div>
              <div class="input-group mb-3">
                  <span class="input-group-text">Contraseña</span>
                  <input type="password" id="nuevaContrasena" class="form-control" placeholder="123456...">
              </div>
              <div class="input-group mb-3">
                  <span class="input-group-text">Repetir Contraseña</span>
                  <input type="password" id="repetirContrasena" class="form-control" placeholder="123456...">
              </div>
              <div class="input-group mb-3">
                  <span class="input-group-text">Nombre</span>
                  <input type="text" id="nuevoNombre" class="form-control" placeholder="Juan">
              </div>
              <div class="input-group mb-3">
                  <span class="input-group-text">Apellidos</span>
                  <input type="text" id="nuevosApellidos" class="form-control" placeholder="Cantillo Pérez">
              </div>
              <div class="input-group mb-3">
                  <span class="input-group-text">Cargo</span>
                  <input type="text" id="nuevoCargo" class="form-control" placeholder="Cargo que desempeña">
              </div>
          `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const nuevoUsuario = document
          .getElementById("nuevoUsuario")
          .value.trim();
        const nuevaContrasena = document
          .getElementById("nuevaContrasena")
          .value.trim();
        const repetirContrasena = document
          .getElementById("repetirContrasena")
          .value.trim();
        const nuevoNombre = document.getElementById("nuevoNombre").value.trim();
        const nuevosApellidos = document
          .getElementById("nuevosApellidos")
          .value.trim();
        const nuevoCargo = document.getElementById("nuevoCargo").value.trim();

        if (nuevaContrasena !== repetirContrasena) {
          Swal.showValidationMessage("Las contraseñas no coinciden");
          return;
        }
        if (nuevoUsuario.length < 6) {
          Swal.showValidationMessage(
            "El nombre de usuario debe tener al menos 6 caracteres"
          );
          return;
        }
        if (nuevaContrasena.length < 6) {
          Swal.showValidationMessage(
            "La contraseña debe tener al menos 6 caracteres"
          );
          return;
        }

        const nuevoUsuarioData = {
          id_Usuario: nuevoUsuario,
          Contraseña: nuevaContrasena,
          Nombre: nuevoNombre,
          Apellido: nuevosApellidos,
          Cargo: nuevoCargo,
        };

        return fetch(`http://www.polizaswebapp.somee.com/api/Usuario`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoUsuarioData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error al registrar el usuario");
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
          text: "El usuario se guardó correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        listarUsuarios(1); // Actualiza la lista de usuarios
      }
    });
  }

  // Función para el botón modificar en gestión de usuarios
  function modificarUsuario() {
    const selected = document.querySelector('input[type="checkbox"]:checked');

    if (selected) {
      const userId = selected.value;

      fetch(`http://www.polizaswebapp.somee.com/api/Usuario/${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener los datos del usuario");
          }
          return response.json();
        })
        .then((user) => {
          const usuario = user[0]; // Obtenemos el usuario del array
          Swal.fire({
            background: "#f3f3f2",
            title: "Modificar Usuario",
            html: `
                      <div class="input-group mb-3">
                          <span class="input-group-text">Nombre de Usuario</span>
                          <div class="form-control bg-light">${usuario.id_Usuario}</div>
                      </div>
                      <div class="input-group mb-3">
                          <span class="input-group-text">Contraseña</span>
                          <input type="password" id="modificarContrasena" class="form-control" placeholder="Nueva contraseña">
                      </div>
                      <div class="input-group mb-3">
                          <span class="input-group-text">Repetir Contraseña</span>
                          <input type="password" id="modificarRepetirContrasena" class="form-control" placeholder="Repetir contraseña">
                      </div>
                      <div class="input-group mb-3">
                          <span class="input-group-text">Nombre</span>
                          <input type="text" id="modificarNombre" class="form-control" value="${usuario.Nombre}">
                      </div>
                      <div class="input-group mb-3">
                          <span class="input-group-text">Apellidos</span>
                          <input type="text" id="modificarApellidos" class="form-control" value="${usuario.Apellido}">
                      </div>
                      <div class="input-group mb-3">
                          <span class="input-group-text">Cargo</span>
                          <input type="text" id="modificarCargo" class="form-control" value="${usuario.Cargo}">
                      </div>
                  `,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            preConfirm: () => {
              const modificarContrasena = document
                .getElementById("modificarContrasena")
                .value.trim();
              const modificarRepetirContrasena = document
                .getElementById("modificarRepetirContrasena")
                .value.trim();
              const modificarNombre = document
                .getElementById("modificarNombre")
                .value.trim();
              const modificarApellidos = document
                .getElementById("modificarApellidos")
                .value.trim();
              const modificarCargo = document
                .getElementById("modificarCargo")
                .value.trim();

              if (modificarContrasena !== modificarRepetirContrasena) {
                Swal.showValidationMessage("Las contraseñas no coinciden");
                return false;
              }
              if (modificarContrasena.length < 6) {
                Swal.showValidationMessage(
                  "La contraseña debe tener al menos 6 caracteres"
                );
                return false;
              }

              const usuarioModificado = {
                id_Usuario: usuario.id_Usuario,
                Contraseña: modificarContrasena,
                Nombre: modificarNombre,
                Apellido: modificarApellidos,
                Cargo: modificarCargo,
              };

              return fetch(
                `http://www.polizaswebapp.somee.com/api/Usuario/${userId}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(usuarioModificado),
                }
              )
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Error al modificar el usuario");
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
                text: "El usuario se modificó correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
              });
              listarUsuarios(1); // Actualiza la lista de usuarios
            }
          });
        })
        .catch((error) => {
          Swal.fire({
            title: "Error",
            text: `Error al obtener los datos del usuario: ${error.message}`,
            background: "#f3f3f2",
            icon: "error",
          });
        });
    } else {
      Swal.fire({
        title: "Error",
        text: "No has seleccionado ningún usuario para modificar.",
        background: "#f3f3f2",
        icon: "error",
      });
    }
  }

  // Función para el boton eliminar en gestión de usuarios
  function eliminarUsuario() {
    const selected = document.querySelector('input[type="checkbox"]:checked');
    if (selected) {
      const userId = selected.value;
      Swal.fire({
        title: "¿Quieres eliminar esta información?",
        text: "No podrás recuperar",
        icon: "warning",
        background: "#f3f3f2",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`http://www.polizaswebapp.somee.com/api/Usuario/${userId}`, {
            method: "DELETE",
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Error al eliminar el usuario");
              }
              Swal.fire({
                title: "Eliminada",
                text: "Información eliminada.",
                background: "#f3f3f2",
                icon: "success",
              });
              listarUsuarios(inicioRegistros);
            })
            .catch((error) =>
              console.error("Error al eliminar usuario:", error)
            );
        }
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "No has seleccionado ningún usuario para eliminar.",
        background: "#f3f3f2",
        icon: "error",
      });
    }
  }

  // Inicializa los eventos de los botones de gestión de usuarios
  const botonEliminarUsuario = document.getElementById("btn-eliminarUsuario");
  const botonRegistrarUsuario = document.getElementById("btn-registroUsuario");
  const botonModificarUsuario = document.getElementById("btn-modificarUsuario");

  if (botonEliminarUsuario) {
    botonEliminarUsuario.addEventListener("click", eliminarUsuario);
  }

  if (botonRegistrarUsuario) {
    botonRegistrarUsuario.addEventListener("click", registrarUsuario);
  }

  if (botonModificarUsuario) {
    botonModificarUsuario.addEventListener("click", modificarUsuario);
  }

  // Inicializa los eventos de checkbox
  initCheckboxEvent();
});
