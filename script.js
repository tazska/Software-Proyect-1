<<<<<<< HEAD
// Script para Papas Locas - Descarga TXT Local y Carrito de Compras
=======
// Script para Papas Locas - Descarga TXT Local
>>>>>>> a4bdeafaaeef11f2f716530a159e33bfee479834

document.addEventListener('DOMContentLoaded', function() {
  const formReserva = document.getElementById('formReserva');
  const mensaje = document.getElementById('mensaje');

<<<<<<< HEAD
  // --- LÓGICA DEL CARRITO DE COMPRAS ---
  
  let carrito = []; // Array para almacenar los productos {nombre, precio, cantidad}
  const cartCount = document.getElementById('cartCount');
  const cartTotalDisplay = document.getElementById('cartTotal');
  const btnCheckout = document.getElementById('btnCheckout');
  const cartIcon = document.getElementById('cartIcon');
  const cartDropdown = document.getElementById('cartDropdown');
  
  // Función para actualizar el contador y el total
  function actualizarCarritoUI() {
    let totalItems = 0;
    let totalPrecio = 0;
    
    carrito.forEach(item => {
        // Asumiendo que item.cantidad y item.precio son números
        totalItems += item.cantidad; 
        totalPrecio += item.precio * item.cantidad;
    });

    cartCount.textContent = totalItems;
    // Esto es solo para el dropdown en Index.html, el total real se calcula en checkout.html
    if (cartTotalDisplay) {
        cartTotalDisplay.textContent = `$${totalPrecio.toFixed(2)}`;
    }
  }
  
  // Función para agregar un producto al carrito
  function agregarAlCarrito(nombre, precio) {
    // Convertir el precio a número entero, ya que los precios en tu HTML son enteros ($40, $60, etc.)
    const precioNum = parseInt(precio); 
    
    const itemExistente = carrito.find(item => item.nombre === nombre);
    
    if (itemExistente) {
      itemExistente.cantidad += 1;
    } else {
      carrito.push({ nombre, precio: precioNum, cantidad: 1 });
    }
    
    actualizarCarritoUI();
    // Reutilizamos tu función de mensaje para notificar la adición
    mostrarMensaje(`✔️ ${nombre} agregado al carrito!`, 'exito'); 
  }
  
  // Evento para los botones de "Agregar al Carrito"
  document.querySelectorAll('.btn-add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const nombre = this.getAttribute('data-nombre');
      const precio = this.getAttribute('data-precio');
      agregarAlCarrito(nombre, precio);
    });
  });

  // Evento para el ícono del carrito (Muestra/Oculta el total)
  cartIcon.addEventListener('click', function() {
    if (cartDropdown) {
        // Toggle de display entre 'block' y 'none'
        cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
    }
  });


  // ----------------------------------------------------------------------------------
  //  MODIFICACIÓN CLAVE: REDIRIGIR AL CHECKOUT EN LUGAR DE MOSTRAR MENSAJE EN INDEX
  // ----------------------------------------------------------------------------------
  btnCheckout.addEventListener('click', function() {
    if (carrito.length === 0) {
      mostrarMensaje('🛒 El carrito está vacío. Agrega algo delicioso!', 'error');
      if (cartDropdown) cartDropdown.style.display = 'none';
      return;
    }
    
    // Opcional: Guardar el celular de reserva si existe un valor para usarlo en el checkout
    // Esto asume que el input de celular de reserva es el segundo input del formReserva
    const inputCelular = formReserva.querySelectorAll('input')[1]; 
    if (inputCelular && inputCelular.value.trim().length > 0) {
        localStorage.setItem('papasLocasCelular', inputCelular.value.trim());
    } else {
        // Si no hay celular, al menos se guarda el carrito.
        localStorage.removeItem('papasLocasCelular');
    }
    
    // 1. Guardar el carrito en el localStorage para que checkout.html lo lea
    localStorage.setItem('papasLocasCarrito', JSON.stringify(carrito));
    
    // 2. Limpiar el carrito en la memoria local (para que el contador sea 0 al volver)
    carrito = [];
    actualizarCarritoUI();
    
    // 3. Ocultar el dropdown
    if (cartDropdown) cartDropdown.style.display = 'none';

    // 4. Redirigir a la página de checkout
    window.location.href = 'checkout.html';
  });
  // ----------------------------------------------------------------------------------
  
  // Inicializar UI al cargar
  actualizarCarritoUI();
  
  // --- FIN LÓGICA DEL CARRITO DE COMPRAS ---

  // Función para formatear fecha (continúa tu código de reserva...)
