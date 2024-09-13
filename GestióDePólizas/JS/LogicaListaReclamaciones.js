document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("cuerpoTablaReclamo");
  const paginacion = document.getElementById("paginacion");
  let tamañoPagina = 10; // Número de reclamos por página
  let paginaActual = 1; // Página actual
  let reclamos = []; // Array para almacenar todos los reclamos

  // Consulta para listar todos los reclamos
  function listarReclamos(pagina, busqueda = "") {
    fetch(`http://www.polizaswebapp.somee.com/api/Reclamo`)
      .then((response) => response.json())
      .then((data) => {
        // Filtrar los reclamos según la búsqueda
        if (busqueda) {
          data = data.filter(reclamo => reclamo.Numero.toString().includes(busqueda));
        }
  
        // Ordenar los reclamos por fecha (más reciente primero)
        data.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));
  
        reclamos = data; // Guardar los reclamos en el array
        const totalReclamos = reclamos.length;
        const totalPaginas = Math.ceil(totalReclamos / tamañoPagina);
  
        // Calcular el índice inicial y final para la página actual
        const inicio = (pagina - 1) * tamañoPagina;
        const fin = inicio + tamañoPagina;
        const reclamosPagina = reclamos.slice(inicio, fin);
  
        // Limpiar tabla
        tabla.innerHTML = "";
  
        // Agregar los reclamos de la página actual
        reclamosPagina.forEach((reclamo) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td><input type="checkbox" name="option" value="${reclamo.Numero}"></td>
            <td class="text-center">${reclamo.Numero}</td>
            <td class="text-center">${reclamo.id_Poliza}</td>
            <td class="text-center">${formatoFecha(reclamo.Fecha)}</td>
            <td class="text-center">${reclamo.Estado}</td>
            <td class="text-center">${reclamo.Descripcion}</td>
          `;
          tabla.appendChild(row);
        });
  
        initCheckboxEvent(); // Re-inicializar eventos del checkbox después de listar reclamos
  
        // Actualizar paginación
        actualizarPaginacion(totalPaginas);
      })
      .catch((error) =>
        console.error("Error al obtener datos de la API:", error)
      );
  }
  
  

  // Función para generar botones de paginación
  function actualizarPaginacion(totalPaginas) {
    paginacion.innerHTML = "";

    // Botón para ir a la página anterior
    const botonAnterior = document.createElement("button");
    botonAnterior.innerHTML = "&laquo;"; // Flecha hacia la izquierda
    botonAnterior.classList.add("btn", "btn-sm", "btn-primary", "mx-1");
    botonAnterior.disabled = paginaActual === 1; // Desactivar si está en la primera página
    botonAnterior.addEventListener("click", () => {
      if (paginaActual > 1) {
        paginaActual--;
        listarReclamos(paginaActual, document.getElementById('busquedaNumero').value);
      }
    });
    paginacion.appendChild(botonAnterior);

    // Botones de páginas
    for (let i = 1; i <= totalPaginas; i++) {
      const boton = document.createElement("button");
      boton.textContent = i;
      boton.classList.add("btn", "btn-sm", "btn-primary", "mx-1");
      boton.addEventListener("click", () => {
        paginaActual = i;
        listarReclamos(paginaActual, document.getElementById('busquedaNumero').value);
      });
      if (i === paginaActual) {
        boton.classList.add("active");
      }
      paginacion.appendChild(boton);
    }

    // Botón para ir a la página siguiente
    const botonSiguiente = document.createElement("button");
    botonSiguiente.innerHTML = "&raquo;"; // Flecha hacia la derecha
    botonSiguiente.classList.add("btn", "btn-sm", "btn-primary", "mx-1");
    botonSiguiente.disabled = paginaActual === totalPaginas; // Desactivar si está en la última página
    botonSiguiente.addEventListener("click", () => {
      if (paginaActual < totalPaginas) {
        paginaActual++;
        listarReclamos(paginaActual, document.getElementById('busquedaNumero').value);
      }
    });
    paginacion.appendChild(botonSiguiente);
  }

  // Función para inicializar eventos de checkbox
  function initCheckboxEvent() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="option"]');
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

  // Función para formatear fechas
  function formatoFecha(fechaString) {
    const fecha = new Date(fechaString);
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return fecha.toLocaleDateString("es-ES", options);
  }

  // Función para manejar la búsqueda
  function manejarBusqueda() {
    const busqueda = document.getElementById('busquedaNumero').value;
    paginaActual = 1; // Resetear a la primera página
    listarReclamos(paginaActual, busqueda);
  }

  // Agregar evento al botón de búsqueda
  const buscarReclamos = document.getElementById('buscarReclamos');
  if (buscarReclamos) {
    buscarReclamos.addEventListener('click', manejarBusqueda);
  }

  // Inicializar la lista de reclamos
  listarReclamos(paginaActual);

  // Función para manejar nuevo reclamo
  const nuevaReclamacion = document.getElementById("btn-nuevo");
  if (nuevaReclamacion) {
    nuevaReclamacion.addEventListener("click", nuevoReclamo);
  }

  function nuevoReclamo() {
    Swal.fire({
      title: "Nuevo Reclamo",
      html: `
        <span class="input-group-text">Numero Reclamo (NIT)</span>
        <input id="numeroReclamo" type="text" class="form-control" placeholder="1234567890">
        <span class="input-group-text">Número de Póliza</span>
        <input id="idPoliza" type="text" class="form-control" placeholder="123456789">
        <span class="input-group-text">Fecha</span>
        <input id="fecha" type="date" class="form-control" placeholder="Fecha">
        <span class="input-group-text">Estado</span>
        <input id="estadoReclamo" type="text" class="form-control" placeholder="estado pendiente">
        <span class="input-group-text">Descripcion</span>
        <input id="descripcionReclamo" type="text" class="form-control" placeholder="max 300 caracteres">
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const numero = document.getElementById("numeroReclamo").value.trim();
        const idPoliza = document.getElementById("idPoliza").value.trim();
        const fecha = document.getElementById("fecha").value.trim();
        const estado = document.getElementById("estadoReclamo").value.trim();
        const descripcion = document.getElementById("descripcionReclamo").value.trim();

        const data = {
          Numero: numero,
          id_Poliza: idPoliza,
          Fecha: fecha,
          Estado: estado,
          Descripcion: descripcion,
        };

        return fetch("http://www.polizaswebapp.somee.com/api/Reclamo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
          Swal.fire({
            title: "Éxito",
            text: "El reclamo ha sido creado.",
            icon: "success",
            confirmButtonText: "OK"
          });
          listarReclamos(paginaActual);
        })
        .catch(error => {
          Swal.fire({
            title: "Error",
            text: "No se pudo crear el reclamo.",
            icon: "error",
            confirmButtonText: "OK"
          });
          console.error("Error al crear el reclamo:", error);
        });
      }
    });
  }

  // Función para manejar modificación de reclamos
  const modificarReclamacion = document.getElementById("btn-modificarRe");
  if (modificarReclamacion) {
    modificarReclamacion.addEventListener("click", modificarReclamo);
  }

  function modificarReclamo() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="option"]:checked');
    if (checkboxes.length === 1) {
      const numeroReclamo = checkboxes[0].value;
  
      // Obtener los detalles del reclamo seleccionado
      fetch(`http://www.polizaswebapp.somee.com/api/Reclamo/${numeroReclamo}`)
        .then(response => response.json())
        .then(reclamo => {
          const recla = reclamo[0];
          
          Swal.fire({
           
            title: "Modificar Reclamo",
            html: `
              <div class="input-group mb-3">
                   <span class="input-group-text">Número de Reclamo</span>
                     <div class="form-control bg-light">${recla.Numero}</div>
               </div>
              <span class="input-group-text">Número de Póliza</span>
              <input id="idPoliza" type="text" class="form-control" value="${recla.id_Poliza}">
              <span class="input-group-text">Fecha</span>
              <input id="fecha" type="date" class="form-control" value="${recla.Fecha}">
              <span class="input-group-text">Estado</span>
              <input id="estadoReclamo" type="text" class="form-control" value="${recla.Estado}">
              <span class="input-group-text">Descripcion</span>
              <input id="descripcionReclamo" type="text" class="form-control" value="${recla.Descripcion}">
            `,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            preConfirm: () => {
              const idPoliza = document.getElementById("idPoliza").value.trim();
              const fecha = document.getElementById("fecha").value.trim();
              const estado = document.getElementById("estadoReclamo").value.trim();
              const descripcion = document.getElementById("descripcionReclamo").value.trim();
  
              const data = {
                Numero: numeroReclamo, // No cambiar el número del reclamo
                id_Poliza: idPoliza,
                Fecha: fecha,
                Estado: estado,
                Descripcion: descripcion,
              };
  
              return fetch(`http://www.polizaswebapp.somee.com/api/Reclamo/${numeroReclamo}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              })
              .then(response => response.json())
              .then(() => {
                Swal.fire({
                  title: "Éxito",
                  text: "El reclamo ha sido modificado.",
                  icon: "success",
                  confirmButtonText: "OK"
                });
                listarReclamos(paginaActual);
              })
              .catch(error => {
                Swal.fire({
                  title: "Error",
                  text: "No se pudo modificar el reclamo.",
                  icon: "error",
                  confirmButtonText: "OK"
                });
                console.error("Error al modificar el reclamo:", error);
              });
            }
          });
        })
        .catch(error => {
          Swal.fire({
            title: "Error",
            text: "No se pudo obtener el reclamo para modificar.",
            icon: "error",
            confirmButtonText: "OK"
          });
          console.error("Error al obtener el reclamo:", error);
        });
    } else {
      Swal.fire({
        title: "Error",
        text: "Debes seleccionar exactamente un reclamo para modificar.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  }
  
  // Función para manejar eliminación de reclamos
  const botonEliminarRecla = document.getElementById("btn-eliminarRe");
if (botonEliminarRecla) {
  botonEliminarRecla.addEventListener("click", eliminarReclamo);
}

function eliminarReclamo() {
  const selected = document.querySelector('input[type="checkbox"]:checked');
  if (selected) {
    const reclamoId = selected.value;
    Swal.fire({
      title: "¿Quieres eliminar este reclamo?",
      text: "No podrás recuperar esta información.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://www.polizaswebapp.somee.com/api/Reclamo/${reclamoId}`, { method: "DELETE" })
          .then((response) => {
            if (!response.ok) throw new Error("Error al eliminar el reclamo");
            return response.json();  // Asegúrate de manejar la respuesta de la API si es necesario
          })
          .then(() => {
            Swal.fire({ title: "Eliminado", text: "Reclamo eliminado exitosamente.", icon: "success" });
            listarReclamos();
          })
          .catch((error) => {
            Swal.fire({ title: "Error", text: `Error: ${error.message}`, icon: "error" });
          });
      }
    });
  } else {
    Swal.fire({ title: "Error", text: "No has seleccionado ningún reclamo para eliminar.", icon: "error" });
  }
}


  // Inicializar búsqueda por número de reclamo
  const busquedaNumero = document.getElementById('busquedaNumero');
  if (busquedaNumero) {
    busquedaNumero.addEventListener('input', manejarBusqueda);
  }
});
