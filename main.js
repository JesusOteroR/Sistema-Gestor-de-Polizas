document.addEventListener("DOMContentLoaded", function () {
  const userRole = localStorage.getItem("userRole");

  const gestionUsuariosItem = document.getElementById("gestionUsuariosItem");

  if (userRole === "Administrador") {
    // Mostrar opción de Gestión de Usuarios si es administrador
    gestionUsuariosItem.style.display = "block";
  } else {
    // Ocultar opción de Gestión de Usuarios si no es administrador
    gestionUsuariosItem.style.display = "none";
  }
});

//función para registrar usuarios en la pantalla de inicio
document.addEventListener("DOMContentLoaded", () => {
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
      }
    });
  }

  const botonRegistrar = document.getElementById("btn-registro");

  if (botonRegistrar) {
    botonRegistrar.addEventListener("click", registrarUsuario);
  }
});
