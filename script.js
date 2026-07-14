// Catálogo de muñecos de tela
const PRECIO_LANZAMIENTO = 1200;
const WHATSAPP_NUMERO = '59895450900';

const productos = [
    {
        id: 'dragon',
        nombre: 'Dragoncito',
        descripcion: 'Dragón blanco de tela suave con alitas y cuellito cuadrillé marrón, un guardián tierno.',
        precio: PRECIO_LANZAMIENTO,
        categoria: 'fantasia',
        imagen: 'images/nuevosMuñecos/dragon.jpeg'
    },
    {
        id: 'elefante',
        nombre: 'Elefantito',
        descripcion: 'Elefantito crema con oreja y moño rosa cuadrillé, suave y abrazable.',
        precio: PRECIO_LANZAMIENTO,
        categoria: 'animales',
        imagen: 'images/nuevosMuñecos/elefante.jpeg'
    },
    {
        id: 'foca',
        nombre: 'Foquita',
        descripcion: 'Foquita celeste de tela mullida con cuello rosa cuadrillé, dulce y juguetona.',
        precio: PRECIO_LANZAMIENTO,
        categoria: 'animales',
        imagen: 'images/nuevosMuñecos/foca.jpeg'
    },
    {
        id: 'gaviota',
        nombre: 'Gaviota',
        descripcion: 'Gaviota blanca con pico naranja, pañuelo celeste cuadrillé y patitas largas.',
        precio: PRECIO_LANZAMIENTO,
        categoria: 'animales',
        imagen: 'images/nuevosMuñecos/gaviota.jpeg'
    },
    {
        id: 'flor',
        nombre: 'Flor Sonrisa',
        descripcion: 'Margarita de tela blanca con centro naranja y carita bordada, pura alegría.',
        precio: 650,
        categoria: 'flor',
        imagen: 'images/nuevosMuñecos/flor.jpeg'
    },
    {
        id: 'raton',
        nombre: 'Ratoncito',
        descripcion: 'Ratoncito blanco de tela suave con cuello cuadrillé marrón, curioso y tierno.',
        precio: PRECIO_LANZAMIENTO,
        categoria: 'animales',
        imagen: 'images/nuevosMuñecos/raton.jpeg'
    },
    {
        id: 'caballo',
        nombre: 'Caballito',
        descripcion: 'Caballito blanco con cola de hilo y moño verde cuadrillé, elegante y suave.',
        precio: PRECIO_LANZAMIENTO,
        categoria: 'animales',
        imagen: 'images/nuevosMuñecos/caballo.jpeg'
    },
    {
        id: 'unicornio',
        nombre: 'Unicornio',
        descripcion: 'Unicornio celeste con cuerno blanco, crin de hilo y alitas suaves.',
        precio: PRECIO_LANZAMIENTO,
        categoria: 'fantasia',
        imagen: 'images/nuevosMuñecos/unicornio.jpeg'
    }
];