=======
  // Función para formatear fecha
>>>>>>> a4bdeafaaeef11f2f716530a159e33bfee479834
  function formatearFecha(fecha) {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', opciones);
  }

  // Función para formatear hora
  function formatearHora(hora) {
    const [h, m] = hora.split(':');
    const horaNum = parseInt(h);
    const periodo = horaNum >= 12 ? 'PM' : 'AM';
    const hora12 = horaNum > 12 ? horaNum - 12 : (horaNum === 0 ? 12 : horaNum);
    return `${hora12}:${m} ${periodo}`;
  }

  // Función para generar código de reserva
  function generarCodigoReserva() {
    const fecha = new Date();
    const codigo = 'PL' + fecha.getFullYear().toString().substr(-2) + 
<<<<<<< HEAD
                  (fecha.getMonth() + 1).toString().padStart(2, '0') +
                  fecha.getDate().toString().padStart(2, '0') +
                  Math.floor(Math.random() * 1000).toString().padStart(3, '0');
=======
                   (fecha.getMonth() + 1).toString().padStart(2, '0') +
                   fecha.getDate().toString().padStart(2, '0') +
                   Math.floor(Math.random() * 1000).toString().padStart(3, '0');
>>>>>>> a4bdeafaaeef11f2f716530a159e33bfee479834
    return codigo;
  }

  // Función para descargar archivo TXT
  function descargarTXT(contenido, nombreArchivo) {
    // Crear elemento 'a' temporal
    const elemento = document.createElement('a');
    
    // Crear el archivo como Blob
    const archivo = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    
    // Crear URL del archivo
    const url = URL.createObjectURL(archivo);
    
    // Configurar el elemento 'a'
    elemento.href = url;
    elemento.download = nombreArchivo;
    
    // Agregar al DOM, hacer clic y remover
    document.body.appendChild(elemento);
    elemento.click();
    
    // Limpiar
    setTimeout(() => {
      document.body.removeChild(elemento);
      URL.revokeObjectURL(url);
    }, 100);
  }

  // Función para mostrar mensajes
  function mostrarMensaje(texto, tipo) {
<<<<<<< HEAD
    // Si el mensaje viene del carrito, no lo ocultamos automáticamente, a menos que sea un error.
    const duracion = (tipo === 'exito' && texto.includes('agregado al carrito')) ? 3000 : 8000;
      
=======
>>>>>>> a4bdeafaaeef11f2f716530a159e33bfee479834
    mensaje.textContent = texto;
    mensaje.style.padding = '15px';
    mensaje.style.borderRadius = '8px';
    mensaje.style.marginTop = '20px';
    mensaje.style.fontWeight = '600';
    mensaje.style.textAlign = 'center';
<<<<<<< HEAD
    mensaje.style.whiteSpace = 'pre-wrap'; // CLAVE para que los saltos de línea se vean
=======
>>>>>>> a4bdeafaaeef11f2f716530a159e33bfee479834
    
    if (tipo === 'error') {
      mensaje.style.background = '#ffebee';
      mensaje.style.color = '#c62828';
      mensaje.style.border = '2px solid #ef5350';
    } else if (tipo === 'exito') {
      mensaje.style.background = '#e8f5e9';
      mensaje.style.color = '#2e7d32';
      mensaje.style.border = '2px solid #66bb6a';
    }

<<<<<<< HEAD
    // Ocultar mensaje después de X segundos
    setTimeout(() => {
      mensaje.textContent = '';
      mensaje.style.padding = '0';
      mensaje.style.whiteSpace = 'normal';
    }, duracion);
  }

  // Evento submit del formulario (Reserva)
=======
    // Ocultar mensaje después de 8 segundos
    setTimeout(() => {
      mensaje.textContent = '';
      mensaje.style.padding = '0';
    }, 8000);
  }

  // Evento submit del formulario
