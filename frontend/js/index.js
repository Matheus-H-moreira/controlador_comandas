function navigateTo(page) {
    window.location.href = page;
}

function formatCurrency(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function createToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#ff9800'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    
    const style = document.createElement('style');
    if (!document.querySelector('#toast-animations')) {
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

const ThemeManager = {
    STORAGE_KEY: 'sb_theme',
    currentTheme: null,
    
    init() {
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark ? 'dark' : 'light', false);
        }
        
        this.setupToggle();
        
        if (!savedTheme) {
            this.watchSystemPreference();
        }
    },
    
    setTheme(theme, save = true) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        const themeIcon = document.getElementById('themeIcon');
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeIcon && themeToggle) {
            themeToggle.classList.add('animating');
            
            setTimeout(() => {
                themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
            }, 175);
            
            setTimeout(() => {
                themeToggle.classList.remove('animating');
            }, 350);
        } else if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
        
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'false' : 'true');
            themeToggle.setAttribute('aria-label', theme === 'dark' 
                ? 'Alternar para tema claro' 
                : 'Alternar para tema escuro');
        }
        
        if (save) {
            localStorage.setItem(this.STORAGE_KEY, theme);
        }
    },
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    },
    
    setupToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
        
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = this.currentTheme === 'dark' ? '🌙' : '☀️';
        }
        themeToggle.setAttribute('aria-pressed', this.currentTheme === 'dark' ? 'false' : 'true');
        themeToggle.setAttribute('aria-label', this.currentTheme === 'dark' 
            ? 'Alternar para tema claro' 
            : 'Alternar para tema escuro');
    },
    
    watchSystemPreference() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e) => {
            if (!localStorage.getItem(this.STORAGE_KEY)) {
                this.setTheme(e.matches ? 'dark' : 'light', false);
            }
        };
        
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
        } else {
            mediaQuery.addListener(handleChange);
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
    ThemeManager.init();
}