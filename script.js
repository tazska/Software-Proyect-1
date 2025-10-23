// Script para Papas Locas - Descarga TXT Local

document.addEventListener('DOMContentLoaded', function() {
  const formReserva = document.getElementById('formReserva');
  const mensaje = document.getElementById('mensaje');

  // Función para formatear fecha
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
                   (fecha.getMonth() + 1).toString().padStart(2, '0') +
                   fecha.getDate().toString().padStart(2, '0') +
                   Math.floor(Math.random() * 1000).toString().padStart(3, '0');
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
    mensaje.textContent = texto;
    mensaje.style.padding = '15px';
    mensaje.style.borderRadius = '8px';
    mensaje.style.marginTop = '20px';
    mensaje.style.fontWeight = '600';
    mensaje.style.textAlign = 'center';
    
    if (tipo === 'error') {
      mensaje.style.background = '#ffebee';
      mensaje.style.color = '#c62828';
      mensaje.style.border = '2px solid #ef5350';
    } else if (tipo === 'exito') {
      mensaje.style.background = '#e8f5e9';
      mensaje.style.color = '#2e7d32';
      mensaje.style.border = '2px solid #66bb6a';
    }

    // Ocultar mensaje después de 8 segundos
    setTimeout(() => {
      mensaje.textContent = '';
      mensaje.style.padding = '0';
    }, 8000);
  }

  // Evento submit del formulario
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
║           PAPAS LOCAS - RESERVA CONFIRMADA                ║
╚═══════════════════════════════════════════════════════════╝

🎉 ¡FELICITACIONES! TU RESERVA HA SIDO CONFIRMADA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 INFORMACIÓN DE LA RESERVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    👤 Nombre Completo: ${nombre}
    📱 Teléfono/WhatsApp: ${celular}
    📅 Fecha de Reserva: ${formatearFecha(fecha)}
    👥 Número de Personas: ${personas}
    🕐 Hora: ${formatearHora(hora)}
    🔖 Código de Reserva: ${codigoReserva}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 UBICACIÓN DEL RESTAURANTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    🏠 Dirección: Barrio Centro
    🌆 Ciudad: Villagarzón - Putumayo
    
    🌳 Ambiente: Mesas de madera, troncos, piso de grava
                Encierro de guadua con árbol en el centro

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 INFORMACIÓN DE CONTACTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🍟 NUESTROS PRODUCTOS MÁS POPULARES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    • Papas Locas Clásicas
    • Hamburguesas Premium
    • Picadas Tradicionales
    • Sándwiches Especiales
    • Pizzas Artesanales
    
    🎁 COMBOS ESPECIALES:
    • Combo Personal - $60
    • Combo Familiar - $100
    • Combo Extra - $80

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ ¡GRACIAS POR ELEGIR PAPAS LOCAS!
   "Crujientes, jugosas y llenas de actitud"

   Te esperamos para que disfrutes de una
   experiencia gastronómica única en nuestro
   acogedor ambiente rústico.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 DETALLES DEL DOCUMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Reserva generada: ${new Date().toLocaleString('es-CO', {
      dateStyle: 'full',
      timeStyle: 'medium'
    })}
    
    Código de reserva: ${codigoReserva}
    
    Este documento es un comprobante de tu reserva.
    Conserva este archivo para referencia futura.

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
  const hoy = new Date().toISOString().split('T')[0];
  inputFecha.setAttribute('min', hoy);

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