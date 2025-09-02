/**
 * Dropdown Fix for Bootstrap 5
 * แก้ไขปัญหา dropdown menu ไม่แสดงผล
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dropdown fix script loaded');
    
    // รอให้ Bootstrap โหลดเสร็จ
    function waitForBootstrap() {
        return new Promise((resolve) => {
            if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
                resolve();
            } else {
                const checkInterval = setInterval(() => {
                    if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
            }
        });
    }
    
    // เริ่มต้น dropdown เมื่อ Bootstrap พร้อม
    async function initializeDropdowns() {
        try {
            await waitForBootstrap();
            console.log('Bootstrap loaded, initializing dropdowns');
            
            // ใช้ Bootstrap Dropdown API
            const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
            dropdownToggles.forEach(toggle => {
                try {
                    // สร้าง Bootstrap Dropdown instance
                    const dropdown = new bootstrap.Dropdown(toggle, {
                        autoClose: true,
                        boundary: 'viewport'
                    });
                    
                    // เพิ่ม event listener สำหรับการแสดง/ซ่อน dropdown
                    toggle.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const dropdownElement = this.closest('.dropdown');
                        const dropdownMenu = dropdownElement.querySelector('.dropdown-menu');
                        
                        // Toggle dropdown
                        if (dropdownElement.classList.contains('show')) {
                            dropdown.hide();
                        } else {
                            // ปิด dropdown อื่นๆ ก่อน
                            document.querySelectorAll('.dropdown.show').forEach(other => {
                                if (other !== dropdownElement) {
                                    const otherToggle = other.querySelector('.dropdown-toggle');
                                    if (otherToggle) {
                                        const otherDropdown = bootstrap.Dropdown.getInstance(otherToggle);
                                        if (otherDropdown) {
                                            otherDropdown.hide();
                                        }
                                    }
                                }
                            });
                            
                            dropdown.show();
                        }
                    });
                    
                    // จัดการการปิด dropdown เมื่อคลิกภายนอก
                    document.addEventListener('click', function(e) {
                        if (!toggle.contains(e.target) && !dropdownElement.contains(e.target)) {
                            dropdown.hide();
                        }
                    });
                    
                    console.log('Dropdown initialized for:', toggle.textContent.trim());
                    
                } catch (error) {
                    console.warn('Failed to initialize Bootstrap dropdown, using fallback:', error);
                    initializeFallbackDropdown(toggle);
                }
            });
            
        } catch (error) {
            console.error('Error initializing dropdowns:', error);
            // ใช้ fallback method
            initializeAllFallbackDropdowns();
        }
    }
    
    // Fallback method สำหรับ dropdown
    function initializeFallbackDropdown(toggle) {
        const dropdownElement = toggle.closest('.dropdown');
        const dropdownMenu = dropdownElement.querySelector('.dropdown-menu');
        
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = dropdownElement.classList.contains('show');
            
            // ปิด dropdown อื่นๆ ก่อน
            document.querySelectorAll('.dropdown.show').forEach(other => {
                if (other !== dropdownElement) {
                    other.classList.remove('show');
                    const otherMenu = other.querySelector('.dropdown-menu');
                    if (otherMenu) {
                        otherMenu.style.display = 'none';
                    }
                }
            });
            
            // Toggle dropdown ปัจจุบัน
            if (isOpen) {
                dropdownElement.classList.remove('show');
                dropdownMenu.style.display = 'none';
            } else {
                dropdownElement.classList.add('show');
                dropdownMenu.style.display = 'block';
            }
            
            // หมุนลูกศร
            const arrow = toggle.querySelector('svg');
            if (arrow) {
                arrow.style.transform = dropdownElement.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
        
        // ปิด dropdown เมื่อคลิก item
        const dropdownItems = dropdownElement.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                dropdownElement.classList.remove('show');
                dropdownMenu.style.display = 'none';
                
                const arrow = toggle.querySelector('svg');
                if (arrow) {
                    arrow.style.transform = 'rotate(0deg)';
                }
            });
        });
    }
    
    // เริ่มต้น fallback dropdown ทั้งหมด
    function initializeAllFallbackDropdowns() {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            initializeFallbackDropdown(toggle);
        });
    }
    
    // เริ่มต้น dropdown
    initializeDropdowns();
    
    // จัดการการปิด dropdown เมื่อกด ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.dropdown.show').forEach(dropdown => {
                dropdown.classList.remove('show');
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu) {
                    menu.style.display = 'none';
                }
                
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    const arrow = toggle.querySelector('svg');
                    if (arrow) {
                        arrow.style.transform = 'rotate(0deg)';
                    }
                }
            });
        }
    });
    
    // จัดการการปิด dropdown เมื่อคลิกภายนอก
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown.show').forEach(dropdown => {
                dropdown.classList.remove('show');
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu) {
                    menu.style.display = 'none';
                }
                
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    const arrow = toggle.querySelector('svg');
                    if (arrow) {
                        arrow.style.transform = 'rotate(0deg)';
                    }
                }
            });
        }
    });
});

console.log('Dropdown fix script loaded successfully');
