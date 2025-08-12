/**
 * Main JavaScript File
 * จัดการการทำงานหลักของเว็บไซต์
 */

// Import Component Loader
import './components/ComponentLoader.js';

// Global error handler for Bootstrap issues
window.addEventListener('error', (event) => {
    if (event.error && event.error.message && 
        (event.error.message.includes('backdrop') || 
         event.error.message.includes('Cannot read properties of undefined'))) {
        console.warn('Bootstrap error detected, using fallback mode:', event.error.message);
        // Prevent the error from breaking the page
        event.preventDefault();
        return false;
    }
});

// ข้อมูลสำหรับ component ต่างๆ
const pageData = {
    title: 'EvA Cloud - Window and Door Software',
    description: 'EvA Cloud is a powerful window and door software. Trusted by industry-leading brands. Complete software for uPVC & Aluminium windows and doors manufacturers',
    keywords: 'window and door software, EvA Cloud, free software for aluminium windows and doors, software for aluminium windows and doors',
    ogTitle: 'EvA Cloud - Window and Door Software',
    ogDescription: 'Save Time, Reduce Wastage and Streamline your process with EvA\'s Windows and Doors Fabrication Software'
};

/**
 * เริ่มต้นแอปพลิเคชัน
 */
class App {
    constructor() {
        this.componentLoader = window.ComponentLoader;
        this.init();
    }

