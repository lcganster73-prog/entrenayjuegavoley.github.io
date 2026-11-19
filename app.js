
document.addEventListener('DOMContentLoaded', () => {

    // 1. MENÚ LATERAL
    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('open-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const navLinksSidebar = document.querySelectorAll('.sidebar-container .nav-link');

    openSidebarBtn.addEventListener('click', () => {
        sidebar.classList.add('active');
    });

    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });

    navLinksSidebar.forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    });

    // 2. MODAL PARA VIDEOS DE YOUTUBE
    const modal = document.getElementById('video-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const youtubeIframe = document.getElementById('youtube-iframe');
    const videoButtons = document.querySelectorAll('.btn-video');

    videoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const videoId = btn.getAttribute('data-youtube-id');
            youtubeIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            modal.classList.add('open');
        });
    });

    closeModalBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('open');
        youtubeIframe.src = '';
    }

    // 3. ACORDEÓN DE REGLAS
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            accordionItem.classList.toggle('active');

            document.querySelectorAll('.accordion-item').forEach(item => {
                if (item !== accordionItem) {
                    item.classList.remove('active');
                }
            });
        });
    });

    // 4. SISTEMAS DE JUEGO
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // 4.1 ANIMACIÓN DE ROTACIÓN DE LOS TRES SISTEMAS

    const canchas = document.querySelectorAll('.court-diagram');

    canchas.forEach(court => {
        const cancha = court.querySelector('.court-half');
        const jugadores = cancha.querySelectorAll('.player');

        // Posiciones de los seis jugadores
        const posiciones = {
            1: { top: '78%', left: '83%' },
            2: { top: '18%', left: '83%' },
            3: { top: '18%', left: '50%' },
            4: { top: '18%', left: '17%' },
            5: { top: '78%', left: '17%' },
            6: { top: '78%', left: '50%' }
        };

        // Orden de rotación: 1 -> 6 -> 5 -> 4 -> 3 -> 2 -> 1
        const siguiente = {
            1: 6,
            6: 5,
            5: 4,
            4: 3,
            3: 2,
            2: 1
        };

        cancha.classList.add('rotating-court');

        jugadores.forEach(jugador => {
            const clase = Array.from(jugador.classList)
                .find(nombre => /^pos-[1-6]$/.test(nombre));

            const numero = clase.replace('pos-', '');

            jugador.dataset.posicion = numero;
            jugador.style.top = posiciones[numero].top;
            jugador.style.left = posiciones[numero].left;
        });

        // Crear botón para iniciar y detener
        const boton = document.createElement('button');
        boton.className = 'btn-rotacion';
        boton.textContent = '▶ Iniciar rotación';

        court.appendChild(boton);

        let intervalo = null;

        function rotarJugadores() {
            jugadores.forEach(jugador => {
                const posicionActual = jugador.dataset.posicion;
                const nuevaPosicion = siguiente[posicionActual];

                jugador.dataset.posicion = nuevaPosicion;

                jugador.style.top = posiciones[nuevaPosicion].top;
                jugador.style.left = posiciones[nuevaPosicion].left;
            });
        }

        boton.addEventListener('click', () => {
            if (intervalo === null) {
                rotarJugadores();

                intervalo = setInterval(rotarJugadores, 1800);
                boton.textContent = '⏸ Pausar rotación';
            } else {
                clearInterval(intervalo);
                intervalo = null;
                boton.textContent = '▶ Continuar rotación';
            }
        });
    });


    // 5. FORMULARIO Y ENVÍO A WHATSAPP
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();
        const formStatus = document.getElementById('form-status');

        let isValid = true;

        // Validar nombre
        if (nombre === '') {
            document.getElementById('err-nombre').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('err-nombre').style.display = 'none';
        }

        // Validar correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            document.getElementById('err-email').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('err-email').style.display = 'none';
        }

        // Validar mensaje
        if (mensaje.length < 10) {
            document.getElementById('err-mensaje').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('err-mensaje').style.display = 'none';
        }

        // Enviar los datos a WhatsApp
        if (isValid) {
            const telefono = '59173899061';

            const texto =
                'SUGERENCIA DE MEJORA\n\n' +
                'Nombre completo: ' + nombre + '\n' +
                'Correo electrónico: ' + email + '\n' +
                'Mensaje: ' + mensaje;

            const url = 'https://wa.me/' + telefono +
                '?text=' + encodeURIComponent(texto);

            window.open(url, '_blank');

            formStatus.style.color = '#27ae60';
            formStatus.textContent = 'Abriendo WhatsApp para enviar tu sugerencia.';

        } else {
            formStatus.style.color = '#d9534f';
            formStatus.textContent = 'Por favor, corrige los errores del formulario.';
        }
    });

    // 6. CARRUSEL DE FRASES
    const slides = document.querySelectorAll('.quote-slide');
    const dotsContainer = document.getElementById('carousel-dots');
    let currentSlide = 0;

    if (slides.length > 0 && dotsContainer) {

        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');

            if (index === 0) {
                dot.classList.add('active');
            }

            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');

            currentSlide = index;

            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        setInterval(() => {
            const nextSlide = (currentSlide + 1) % slides.length;
            goToSlide(nextSlide);
        }, 5000);
    }

    // 7. ANIMACIONES Y SCROLLSPY
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Resaltar el menú según la sección
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;

            if (window.pageYOffset >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');

            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });

        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Botón volver arriba
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});