>>>>>>> a4bdeafaaeef11f2f716530a159e33bfee479834
  formReserva.addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener valores de los inputs
    const inputs = formReserva.querySelectorAll('input');
    const nombre = inputs[0].value.trim();
    const celular = inputs[1].value.trim();
    const fecha = inputs[2].value;
    const personas = inputs[3].value;
    const hora = inputs[4].value;

    // Validaciones
    if (!nombre || !celular || !fecha || !personas || !hora) {
      mostrarMensaje('❌ Por favor completa todos los campos', 'error');
      return;
    }

    if (celular.length < 10) {
      mostrarMensaje('❌ Por favor ingresa un número de celular válido (mínimo 10 dígitos)', 'error');
      return;
    }

    const personasNum = parseInt(personas);
    if (personasNum < 1 || personasNum > 10) {
      mostrarMensaje('❌ El número de personas debe estar entre 1 y 10', 'error');
      return;
    }

    // Validar que la fecha no sea en el pasado
    const fechaSeleccionada = new Date(fecha + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaSeleccionada < hoy) {
      mostrarMensaje('❌ La fecha debe ser igual o posterior a hoy', 'error');
      return;
    }

    // Generar código único de reserva
    const codigoReserva = generarCodigoReserva();

    // Crear contenido del archivo TXT
    const contenido = `
╔═══════════════════════════════════════════════════════════╗
<<<<<<< HEAD
║           PAPAS LOCAS - RESERVA CONFIRMADA                ║
=======
║           PAPAS LOCAS - RESERVA CONFIRMADA                ║
>>>>>>> a4bdeafaaeef11f2f716530a159e33bfee479834
╚═══════════════════════════════════════════════════════════╝

🎉 ¡FELICITACIONES! TU RESERVA HA SIDO CONFIRMADA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 INFORMACIÓN DE LA RESERVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<<<<<<< HEAD
    👤 Nombre Completo: ${nombre}
    📱 Teléfono/WhatsApp: ${celular}
    📅 Fecha de Reserva: ${formatearFecha(fecha)}
    👥 Número de Personas: ${personas}
    🕐 Hora: ${formatearHora(hora)}
    🔖 Código de Reserva: ${codigoReserva}
=======
    👤 Nombre Completo: ${nombre}
    📱 Teléfono/WhatsApp: ${celular}
    📅 Fecha de Reserva: ${formatearFecha(fecha)}
    👥 Número de Personas: ${personas}
    🕐 Hora: ${formatearHora(hora)}
    🔖 Código de Reserva: ${codigoReserva}
>>>>>>> a4bdeafaaeef11f2f716530a159e33bfee479834

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 UBICACIÓN DEL RESTAURANTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<<<<<<< HEAD
    🏠 Dirección: Barrio Centro
    🌆 Ciudad: Villagarzón - Putumayo
    
    🌳 Ambiente: Mesas de madera, troncos, piso de grava
                Encierro de guadua con árbol en el centro
=======
    🏠 Dirección: Barrio Centro
    🌆 Ciudad: Villagarzón - Putumayo
    
    🌳 Ambiente: Mesas de madera, troncos, piso de grava
                Encierro de guadua con árbol en el centro
>>>>>>> a4bdeafaaeef11f2f716530a159e33bfee479834

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 INFORMACIÓN DE CONTACTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<<<<<<< HEAD
    ☎️  Teléfono: 312739897
    ✉️  Email: correo@gmail.com
    📘 Facebook: /papas.locas.21481
    📷 Instagram: @papas_locas_villagarzon

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  IMPORTANTE - POR FAVOR LEE CON ATENCIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ✓ Llegar 10 minutos antes de la hora reservada
    ✓ Confirmar asistencia 24 horas antes al: 312739897
    ✓ En caso de cancelación, avisar con anticipación
    ✓ Guarda este archivo como comprobante de tu reserva
    ✓ Presenta el código de reserva al llegar: ${codigoReserva}
=======
    ☎️  Teléfono: 312739897
    ✉️  Email: correo@gmail.com
    📘 Facebook: /papas.locas.21481
    📷 Instagram: @papas_locas_villagarzon

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  IMPORTANTE - POR FAVOR LEE CON ATENCIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ✓ Llegar 10 minutos antes de la hora reservada
    ✓ Confirmar asistencia 24 horas antes al: 312739897
    ✓ En caso de cancelación, avisar con anticipación
    ✓ Guarda este archivo como comprobante de tu reserva
    ✓ Presenta el código de reserva al llegar: ${codigoReserva}
>>>>>>> a4bdeafaaeef11f2f716530a159e33bfee479834

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🍟 NUESTROS PRODUCTOS MÁS POPULARES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<<<<<<< HEAD
    • Papas Locas Clásicas
    • Hamburguesas Premium
    • Picadas Tradicionales
    • Sándwiches Especiales
    • Pizzas Artesanales
    
    🎁 COMBOS ESPECIALES:
    • Combo Personal - $60
    • Combo Familiar - $100
    • Combo Extra - $80
=======
    • Papas Locas Clásicas
    • Hamburguesas Premium
    • Picadas Tradicionales
    • Sándwiches Especiales
    • Pizzas Artesanales
    
    🎁 COMBOS ESPECIALES:
    • Combo Personal - $60
    • Combo Familiar - $100
    • Combo Extra - $80
>>>>>>> a4bdeafaaeef11f2f716530a159e33bfee479834

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ ¡GRACIAS POR ELEGIR PAPAS LOCAS!
<<<<<<< HEAD
   "Crujientes, jugosas y llenas de actitud"

   Te esperamos para que disfrutes de una
   experiencia gastronómica única en nuestro
   acogedor ambiente rústico.
=======
   "Crujientes, jugosas y llenas de actitud"

   Te esperamos para que disfrutes de una
   experiencia gastronómica única en nuestro
   acogedor ambiente rústico.
>>>>>>> a4bdeafaaeef11f2f716530a159e33bfee479834

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 DETALLES DEL DOCUMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<<<<<<< HEAD
    Reserva generada: ${new Date().toLocaleString('es-CO', {
      dateStyle: 'full',
      timeStyle: 'medium'
    })}
    
    Código de reserva: ${codigoReserva}
    
    Este documento es un comprobante de tu reserva.
    Conserva este archivo para referencia futura.
=======
    Reserva generada: ${new Date().toLocaleString('es-CO', {
      dateStyle: 'full',
      timeStyle: 'medium'
    })}
    
    Código de reserva: ${codigoReserva}
    
    Este documento es un comprobante de tu reserva.
    Conserva este archivo para referencia futura.
>>>>>>> a4bdeafaaeef11f2f716530a159e33bfee479834

╚═══════════════════════════════════════════════════════════╝
`;

    // Nombre del archivo con fecha y código
    const nombreArchivo = `Reserva_PapasLocas_${nombre.replace(/\s+/g, '_')}_${fecha}_${codigoReserva}.txt`;

    // DESCARGAR EL ARCHIVO TXT LOCALMENTE
    try {
      descargarTXT(contenido, nombreArchivo);
      
      // Mostrar mensaje de éxito
      mostrarMensaje(`✅ ¡Reserva confirmada! Código: ${codigoReserva}. Archivo descargado en tu carpeta de Descargas 📥`, 'exito');
      
      // Limpiar formulario
      formReserva.reset();
      
      // Scroll al mensaje
      mensaje.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      console.log('✅ Archivo TXT descargado correctamente');
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      mostrarMensaje('❌ Error al generar el archivo. Por favor intenta nuevamente.', 'error');
    }
  });

  // Validación en tiempo real del celular (solo números)
  const inputCelular = formReserva.querySelectorAll('input')[1];
  inputCelular.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  });

  // Validación del nombre (solo letras y espacios)
  const inputNombre = formReserva.querySelectorAll('input')[0];
  inputNombre.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ\s]/g, '');
  });

  // Establecer fecha mínima (hoy)
  const inputFecha = formReserva.querySelectorAll('input')[2];
<<<<<<< HEAD
  const hoyReserva = new Date().toISOString().split('T')[0];
  inputFecha.setAttribute('min', hoyReserva);
=======
  const hoy = new Date().toISOString().split('T')[0];
  inputFecha.setAttribute('min', hoy);
>>>>>>> a4bdeafaaeef11f2f716530a159e33bfee479834

  // Smooth scroll para los enlaces del menú
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Animación de entrada para las cards
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Aplicar animación a todas las cards
  document.querySelectorAll('.card, .item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
  });

  console.log('🍟 Script de Papas Locas cargado correctamente');
  console.log('📥 Sistema de descarga TXT local activado');
});