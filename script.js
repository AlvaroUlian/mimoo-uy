// Catálogo de muñecos de tela (todos de 15 cm aprox.)
const productos = [
    {
        id: 'osito-marron',
        nombre: 'Osito Marrón',
        descripcion: 'Osito de pana marrón con cuellito celeste, suave y abrazable.',
        precio: 1200,
        categoria: 'ositos',
        imagen: 'images/osito-marron.jpeg'
    },
    {
        id: 'osito-blanco',
        nombre: 'Osito Soñador',
        descripcion: 'Osito blanco con gorrito y cuello cuadrillé verde, listo para soñar.',
        precio: 1200,
        categoria: 'ositos',
        imagen: 'images/osito-blanco.jpeg'
    },
    {
        id: 'patito-gorro-verde',
        nombre: 'Patito Fiestero',
        descripcion: 'Patito blanco con gorrito y cuello a rayas verdes, ¡siempre de festejo!',
        precio: 1300,
        categoria: 'patitos',
        imagen: 'images/patito-gorro-verde.jpeg'
    },
    {
        id: 'patito-cuadrille',
        nombre: 'Patito Campestre',
        descripcion: 'Patito de tela suave con moño verde y bufanda cuadrillé.',
        precio: 1300,
        categoria: 'patitos',
        imagen: 'images/patito-cuadrille.jpeg'
    },
    {
        id: 'gansa-mono-rosa',
        nombre: 'Gansa Rosita',
        descripcion: 'Gansita de lino con moño y cinta rosa, dulce y elegante.',
        precio: 1300,
        categoria: 'patitos',
        imagen: 'images/gansa-mono-rosa.jpeg'
    },
    {
        id: 'coneja-rosa',
        nombre: 'Coneja Rosita',
        descripcion: 'Conejita de orejas largas con cuello rosa cuadrillé y mejillas sonrojadas.',
        precio: 1400,
        categoria: 'conejitos',
        imagen: 'images/coneja-rosa.jpeg'
    },
    {
        id: 'conejo-gorro-rosa',
        nombre: 'Conejita Fiestera',
        descripcion: 'Conejita blanca con gorrito rosa a lunares y pompón, ¡de cumpleaños!',
        precio: 1400,
        categoria: 'conejitos',
        imagen: 'images/conejo-gorro-rosa.jpeg'
    },
    {
        id: 'conejito-blanco',
        nombre: 'Conejito Nube',
        descripcion: 'Conejito blanco con moño y colita de pompón, suave como una nube.',
        precio: 1300,
        categoria: 'conejitos',
        imagen: 'images/conejito-blanco.jpeg'
    },
    {
        id: 'raton-celeste',
        nombre: 'Ratoncito Celeste',
        descripcion: 'Ratoncito de tela con cuello celeste, curioso y juguetón.',
        precio: 1200,
        categoria: 'ratoncitos',
        imagen: 'images/raton-celeste.jpeg'
    },
    {
        id: 'raton-lila',
        nombre: 'Ratoncita Lila',
        descripcion: 'Ratoncita de orejas grandes con cuello lila a lunares.',
        precio: 1200,
        categoria: 'ratoncitos',
        imagen: 'images/raton-lila.jpeg'
    },
    {
        id: 'raton-verde',
        nombre: 'Ratoncito Bosque',
        descripcion: 'Ratoncito con cuello verde, un amiguito del bosque.',
        precio: 1200,
        categoria: 'ratoncitos',
        imagen: 'images/raton-verde.jpeg'
    },
    {
        id: 'trio-ratoncitos',
        nombre: 'Trío de Ratoncitos',
        descripcion: 'Tres ratoncitos mini con cuellitos lila, verde y rosa. ¡Inseparables!',
        precio: 2800,
        categoria: 'ratoncitos',
        imagen: 'images/trio-ratoncitos.jpeg'
    },
    {
        id: 'dragon-gris',
        nombre: 'Dragoncito Valiente',
        descripcion: 'Dragón de pana gris con alitas celestes, el guardián más tierno.',
        precio: 1500,
        categoria: 'otros',
        imagen: 'images/dragon-gris.jpeg'
    },
    {
        id: 'personalizado',
        nombre: 'Diseño Personalizado',
        descripcion: 'Elegí el animalito, las telas y los colores: lo creamos juntos desde cero.',
        precio: 'A cotizar',
        categoria: 'otros',
        emoji: '✨'
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
        const formatPrecio = typeof prod.precio === 'number' ? `$${prod.precio} UYU` : prod.precio;

        const imagenHTML = prod.imagen
            ? `<img src="${prod.imagen}" alt="${prod.nombre}, muñeco de tela hecho a mano de 15 cm aprox." loading="lazy">
               <span class="size-badge">15 cm aprox.</span>`
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

    // Botones de encargar
    document.querySelectorAll('.btn-order').forEach(btn => {
        btn.addEventListener('click', (e) => {
            abrirModal(e.target.dataset.id);
        });
    });

    // Abrir lightbox al tocar la foto
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

// Inicializar galería
renderProducts();

// Filtrado
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);
    });
});

// Scroll suave desde el hero
btnHeroCta.addEventListener('click', () => {
    document.getElementById('galeria').scrollIntoView({ behavior: 'smooth' });
});

// Llenar el select del formulario con todos los productos
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

// Configurar fecha mínima (2 semanas a partir de hoy)
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
    lightboxImg.alt = `${nombre}, muñeco de tela hecho a mano de 15 cm aprox.`;
    lightboxCaption.textContent = `${nombre} · 15 cm aprox.`;
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

// Cerrar modal o lightbox con la tecla Escape
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (lightbox.classList.contains('open')) cerrarLightbox();
        else if (modal.style.display === 'block') cerrarModal();
    }
});

// Envío del formulario
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const instagram = document.getElementById('instagram').value;
    const muneco = document.getElementById('muneco').value;
    const personalizacion = document.getElementById('personalizacion').value || 'Ninguna';
    const fecha = document.getElementById('fecha').value;
    const nota = document.getElementById('nota').value || 'Sin notas';

    const [year, month, day] = fecha.split('-');
    const fechaFormateada = `${day}/${month}/${year}`;

    const mensaje = `¡Hola mimoo! 👋 Quiero encargar un muñeco de tela.
🧸 Muñeco: ${muneco} (15 cm aprox.)
🎨 Personalización: ${personalizacion}
📅 Fecha deseada: ${fechaFormateada}
👤 Mi nombre: ${nombre}
📸 Mi usuario: ${instagram}
✏️ Nota: ${nota}

¡Quedo a la espera! 🪡`;

    const mensajeEncoded = encodeURIComponent(mensaje);
    const igLink = `https://ig.me/m/mimoo.uy?text=${mensajeEncoded}`;

    orderForm.classList.add('hidden');
    document.getElementById('success-message').classList.remove('hidden');

    setTimeout(() => {
        window.open(igLink, '_blank');
        setTimeout(cerrarModal, 3000);
    }, 1500);
});
