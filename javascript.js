
function actualizarContadorCarrito() {
    const contadorCarrito = document.getElementById('cartCount'); // Asegúrate de tener un elemento con este ID
    const totalProductos = productosEnCarrito.reduce((total, producto) => total + producto.cantidad, 0);
    contadorCarrito.textContent = totalProductos > 0 ? totalProductos : '';
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        productosEnCarrito = JSON.parse(carritoGuardado);
        // Actualizar el contador y el carrito visualmente
        actualizarCarrito();
    }
    actualizarContadorCarrito();
}

// Llama a cargarCarrito cuando se carga la página
window.onload = cargarCarrito;
//escoger talla
let tallaSeleccionada = ''; // Variable para almacenar la talla seleccionada

function seleccionarTalla(talla) {
    tallaSeleccionada = talla; // Guardar la talla seleccionada
    // Aquí puedes agregar lógica para resaltar el botón seleccionado, si deseas
    console.log(`Talla seleccionada: ${tallaSeleccionada}`);
}

let productosEnCarrito = [];

function agregarAlCarrito(id) {
    if (!tallaSeleccionada) {
        alert('Por favor, selecciona una talla antes de agregar al carrito.');
        return; // Salir si no se ha seleccionado talla
    }

    // Obtener el nombre, precio e imagen del producto
    const nombreProducto = document.getElementById(`nombreProducto${id}`).textContent;
    const precioTexto = document.getElementById(`precioProducto${id}`).textContent;
    const precio = parseFloat(precioTexto.replace('Precio: $', '').trim());
    const imgProducto = document.getElementById(`imgProducto${id}`).src; // Obtener la ruta de la imagen

    // Verificar si el producto ya está en el carrito
    // const productoExistente = productosEnCarrito.find(producto => producto.id === id);
    const productoExistente = productosEnCarrito.find(producto => producto.id === id && producto.talla === tallaSeleccionada);
    

    if (productoExistente) {
        // Si el producto ya está, incrementamos la cantidad
        productoExistente.cantidad++;
    } else {
        // Si no existe, lo agregamos al carrito
        const nuevoProducto = {
            id: id,
            nombre: nombreProducto,
            precio: precio,
            imagen: imgProducto,
            talla: tallaSeleccionada,
            cantidad: 1
        };
        productosEnCarrito.push(nuevoProducto);
    }
    tallaSeleccionada = '';

    // Actualizar el contador de productos en el carrito
    const totalProductos = productosEnCarrito.reduce((total, producto) => total + producto.cantidad, 0);
    document.getElementById('cartCount').innerText = totalProductos;

    localStorage.setItem('carrito', JSON.stringify(productosEnCarrito));
    // Actualizar la lista del carrito
    actualizarCarrito();
    actualizarContadorCarrito();
}

function actualizarCarrito() {
    const listaCarritoModal = document.getElementById('listaCarritoModal');
    listaCarritoModal.innerHTML = ''; // Limpiar la lista antes de actualizar

    let total = 0;

    productosEnCarrito.forEach((producto, index) => {
        const li = document.createElement('li');
        li.classList.add('d-flex', 'align-items-center', 'mb-2');

        // Imagen pequeña del producto
        const img = document.createElement('img');
        img.src = producto.imagen;
        img.alt = producto.nombre;
        img.style.width = '50px';
        img.style.height = '50px';
        img.classList.add('me-2');

        // Texto con el nombre, precio y cantidad
        li.innerHTML = `
            <span>Producto: ${producto.nombre} - Precio: $${producto.precio.toFixed(2)} - Cantidad: ${producto.cantidad} - Talla: ${producto.talla} </span>
        `;

        // Botón para eliminar el producto
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.classList.add('btn', 'btn-danger', 'ms-2');
        botonEliminar.onclick = () => eliminarDelCarrito(index);

        // Añadir la imagen y el botón eliminar al li
        li.prepend(img);
        li.appendChild(botonEliminar);

        // Añadir el li a la lista
        listaCarritoModal.appendChild(li);

        total += producto.precio * producto.cantidad; // Calcular el total
    });

    // Mostrar el total en el modal
    document.getElementById('totalCarritoModal').textContent = total.toFixed(2);
}

function eliminarDelCarrito(index) {
    productosEnCarrito.splice(index, 1); // Eliminar el producto del carrito
    localStorage.setItem('carrito', JSON.stringify(productosEnCarrito)); // Actualizar localStorage
    actualizarCarrito(); // Actualizar la lista y el total
    actualizarContadorCarrito();
}

