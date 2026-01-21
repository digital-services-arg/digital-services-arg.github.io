// ============================================
// CONFIGURACIÓN INICIAL Y VARIABLES GLOBALES
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Prevenir FOUC (Flash Of Unstyled Content)
    document.body.style.opacity = '0';
    
    // Variables globales
    const header = document.getElementById('header');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const fadeElements = document.querySelectorAll('.fade-in');
    const sections = document.querySelectorAll('section[id]');
    const currentYear = document.getElementById('current-year');
    
    // ============================================
    // FUNCIONES DE UTILIDAD
    // ============================================
    
    /**
     * Debounce para optimizar eventos de scroll y resize
     * @param {Function} func - Función a ejecutar
     * @param {number} wait - Tiempo de espera en ms
     * @returns {Function} Función debounced
     */
    function debounce(func, wait = 100) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Throttle para limitar la frecuencia de ejecución
     * @param {Function} func - Función a ejecutar
     * @param {number} limit - Límite de tiempo en ms
     * @returns {Function} Función throttled
     */
    function throttle(func, limit = 100) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    /**
     * Verifica si un elemento está en el viewport
     * @param {HTMLElement} element - Elemento a verificar
     * @param {number} offset - Offset en píxeles
     * @returns {boolean} True si está en el viewport
     */
    function isInViewport(element, offset = 100) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight - offset) &&
            rect.bottom >= 0
        );
    }
    
    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // ============================================
    // ANIMACIONES FADE IN
    // ============================================
    function handleFadeAnimations() {
        fadeElements.forEach(element => {
            if (isInViewport(element, 100)) {
                element.classList.add('visible');
            }
        });
    }
    
    // ============================================
    // MENÚ MÓVIL
    // ============================================
    function initMobileMenu() {
        if (!mobileMenu || !navLinks) return;
        
        // Toggle del menú
        mobileMenu.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            
            // Cambiar ícono
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
            
            // Prevenir scroll del body cuando el menú está abierto
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });
        
        // Cerrar menú al hacer clic en enlace
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && 
                !mobileMenu.contains(event.target) && 
                navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    function closeMobileMenu() {
        navLinks.classList.remove('active');
        mobileMenu.setAttribute('aria-expanded', 'false');
        const icon = mobileMenu.querySelector('i');
        if (icon.classList.contains('fa-times')) {
            icon.classList.replace('fa-times', 'fa-bars');
        }
        document.body.style.overflow = '';
    }
    
    // ============================================
    // SCROLL SUAVE
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (!targetElement) return;
                
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Actualizar URL sin recargar
                history.pushState(null, null, href);
            });
        });
    }
    
    // ============================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================
    function initActiveNavLinks() {
        if (sections.length === 0) return;
        
        function updateActiveLink() {
            let current = '';
            const scrollPosition = window.scrollY + header.offsetHeight + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && 
                    scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            // Actualizar enlaces activos
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
        
        // Llamar inicialmente y en scroll
        updateActiveLink();
        window.addEventListener('scroll', throttle(updateActiveLink, 100));
    }
    
    // ============================================
    // ACTUALIZAR AÑO COPYRIGHT
    // ============================================
    function updateCopyrightYear() {
        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }
    }
    
    // ============================================
    // TRACKING DE CLICKS WHATSAPP
    // ============================================
    function initWhatsAppTracking() {
        document.querySelectorAll('a[href*="whatsapp"]').forEach(link => {
            link.addEventListener('click', function() {
                // Aquí puedes agregar Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'whatsapp_click', {
                        'event_category': 'Contacto',
                        'event_label': this.href
                    });
                }
                
                // También podrías enviar a tu propio backend
                try {
                    navigator.sendBeacon('/api/track-click', JSON.stringify({
                        type: 'whatsapp',
                        url: this.href,
                        timestamp: Date.now()
                    }));
                } catch (e) {
                    console.log('Tracking no disponible');
                }
            });
        });
    }
    
    // ============================================
    // LAZY LOADING DE IMÁGENES
    // ============================================
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Cargar imagen desde data-src si existe
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        
                        // Cargar imagen desde data-srcset si existe
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                            img.removeAttribute('data-srcset');
                        }
                        
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
            
            // Observar imágenes con lazy loading
            document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback para navegadores antiguos
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }
    
    // ============================================
    // OPTIMIZACIÓN DE PERFORMANCE
    // ============================================
    function initPerformanceOptimization() {
        // Prevenir layout shifts
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete) {
                img.style.opacity = '0';
                img.addEventListener('load', function() {
                    this.style.opacity = '1';
                    this.style.transition = 'opacity 0.3s ease';
                });
            }
        });
        
        // Optimizar animaciones con requestAnimationFrame
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    handleFadeAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    // ============================================
    // INICIALIZACIÓN
    // ============================================
    function init() {
        // Inicializar componentes
        initMobileMenu();
        initSmoothScroll();
        initActiveNavLinks();
        initLazyLoading();
        initWhatsAppTracking();
        initPerformanceOptimization();
        
        // Configurar eventos
        window.addEventListener('scroll', throttle(handleHeaderScroll, 10));
        window.addEventListener('scroll', throttle(handleFadeAnimations, 50));
        window.addEventListener('resize', debounce(handleFadeAnimations, 150));
        
        // Ejecutar funciones iniciales
        handleHeaderScroll();
        handleFadeAnimations();
        updateCopyrightYear();
        
        // Mostrar contenido cuando todo esté listo
        window.addEventListener('load', function() {
            document.body.style.opacity = '1';
            document.body.style.transition = 'opacity 0.3s ease';
            
            // Forzar un reflow para asegurar que las animaciones funcionen
            document.body.offsetHeight;
        });
        
        // Fallback: Mostrar contenido después de 2 segundos máximo
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 2000);
    }
    
    // Inicializar la aplicación
    init();
    
    // ============================================
    // ERROR HANDLING GLOBAL
    // ============================================
    window.addEventListener('error', function(e) {
        console.error('Error capturado:', e.error);
        // Aquí podrías enviar el error a un servicio de monitoreo
    });
    
    // Manejar errores de promesas no capturadas
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Promesa rechazada no capturada:', e.reason);
    });
});