// Elementos del DOM
const productGrid = document.getElementById('product-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('order-modal');
const closeBtn = modal.querySelector('.close-btn');
const orderForm = document.getElementById('order-form');
const selectMuneco = document.getElementById('muneco');
const btnHeroCta = document.getElementById('btn-hero-cta');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = lightbox.querySelector('.lightbox-close');

// Función para renderizar los productos
function renderProducts(categoria = 'all') {
    productGrid.innerHTML = '';

    const productosFiltrados = categoria === 'all'
        ? productos
        : productos.filter(p => p.categoria === categoria);

    productosFiltrados.forEach((prod, index) => {
        const formatPrecio = typeof prod.precio === 'number'
            ? `${prod.precio === PRECIO_LANZAMIENTO ? '<span class="price-badge">Precio de lanzamiento</span> ' : ''}$${prod.precio} UYU`
            : prod.precio;

        const imagenHTML = prod.imagen
            ? `<img src="${prod.imagen}" alt="${prod.nombre}, muñeco de tela hecho a mano" loading="lazy">`
            : `<div class="product-emoji">${prod.emoji}</div>`;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.05}s`;
        card.innerHTML = `
            <div class="product-image-wrapper" ${prod.imagen ? `data-img="${prod.imagen}" data-nombre="${prod.nombre}" role="button" tabindex="0" aria-label="Ver foto de ${prod.nombre} en grande"` : ''}>
                ${imagenHTML}
            </div>
            <div class="product-info">
                <h3 class="product-title">${prod.nombre}</h3>
                <p class="product-desc">${prod.descripcion}</p>
                <p class="product-price">${formatPrecio}</p>
                <button class="btn-primary btn-order" data-id="${prod.id}">Encargar este muñeco</button>
            </div>
        `;
        productGrid.appendChild(card);
    });

    document.querySelectorAll('.btn-order').forEach(btn => {
        btn.addEventListener('click', (e) => {
            abrirModal(e.target.dataset.id);
        });
    });

    document.querySelectorAll('.product-image-wrapper[data-img]').forEach(wrapper => {
        wrapper.addEventListener('click', () => abrirLightbox(wrapper.dataset.img, wrapper.dataset.nombre));
        wrapper.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                abrirLightbox(wrapper.dataset.img, wrapper.dataset.nombre);
            }
        });
    });
}

renderProducts();

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);
    });
});

btnHeroCta.addEventListener('click', () => {
    document.getElementById('galeria').scrollIntoView({ behavior: 'smooth' });
});

function poblarSelect() {
    selectMuneco.innerHTML = '<option value="">Selecciona un muñeco...</option>';
    productos.forEach(prod => {
        const option = document.createElement('option');
        option.value = prod.nombre;
        option.textContent = prod.nombre;
        selectMuneco.appendChild(option);
    });
}

poblarSelect();

const dateInput = document.getElementById('fecha');
const hoy = new Date();
hoy.setDate(hoy.getDate() + 14);
const minDate = hoy.toISOString().split('T')[0];
dateInput.setAttribute('min', minDate);

// ==========================================================================
// Lightbox
// ==========================================================================
function abrirLightbox(src, nombre) {
    lightboxImg.src = src;
    lightboxImg.alt = `${nombre}, muñeco de tela hecho a mano`;
    lightboxCaption.textContent = nombre;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function cerrarLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
    document.body.style.overflow = 'auto';
}

lightboxClose.addEventListener('click', cerrarLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) cerrarLightbox();
});

// ==========================================================================
// Modal de pedido
// ==========================================================================
function abrirModal(productoId = null) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    if (productoId) {
        const producto = productos.find(p => p.id === productoId);
        if (producto) {
            selectMuneco.value = producto.nombre;
        }
    }
}

function cerrarModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    setTimeout(() => {
        orderForm.classList.remove('hidden');
        document.getElementById('success-message').classList.add('hidden');
        orderForm.reset();
    }, 300);
}

closeBtn.addEventListener('click', cerrarModal);

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        cerrarModal();
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (lightbox.classList.contains('open')) cerrarLightbox();
        else if (modal.style.display === 'block') cerrarModal();
    }
});

// Envío del formulario por WhatsApp
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const instagram = document.getElementById('instagram').value.trim();
    const muneco = document.getElementById('muneco').value;
    const personalizacion = document.getElementById('personalizacion').value || 'Ninguna';
    const fecha = document.getElementById('fecha').value;
    const nota = document.getElementById('nota').value || 'Sin notas';

    const [year, month, day] = fecha.split('-');
    const fechaFormateada = `${day}/${month}/${year}`;

    const lineaInstagram = instagram ? `📸 Instagram: ${instagram}\n` : '';

    const productoSeleccionado = productos.find(p => p.nombre === muneco);
    const precioPedido = productoSeleccionado && typeof productoSeleccionado.precio === 'number'
        ? productoSeleccionado.precio
        : PRECIO_LANZAMIENTO;
    const etiquetaPrecio = precioPedido === PRECIO_LANZAMIENTO ? 'Precio de lanzamiento' : 'Precio';

    const mensaje = `¡Hola Mimo! 👋 Quiero encargar un muñeco de tela.
🧸 Muñeco: ${muneco}
💰 ${etiquetaPrecio}: $${precioPedido} UYU
🎨 Personalización: ${personalizacion}
📅 Fecha deseada: ${fechaFormateada}
👤 Mi nombre: ${nombre}
${lineaInstagram}✏️ Nota: ${nota}

¡Quedo a la espera! 🪡`;

    const mensajeEncoded = encodeURIComponent(mensaje);
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMERO}?text=${mensajeEncoded}`;

    orderForm.classList.add('hidden');
    document.getElementById('success-message').classList.remove('hidden');

    setTimeout(() => {
        window.open(whatsappLink, '_blank');
        setTimeout(cerrarModal, 3000);
    }, 1500);
});
