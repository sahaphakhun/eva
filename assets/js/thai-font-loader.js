/**
 * Thai Font Loader for EvA Cloud
 * Manages font loading and fallback for better user experience
 */

class ThaiFontLoader {
    constructor() {
        this.fonts = [
            'Noto Sans Thai',
            'Sarabun'
        ];
        this.loadedFonts = new Set();
        this.init();
    }

    init() {
        // Add loading class to body
        document.body.classList.add('thai-font-loading');
        
        // Start font detection
        this.detectFonts();
        
        // Set up font loading events
        this.setupFontEvents();
    }

    detectFonts() {
        // Check if fonts are already available
        this.fonts.forEach(font => {
            if (this.isFontAvailable(font)) {
                this.loadedFonts.add(font);
            }
        });

        // If fonts are already loaded, apply loaded class
        if (this.loadedFonts.size > 0) {
            this.onFontsLoaded();
        }
    }

    isFontAvailable(fontName) {
        const testString = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const testSize = '72px';
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Get the width of the test string with the fallback font
        context.font = testSize + ' Arial';
        const fallbackWidth = context.measureText(testString).width;
        
        // Get the width of the test string with the target font
        context.font = testSize + ' ' + fontName + ', Arial';
        const targetWidth = context.measureText(testString).width;
        
        return targetWidth !== fallbackWidth;
    }

    setupFontEvents() {
        // Use Font Loading API if available
        if ('fonts' in document) {
            this.loadFontsWithAPI();
        } else {
            // Fallback to timeout-based loading
            this.loadFontsWithTimeout();
        }
    }

    loadFontsWithAPI() {
        const fontPromises = this.fonts.map(fontName => {
            return document.fonts.load(`16px "${fontName}"`);
        });

        Promise.all(fontPromises)
            .then(() => {
                this.onFontsLoaded();
            })
            .catch(() => {
                this.onFontsLoaded();
            });
    }

    loadFontsWithTimeout() {
        // Fallback: wait for fonts to load naturally
        setTimeout(() => {
            this.onFontsLoaded();
        }, 2000);
    }

    onFontsLoaded() {
        // Remove loading class and add loaded class
        document.body.classList.remove('thai-font-loading');
        document.body.classList.add('thai-font-loaded');
        
        // Dispatch custom event
        const event = new CustomEvent('thaiFontsLoaded', {
            detail: {
                loadedFonts: Array.from(this.loadedFonts)
            }
        });
        document.dispatchEvent(event);
        
        console.log('Thai fonts loaded:', Array.from(this.loadedFonts));
    }

    // Method to check if specific font is loaded
    isFontLoaded(fontName) {
        return this.loadedFonts.has(fontName);
    }

    // Method to get all loaded fonts
    getLoadedFonts() {
        return Array.from(this.loadedFonts);
    }
}

// Initialize font loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.thaiFontLoader = new ThaiFontLoader();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThaiFontLoader;
}
