document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Llama a la API para obtener los usuarios
    fetch('http://www.polizaswebapp.somee.com/api/Usuario')
        .then(response => response.json())
        .then(data => {
            // Busca si las credenciales coinciden
            const user = data.find(user => user.id_Usuario === username && user.Contraseña === password);
            console.log(user);
            if (user) {
                // Guarda la información del usuario en localStorage (opcional)
                localStorage.setItem('userRole', user.Cargo);
                localStorage.setItem('nombreUsuario', user.Nombre);
                

                // Redirige a la página principal
                window.location.href = "/Inicio/Inicio.html"; 
            } else {
                // Si las credenciales no coinciden, muestra una alerta
                Swal.fire({
                    title: 'Error',
                    text: 'Usuario o contraseña incorrectos',
                    icon: 'error',
                    confirmButtonText: 'Intentar de nuevo'
                });
            }
        })
        .catch(error => {
            console.error('Error al verificar las credenciales:', error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al conectarse con el servidor',
                icon: 'error',
                confirmButtonText: 'Intentar de nuevo'
            });
        });
});

// autenticacion.js
document.addEventListener('DOMContentLoaded', function () {
    // Selecciona los elementos necesarios
    const passwordInput = document.getElementById('password');
    const visibilityCheckbox = document.getElementById('visible');

    // Maneja el cambio del estado del checkbox
    visibilityCheckbox.addEventListener('change', function () {
        if (visibilityCheckbox.checked) {
            // Muestra la contraseña
            passwordInput.type = 'text';
        } else {
            // Oculta la contraseña
            passwordInput.type = 'password';
        }
    });
});