    /**
     * เริ่มต้นแอปพลิเคชัน
     */
    async init() {
        try {
            // รอให้ Bootstrap โหลดเสร็จ
            await this.waitForBootstrap();
            
            // โหลด head component
            await this.loadHeadComponent();
            
            // โหลด components หลัก
            await this.loadMainComponents();
            
            // เริ่มต้น event listeners
            this.initializeEventListeners();
            
            // เริ่มต้น animations
            this.initializeAnimations();
            
            console.log('App initialized successfully');
            
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    /**
     * ตรวจสอบว่า Bootstrap พร้อมใช้งานหรือไม่
     */
    isBootstrapAvailable() {
        try {
            return typeof bootstrap !== 'undefined' && 
                   bootstrap.Offcanvas && 
                   typeof bootstrap.Offcanvas.getInstance === 'function' &&
                   bootstrap.Dropdown &&
                   typeof bootstrap.Dropdown.getInstance === 'function';
        } catch (error) {
            console.warn('Bootstrap check failed:', error);
            return false;
        }
    }

    /**
     * รอให้ Bootstrap โหลดเสร็จ
     */
    async waitForBootstrap() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 seconds timeout
            
            const checkBootstrap = () => {
                attempts++;
                if (this.isBootstrapAvailable()) {
                    console.log('Bootstrap loaded successfully');
                    resolve();
                } else if (attempts >= maxAttempts) {
                    console.warn('Bootstrap loading timeout, continuing without Bootstrap Offcanvas');
                    resolve();
                } else {
                    setTimeout(checkBootstrap, 100);
                }
            };
            checkBootstrap();
        });
    }

    /**
     * โหลด head component
     */
    async loadHeadComponent() {
        const headContainer = document.querySelector('head');
        if (headContainer) {
            const headComponent = await fetch('/components/layout/head.html');
            const headHTML = await headComponent.text();
            // รองรับ meta เฉพาะหน้า หากมีการกำหนดไว้ที่ window.__PAGE_META__
            const metaOverride = window.__PAGE_META__ || {};
            const mergedData = { ...pageData, ...metaOverride };
            const processedHead = this.componentLoader.processTemplate(headHTML, mergedData).replaceAll('assets/', '/assets/');

            // แทนที่ head content
            headContainer.innerHTML = processedHead;

            // ทำให้สคริปต์ใน head ถูกประมวลผลใหม่ (เช่น bootstrap ที่มี defer)
            this.reactivateHeadScripts(headContainer);
        }
    }

    /**
     * ทำให้แท็ก <script> ที่ถูกเพิ่มด้วย innerHTML ทำงานอีกครั้ง
     */
    reactivateHeadScripts(headEl) {
        try {
            const scripts = Array.from(headEl.querySelectorAll('script'));
            scripts.forEach((oldScript) => {
                const newScript = document.createElement('script');
                // คัดลอกแอตทริบิวต์ทั้งหมด
                for (const attr of oldScript.attributes) {
                    newScript.setAttribute(attr.name, attr.value);
                }
                // คัดลอกโค้ดภายใน (ถ้าไม่มี src)
                if (!oldScript.src && oldScript.textContent) {
                    newScript.textContent = oldScript.textContent;
                }
                oldScript.replaceWith(newScript);
            });
        } catch (e) {
            console.warn('Failed to reactivate head scripts:', e);
        }
    }

    /**
     * โหลด components หลัก
     */
    async loadMainComponents() {
        const possibleComponents = [
            { name: 'header', container: 'header-container' },
            { name: 'sections/hero', container: 'hero-container' },
            { name: 'sections/industries', container: 'industries-container' },
            { name: 'footer', container: 'footer-container' },
            { name: 'ui/quick-enquiry', container: 'quick-enquiry-container' }
        ];

        // โหลดเฉพาะ component ที่มี container อยู่ในหน้านั้น ๆ เพื่อให้รองรับหลายหน้า
        const components = possibleComponents.filter(c => document.getElementById(c.container));
        if (components.length) {
            await this.componentLoader.loadMultipleComponents(components);
        }
        
        // เพิ่ม animation classes สำหรับหน้า about
        this.addAboutPageAnimations();
    }

    /**
     * เริ่มต้น event listeners
     */
    initializeEventListeners() {
        // Smooth scrolling สำหรับ navigation links
        this.initializeSmoothScrolling();
        
        // Lazy loading สำหรับ images
        this.initializeLazyLoading();
        
        // Form validation
        this.initializeFormValidation();
        
        // Mobile menu toggle
        this.initializeMobileMenu();
        
        // Scroll effects
        this.initializeScrollEffects();
        
        // Trusted Brands tab switching
        this.initializeTrustedBrandsTabs();
        
        // Hero Slider
        this.initializeHeroSlider();
        
        // Dropdown functionality
        this.initializeDropdowns();
    }

    /**
     * เริ่มต้น smooth scrolling
     */
    initializeSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * เริ่มต้น lazy loading
     */
    initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                    observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
     * เริ่มต้น form validation
     */
    initializeFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
        });
    });
}

    /**
     * ตรวจสอบความถูกต้องของ form
     */
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }

            // ตรวจสอบ email
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    this.showFieldError(input, 'Please enter a valid email address');
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    /**
     * แสดงข้อผิดพลาดของ field
     */
    showFieldError(input, message) {
        this.clearFieldError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = '#dc3545';
    }

    /**
     * ล้างข้อผิดพลาดของ field
     */
    clearFieldError(input) {
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        input.style.borderColor = '';
    }

    /**
     * เริ่มต้น mobile menu
     */
    initializeMobileMenu() {
        // รอให้ DOM พร้อมก่อน
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeMobileMenu());
            return;
        }
        
        const mobileMenuToggle = document.querySelector('[data-bs-toggle="offcanvas"]');
        const mobileMenu = document.getElementById('staticBackdropMenu');
        
        if (mobileMenuToggle && mobileMenu) {
            // กันสถานะค้างจากรอบก่อน ๆ
            this.resetMobileMenuState();

            mobileMenuToggle.addEventListener('click', () => {
                
                // ตรวจสอบว่า Bootstrap พร้อมใช้งานหรือไม่
                if (this.isBootstrapAvailable()) {
                    try {
                        // ใช้ Bootstrap Offcanvas
                        let bsOffcanvas = bootstrap.Offcanvas.getInstance(mobileMenu);
                        if (!bsOffcanvas) {
                            bsOffcanvas = new bootstrap.Offcanvas(mobileMenu);
                        }
                        
                        if (!mobileMenu.classList.contains('show')) {
                            bsOffcanvas.show();
                        } else {
                            bsOffcanvas.hide();
                        }
                    } catch (error) {
                        console.warn('Bootstrap Offcanvas error, using fallback:', error);
                        this.toggleMobileMenuFallback(mobileMenu);
                    }
                } else {
                    // Fallback: ใช้ CSS classes
                    this.toggleMobileMenuFallback(mobileMenu);
                }
            });

            // จัดการ dropdown ในมือถือ
            this.initializeMobileDropdowns(mobileMenu);

            // ปิดเมนูเมื่อกดลิงก์/ปุ่มภายใน
            const closeTargets = mobileMenu.querySelectorAll('[data-bs-dismiss="offcanvas"], .offcanvas-body .nav-link:not(.dropdown-toggle), .offcanvas .btn-reg');
            closeTargets.forEach((el) => {
                el.addEventListener('click', () => {
                    if (this.isBootstrapAvailable()) {
                        try {
                            const bsOffcanvas = bootstrap.Offcanvas.getInstance(mobileMenu) || new bootstrap.Offcanvas(mobileMenu);
                            bsOffcanvas.hide();
                        } catch (error) {
                            this.hideMobileMenuFallback(mobileMenu);
                        }
                    } else {
                        this.hideMobileMenuFallback(mobileMenu);
                    }
                });
            });

            // sync สถานะ body กับอีเวนต์ของ Bootstrap offcanvas
            if (this.isBootstrapAvailable()) {
                try {
                    mobileMenu.addEventListener('shown.bs.offcanvas', () => {
                        document.body.classList.add('mobile-menu-open');
                    });
                    mobileMenu.addEventListener('hidden.bs.offcanvas', () => {
                        this.resetMobileMenuState();
                    });
                } catch (_) { /* noop */ }
            }

            // ปิด menu เมื่อคลิกนอก menu
            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) {
                    // ตรวจสอบว่า Bootstrap พร้อมใช้งานหรือไม่
                    if (this.isBootstrapAvailable()) {
                        try {
                            const bsOffcanvas = bootstrap.Offcanvas.getInstance(mobileMenu);
                            if (bsOffcanvas) {
                                bsOffcanvas.hide();
                            }
                        } catch (error) {
                            console.warn('Bootstrap Offcanvas error, using fallback:', error);
                            this.hideMobileMenuFallback(mobileMenu);
                        }
                    } else {
                        // Fallback: ปิด menu ด้วยการลบ class
                        this.hideMobileMenuFallback(mobileMenu);
                    }
                }
            });

            // ล้างสถานะค้างเมื่อมีการเปลี่ยนขนาดจอ/หมุนจอ
            const cleanup = () => this.resetMobileMenuState();
            window.addEventListener('resize', cleanup);
            window.addEventListener('orientationchange', cleanup);
        }
    }

    /**
     * เริ่มต้น dropdown ในมือถือ
     */
    initializeMobileDropdowns(mobileMenu) {
        const dropdownToggles = mobileMenu.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = toggle.closest('.dropdown');
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                
                // ปิด dropdown อื่นๆ ก่อน
                mobileMenu.querySelectorAll('.dropdown.show').forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('show');
                        const otherMenu = otherDropdown.querySelector('.dropdown-menu');
                        if (otherMenu) {
                            otherMenu.style.display = 'none';
                        }
                    }
                });
                
                // Toggle dropdown ปัจจุบัน
                dropdown.classList.toggle('show');
                if (dropdown.classList.contains('show')) {
                    dropdownMenu.style.display = 'block';
                } else {
                    dropdownMenu.style.display = 'none';
                }
                
                // หมุนลูกศร
                const arrow = toggle.querySelector('svg');
                if (arrow) {
                    arrow.style.transform = dropdown.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            });
        });
        
        // ปิด dropdown เมื่อคลิก item
        const dropdownItems = mobileMenu.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                // ปิดเมนูมือถือทั้งหมด
                if (this.isBootstrapAvailable()) {
                    try {
                        const bsOffcanvas = bootstrap.Offcanvas.getInstance(mobileMenu);
                        if (bsOffcanvas) {
                            bsOffcanvas.hide();
                        }
                    } catch (error) {
                        this.hideMobileMenuFallback(mobileMenu);
                    }
                } else {
                    this.hideMobileMenuFallback(mobileMenu);
                }
            });
        });
    }

    /**
     * Fallback สำหรับ toggle mobile menu
     */
    toggleMobileMenuFallback(mobileMenu) {
        mobileMenu.classList.toggle('show');
        document.body.classList.toggle('offcanvas-open');
        
        // สร้าง backdrop ถ้ายังไม่มี
        if (mobileMenu.classList.contains('show')) {
            this.createBackdrop();
        } else {
            this.removeBackdrop();
        }
    }

    /**
     * Fallback สำหรับซ่อน mobile menu
     */
    hideMobileMenuFallback(mobileMenu) {
        mobileMenu.classList.remove('show');
        document.body.classList.remove('offcanvas-open');
        document.body.classList.remove('mobile-menu-open');
        this.removeBackdrop();
    }

    /**
     * รีเซ็ตสถานะเมนูและ backdrop ที่อาจค้างอยู่ เพื่อป้องกันหน้าเลื่อนไม่ได้
     */
    resetMobileMenuState() {
        try {
            const mobileMenu = document.getElementById('staticBackdropMenu');
            if (mobileMenu) {
                mobileMenu.classList.remove('show');
            }
            document.body.classList.remove('offcanvas-open');
            document.body.classList.remove('mobile-menu-open');
            this.removeBackdrop();
        } catch (_) { /* noop */ }
    }

    /**
     * สร้าง backdrop สำหรับ mobile menu
     */
    createBackdrop() {
        if (!document.querySelector('.offcanvas-backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.className = 'offcanvas-backdrop';
            backdrop.addEventListener('click', () => {
                const mobileMenu = document.getElementById('staticBackdropMenu');
                if (mobileMenu) {
                    mobileMenu.classList.remove('show');
                    document.body.classList.remove('offcanvas-open');
                    document.body.classList.remove('mobile-menu-open');
                    this.removeBackdrop();
                }
            });
            document.body.appendChild(backdrop);
        }
    }

    /**
     * ลบ backdrop สำหรับ mobile menu
     */
    removeBackdrop() {
        const backdrop = document.querySelector('.offcanvas-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    }

    /**
     * เริ่มต้น scroll effects
     */
    initializeScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // ดู elements ที่ต้องการ animation
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));

        // ควบคุมการเปลี่ยนสีของส่วนหัวเมื่อเลื่อน
        this.initializeHeaderScrollEffect();
    }

    /**
     * ควบคุมการเปลี่ยนสีของส่วนหัวเมื่อเลื่อน
     */
    initializeHeaderScrollEffect() {
        const navbar = document.querySelector('.navbar-header-menu');
        
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });

            // ตรวจสอบสถานะเริ่มต้น
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            }
        }
    }

    /**
     * เริ่มต้น Trusted Brands tab switching
     */
    initializeTrustedBrandsTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const systemSuppliersGrid = document.getElementById('system-suppliers');
        const corporateClientsGrid = document.getElementById('corporate-clients');
        
        if (!tabButtons.length || !systemSuppliersGrid || !corporateClientsGrid) return;
        
        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                // ลบ active class จากปุ่มทั้งหมด
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // เพิ่ม active class ให้ปุ่มที่คลิก
                button.classList.add('active');
                
                // สลับการแสดงผล grid
                if (index === 0) {
                    // System Suppliers
                    systemSuppliersGrid.style.display = 'grid';
                    corporateClientsGrid.style.display = 'none';
                } else {
                    // Corporate Clients
                    systemSuppliersGrid.style.display = 'none';
                    corporateClientsGrid.style.display = 'grid';
                }
            });
        });
    }

    /**
     * เริ่มต้น Hero Slider
     */
    initializeHeroSlider() {
        const slides = document.querySelectorAll('.device-slide');
        const indicators = document.querySelectorAll('.indicator');
        
        if (slides.length === 0) return;
        
        let currentSlide = 0;
        let slideInterval;
        
        // ฟังก์ชันแสดงสไลด์
        const showSlide = (slideIndex) => {
            // ซ่อนสไลด์ทั้งหมด
            slides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // ลบ active class จาก indicators ทั้งหมด
            indicators.forEach(indicator => {
                indicator.classList.remove('active');
            });
            
            // แสดงสไลด์ที่เลือก
            if (slides[slideIndex]) {
                slides[slideIndex].classList.add('active');
            }
            
            // ตั้งค่า indicator ที่เลือก
            if (indicators[slideIndex]) {
                indicators[slideIndex].classList.add('active');
            }
            
            currentSlide = slideIndex;
        };
        
        // ฟังก์ชันสไลด์ถัดไป
        const nextSlide = () => {
            const nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        };
        
        // Event listeners สำหรับ indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
                this.resetSlideInterval();
            });
        });
        
        // Auto-play สไลด์
        this.startSlideInterval = () => {
            slideInterval = setInterval(() => {
                nextSlide();
            }, 3000); // เปลี่ยนสไลด์ทุก 3 วินาที (เร็วขึ้น)
        };
        
        this.resetSlideInterval = () => {
            if (slideInterval) {
                clearInterval(slideInterval);
                this.startSlideInterval();
            }
        };
        
        // เริ่มต้น auto-play
        this.startSlideInterval();
        
        // หยุด auto-play เมื่อ hover
        const deviceMockups = document.querySelector('.device-mockups');
        if (deviceMockups) {
            deviceMockups.addEventListener('mouseenter', () => {
                if (slideInterval) {
                    clearInterval(slideInterval);
                }
            });
            
            deviceMockups.addEventListener('mouseleave', () => {
                this.startSlideInterval();
            });
        }
        
        // แสดงสไลด์แรก
        showSlide(0);
    }

    /**
     * เริ่มต้น Dropdown functionality
     */
    initializeDropdowns() {
        // รอให้ DOM โหลดเสร็จ
        setTimeout(() => {
            const dropdowns = document.querySelectorAll('.dropdown');
            
            // ตรวจสอบว่า Bootstrap พร้อมใช้งานหรือไม่
            if (this.isBootstrapAvailable()) {
                try {
                    // ใช้ Bootstrap Dropdown
                    dropdowns.forEach(dropdown => {
                        const toggle = dropdown.querySelector('.dropdown-toggle');
                        if (toggle) {
                            // ใช้ Bootstrap Dropdown API
                            const bsDropdown = new bootstrap.Dropdown(toggle);
                            
                            // จัดการการคลิกเมนู items
                            const menuItems = dropdown.querySelectorAll('.dropdown-item');
                            menuItems.forEach(item => {
                                item.addEventListener('click', (e) => {
                                    e.stopPropagation();
                                    const href = item.getAttribute('href');
                                    if (href && href !== '#') {
                                        window.location.href = href;
                                    }
                                });
                            });
                        }
                    });
                    console.log('Bootstrap dropdowns initialized successfully');
                    return;
                } catch (error) {
                    console.warn('Bootstrap dropdown initialization failed, using fallback:', error);
                }
            }
            
            // Fallback: ใช้ custom dropdown functionality
            dropdowns.forEach(dropdown => {
                const toggle = dropdown.querySelector('.dropdown-toggle');
                const menu = dropdown.querySelector('.dropdown-menu');
                
                if (!toggle || !menu) return;
                
                // Toggle dropdown on click
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isOpen = dropdown.classList.contains('show');
                    
                    // Close all other dropdowns
                    dropdowns.forEach(other => {
                        if (other !== dropdown) {
                            other.classList.remove('show');
                            const otherMenu = other.querySelector('.dropdown-menu');
                            if (otherMenu) {
                                otherMenu.classList.remove('show');
                            }
                        }
                    });
                    
                    // Toggle current dropdown
                    if (isOpen) {
                        dropdown.classList.remove('show');
                        menu.classList.remove('show');
                    } else {
                        dropdown.classList.add('show');
                        menu.classList.add('show');
                    }
                });
                
                // Close dropdown when clicking on menu items
                const menuItems = menu.querySelectorAll('.dropdown-item');
                menuItems.forEach(item => {
                    item.addEventListener('click', (e) => {
                        // Allow the link to work normally
                        e.stopPropagation();
                        
                        // Close the dropdown
                        dropdown.classList.remove('show');
                        menu.classList.remove('show');
                        
                        // Navigate to the href
                        const href = item.getAttribute('href');
                        if (href && href !== '#') {
                            window.location.href = href;
                        }
                    });
                });
            });
            
            // Close dropdowns when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.dropdown')) {
                    dropdowns.forEach(dropdown => {
                        dropdown.classList.remove('show');
                        const menu = dropdown.querySelector('.dropdown-menu');
                        if (menu) {
                            menu.classList.remove('show');
                        }
                    });
                }
            });
            
            // Close dropdowns on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    dropdowns.forEach(dropdown => {
                        dropdown.classList.remove('show');
                        const menu = dropdown.querySelector('.dropdown-menu');
                        if (menu) {
                            menu.classList.remove('show');
                        }
                    });
                }
            });
            
            console.log('Fallback dropdowns initialized successfully');
        }, 100);
    }

        /**
     * เพิ่ม animation classes สำหรับหน้า about
     */
    addAboutPageAnimations() {
        // เพิ่ม animation classes ให้กับ elements ในหน้า about
        const aboutElements = document.querySelectorAll('.stats-grid, .mission-card, .vision-card, .value-card, .team-card');
        
        aboutElements.forEach((element, index) => {
            element.classList.add('animate-on-scroll');
            element.style.animationDelay = `${index * 0.2}s`;
        });
        
        // เริ่มต้น animation observer สำหรับหน้า about
        this.initializeAboutAnimations();
    }
    
    /**
     * เริ่มต้น animation observer สำหรับหน้า about
     */
    initializeAboutAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // ดู elements ที่ต้องการ animation
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));
    }

    /**
     * เริ่มต้น animations
     */
    initializeAnimations() {
        // เพิ่ม CSS classes สำหรับ animation
        const style = document.createElement('style');
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
            
            .animate-on-scroll.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .mobile-menu-open {
                overflow: hidden;
            }
            
            /* Fallback mobile menu styles */
            .offcanvas.show {
                transform: translateX(0) !important;
                visibility: visible !important;
                z-index: 1045;
            }
            
            .offcanvas {
                transform: translateX(-100%);
                transition: transform 0.3s ease-in-out;
                visibility: hidden;
                z-index: 1045;
            }
            
            .offcanvas-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1040;
            }
            
            .offcanvas-open {
                overflow: hidden;
                touch-action: none;
                overscroll-behavior: contain;
            }
            
            /* Dropdown styles for better functionality */
            .dropdown-menu.show {
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
                transform: translateY(0) !important;
            }
            
            .dropdown.show .dropdown-toggle svg {
                transform: rotate(180deg);
            }
            
            .quick-enquiry-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }
            
            .quick-enquiry-modal .modal-content {
                background: white;
                border-radius: 10px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .quick-enquiry-modal .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }
            
            .quick-enquiry-modal .close-btn {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
            }
            
            .quick-enquiry-modal .form-group {
                margin-bottom: 1rem;
            }
            
            .quick-enquiry-modal input,
            .quick-enquiry-modal textarea {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 1rem;
            }
            
            .quick-enquiry-modal .btn-primary {
                background: #fbbf24;
                border: none;
                color: #121f3e;
                padding: 0.75rem 2rem;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .quick-enquiry-modal .btn-primary:hover {
                background: #f59e0b;
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
    }
}

// เริ่มต้นแอปพลิเคชันเมื่อ DOM โหลดเสร็จ
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// Export สำหรับใช้ในไฟล์อื่น
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
} else {
    window.App = App;
}
