/**
 * Component Loader Module
 * จัดการการโหลด component ต่างๆ
 */

// Global function สำหรับโหลด component
window.loadComponent = async function(containerId, componentPath, data = {}) {
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with ID "${containerId}" not found`);
        }

        // โหลด component จากไฟล์
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load component: ${componentPath}`);
        }

        const html = await response.text();
        
        // แสดงผล component
        container.innerHTML = html;

        // เริ่มต้น component หลังจากโหลดเสร็จ
        initializeComponent(containerId, container);

    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
        showError(containerId, error.message);
    }
};

// Global function สำหรับเริ่มต้น component
window.initializeComponent = function(containerId, container) {
    switch (containerId) {
        case 'header-container':
            initializeHeader(container);
            break;
        case 'footer-container':
            initializeFooter(container);
            break;
        case 'head-container':
            // ไม่ต้องทำอะไรพิเศษ
            break;
        default:
            // Component ไม่ต้องการการเริ่มต้นพิเศษ
            break;
    }
};

// Global function สำหรับแสดง error
window.showError = function(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<div class="alert alert-danger">Error loading component: ${message}</div>`;
    }
};

// Global function สำหรับเริ่มต้น header
window.initializeHeader = function(container) {
    // เริ่มต้น header component
    console.log('Header component initialized');
};

// Global function สำหรับเริ่มต้น footer
window.initializeFooter = function(container) {
    // เริ่มต้น footer component
    console.log('Footer component initialized');
};

class ComponentLoader {
    constructor() {
        this.components = new Map();
        this.loadedComponents = new Set();
    }

    /**
     * โหลด component จากไฟล์ HTML
     * @param {string} componentName - ชื่อ component
     * @param {string} containerId - ID ของ container ที่จะใส่ component
     * @param {Object} data - ข้อมูลที่จะส่งไปยัง component
     * @returns {Promise} Promise ที่ resolve เมื่อโหลดเสร็จ
     */
    async loadComponent(componentName, containerId, data = {}) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                throw new Error(`Container with ID "${containerId}" not found`);
            }

            // ตรวจสอบว่า component ถูกโหลดแล้วหรือไม่
            if (this.loadedComponents.has(componentName)) {
                const cachedComponent = this.components.get(componentName);
                container.innerHTML = this.processTemplate(cachedComponent, data);
                return;
            }

            // โหลด component จากไฟล์ (ใช้ root-absolute path เพื่อให้ทำงานได้ในทุกหน้า)
            const response = await fetch(`/components/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentName}`);
            }

            const html = await response.text();
            
            // เก็บ cache component
            this.components.set(componentName, html);
            this.loadedComponents.add(componentName);

            // แสดงผล component
            container.innerHTML = this.processTemplate(html, data);

            // เรียก event handlers หลังจากโหลดเสร็จ
            this.initializeComponent(componentName, container);

        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
            this.showError(containerId, error.message);
        }
    }

    /**
     * ประมวลผล template และแทนที่ตัวแปร
     * @param {string} template - HTML template
     * @param {Object} data - ข้อมูลที่จะแทนที่
     * @returns {string} HTML ที่ประมวลผลแล้ว
     */
    processTemplate(template, data) {
        let processedTemplate = template;
        
        // แทนที่ตัวแปรในรูปแบบ {{variable}}
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            processedTemplate = processedTemplate.replace(regex, data[key]);
        });

        return processedTemplate;
    }

    /**
     * เริ่มต้น component หลังจากโหลดเสร็จ
     * @param {string} componentName - ชื่อ component
     * @param {HTMLElement} container - Container element
     */
    initializeComponent(componentName, container) {
        switch (componentName) {
            case 'header':
                this.initializeHeader(container);
                break;
            case 'footer':
                this.initializeFooter(container);
                break;
            case 'sections/hero':
                this.initializeHero(container);
                break;
            case 'sections/industries':
                this.initializeIndustries(container);
                break;

            default:
                // Component ไม่ต้องการการเริ่มต้นพิเศษ
                break;
        }
    }

    /**
     * เริ่มต้น Header component
     */
    initializeHeader(container) {
        // เพิ่ม event listeners สำหรับ navigation
        const navLinks = container.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') === '#') {
                    e.preventDefault();
                }
            });
        });

        // เพิ่ม scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                container.classList.add('scrolled');
            } else {
                container.classList.remove('scrolled');
            }
        });
    }

    /**
     * เริ่มต้น Footer component
     */
    initializeFooter(container) {
        // เพิ่ม event listeners สำหรับ footer links
        const footerLinks = container.querySelectorAll('a');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') === '#') {
                    e.preventDefault();
                }
            });
        });
    }

    /**
     * เริ่มต้น Hero section
     */
    initializeHero(container) {
        // เพิ่ม event listeners สำหรับ indicators
        const indicators = container.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.switchSlide(index);
            });
        });

        // Auto slide
        this.startAutoSlide();
    }

    /**
     * เริ่มต้น Industries section
     */
    initializeIndustries(container) {
        // เพิ่ม hover effects
        const industries = container.querySelectorAll('.industry');
        industries.forEach(industry => {
            industry.addEventListener('mouseenter', () => {
                industry.style.transform = 'translateY(-10px)';
            });
            
            industry.addEventListener('mouseleave', () => {
                industry.style.transform = 'translateY(0)';
            });
        });
    }



    /**
     * สลับ slide ใน hero section
     */
    switchSlide(index) {
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }

    /**
     * เริ่ม auto slide
     */
    startAutoSlide() {
        let currentSlide = 0;
        const indicators = document.querySelectorAll('.indicator');
        
        setInterval(() => {
            currentSlide = (currentSlide + 1) % indicators.length;
            this.switchSlide(currentSlide);
        }, 5000);
    }



    /**
     * แสดงข้อผิดพลาด
     */
    showError(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <p>Error loading component: ${message}</p>
                </div>
            `;
        }
    }

    /**
     * โหลดหลาย component พร้อมกัน
     */
    async loadMultipleComponents(components) {
        const promises = components.map(comp => 
            this.loadComponent(comp.name, comp.container, comp.data)
        );
        
        try {
            await Promise.all(promises);
        } catch (error) {
            console.error('Error loading multiple components:', error);
        }
    }
}

// สร้าง instance และ export
const componentLoader = new ComponentLoader();

// Export สำหรับใช้ในไฟล์อื่น
if (typeof module !== 'undefined' && module.exports) {
    module.exports = componentLoader;
} else {
    window.ComponentLoader = componentLoader;
}
