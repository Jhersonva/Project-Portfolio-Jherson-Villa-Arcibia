// Inicializar AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    disable: window.innerWidth < 768 // Deshabilitar en móvil para mejor rendimiento
});

// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 2000);
});

// Custom Cursor - Solo en desktop
if (window.innerWidth >= 769) {
    const cursor = document.querySelector('.cursor');

    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const interactiveElements = document.querySelectorAll('a, button, .tech-item, .project-card, .contact-item, input, textarea, .theme-toggle');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
            });
        });
    }
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        if (document.body.classList.contains('light-mode')) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// Mobile Menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Cerrar menú al hacer click en un enlace
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Three.js Background - Optimizado para móvil
const canvas = document.getElementById('canvas');
if (canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limitar pixel ratio para rendimiento

    // Crear partículas - menos partículas en móvil
    const particlesCount = window.innerWidth < 768 ? 500 : 2000;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 10;
        posArray[i + 1] = (Math.random() - 0.5) * 10;
        posArray[i + 2] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: window.innerWidth < 768 ? 0.015 : 0.02,
        color: 0x6366f1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Animación
    function animate() {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.x += 0.0001;
        particlesMesh.rotation.y += 0.0002;
        
        renderer.render(scene, camera);
    }

    animate();

    // Resize handler optimizado
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }, 250);
    });
}

// Smooth scroll mejorado
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            // Cerrar menú móvil si está abierto
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenuBtn?.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }

            const navHeight = document.querySelector('nav')?.offsetHeight || 80;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ================= EMAILJS =================
(function(){
    emailjs.init("Vo5DXV7qaa1RIv0Sg");
})();

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const message = contactForm.message.value.trim();

        // ================= VALIDACIONES =================
        if (name.length < 3) {
            Swal.fire({
                icon: 'warning',
                title: 'Nombre inválido',
                text: 'El nombre debe tener al menos 3 caracteres'
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'warning',
                title: 'Email inválido',
                text: 'Ingresa un correo válido'
            });
            return;
        }

        if (message.length < 10) {
            Swal.fire({
                icon: 'warning',
                title: 'Mensaje muy corto',
                text: 'El mensaje debe tener al menos 10 caracteres'
            });
            return;
        }

        // ================= LOADER =================
        Swal.fire({
            title: 'Enviando mensaje...',
            html: 'Por favor espera ⏳',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // ================= ENVÍO =================
        emailjs.sendForm('service_u9rvpnp', 'template_v84wws2', contactForm)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Mensaje enviado!',
                    text: 'Te responderé lo antes posible 🚀',
                    confirmButtonColor: '#6366f1'
                });

                contactForm.reset();
            })
            .catch((error) => {
                console.error(error);

                Swal.fire({
                    icon: 'error',
                    title: 'Error al enviar',
                    text: 'Intenta nuevamente más tarde',
                    confirmButtonColor: '#ef4444'
                });
            });
    });
}

// GSAP Animations - Solo si GSAP está disponible
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero section animations - Solo desktop
    if (window.innerWidth >= 768) {
        gsap.from('.hero-title', {
            y: 100,
            duration: 1.5,
            ease: 'power4.out'
        });

        gsap.from('.hero-subtitle', {
            opacity: 0,
            y: 50,
            duration: 1.5,
            delay: 0.5,
            ease: 'power4.out'
        });

        gsap.from('.hero-cta', {
            opacity: 0,
            y: 50,
            duration: 1.5,
            delay: 1,
            ease: 'power4.out'
        });

        // Parallax effect on scroll
        gsap.to('.hero', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            y: 100,
            opacity: 0.5
        });
    }

    // Technology bars animation on scroll
    gsap.utils.toArray('.tech-level-bar').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        ScrollTrigger.create({
            trigger: bar,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(bar, {
                    width: width,
                    duration: 1.5,
                    ease: 'power2.out'
                });
            }
        });
    });
}

// Detectar cambios de tamaño de pantalla para recargar AOS
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        AOS.refresh();
        
        // Re-evaluar cursor visibility
        if (window.innerWidth < 769) {
            document.querySelector('.cursor')?.style.setProperty('display', 'none');
        } else {
            document.querySelector('.cursor')?.style.setProperty('display', 'block');
        }
    }, 250);
});

