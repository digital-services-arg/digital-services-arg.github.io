// Función principal que se ejecuta cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== HEADER SCROLL EFFECT ==========
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // ========== FADE IN ANIMATIONS ==========
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeInOnScroll = function() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    // Ejecutar al cargar y al hacer scroll
    window.addEventListener('scroll', fadeInOnScroll);
    fadeInOnScroll(); // Ejecutar al cargar la página
    
    // ========== MOBILE MENU ==========
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenu.setAttribute('aria-expanded', 'false');
            mobileMenu.querySelector('i').classList.add('fa-bars');
            mobileMenu.querySelector('i').classList.remove('fa-times');
        });
    });
    
    // ========== SMOOTH SCROLLING ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========== UPDATE COPYRIGHT YEAR ==========
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // ========== CLOSE MOBILE MENU WHEN CLICKING OUTSIDE ==========
    document.addEventListener('click', function(event) {
        if (navLinks && mobileMenu) {
            if (!navLinks.contains(event.target) && !mobileMenu.contains(event.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenu.setAttribute('aria-expanded', 'false');
                mobileMenu.querySelector('i').classList.add('fa-bars');
                mobileMenu.querySelector('i').classList.remove('fa-times');
            }
        }
    });
    
    // ========== HANDLE ESCAPE KEY ==========
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenu.setAttribute('aria-expanded', 'false');
            mobileMenu.querySelector('i').classList.add('fa-bars');
            mobileMenu.querySelector('i').classList.remove('fa-times');
        }
    });
    
    // ========== TRACK WHATSAPP CLICKS (para analytics si los agregas después) ==========
    document.querySelectorAll('a[href*="whatsapp"]').forEach(link => {
        link.addEventListener('click', function() {
            console.log('WhatsApp click desde: ' + window.location.href);
            // Aquí puedes agregar Google Analytics o otro tracking
            // gtag('event', 'whatsapp_click', { 'event_category': 'Contacto' });
        });
    });
    
    // ========== LAZY LOADING IMAGES ==========
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ========== ACTIVE NAV LINK ON SCROLL ==========
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-links a[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('.nav-links a[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    });
    
    // ========== PERFORMANCE OPTIMIZATION ==========
    // Debounce para eventos de scroll y resize
    let timeout;
    window.addEventListener('resize', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            // Recalcular cosas si es necesario
        }, 250);
    });
    
    // ========== ADD LOADING CLASS TO BODY (remueve después de cargar) ==========
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
});