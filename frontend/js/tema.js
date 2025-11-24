const ThemeManager = {
    STORAGE_KEY: 'sb_theme',
    currentTheme: null,
    init() {
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        if (savedTheme) {
            this.setTheme(savedTheme, false);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark ? 'dark' : 'light', false);
        }
        this.setupToggle();
        if (!savedTheme) this.watchSystemPreference();
    },
    setTheme(theme, save = true) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        const themeIcon = document.getElementById('themeIcon');
        const themeToggle = document.getElementById('themeToggle');
        if (themeIcon) {
            if (themeToggle) themeToggle.classList.add('animating');
            setTimeout(() => themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️', 175);
            if (themeToggle) setTimeout(() => themeToggle.classList.remove('animating'), 350);
        }
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'false' : 'true');
            themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Alternar para tema claro' : 'Alternar para tema escuro');
        }
        if (save) localStorage.setItem(this.STORAGE_KEY, theme);
    },
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    },
    setupToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        themeToggle.addEventListener('click', () => this.toggleTheme());
        themeToggle.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) themeIcon.textContent = this.currentTheme === 'dark' ? '🌙' : '☀️';
        themeToggle.setAttribute('aria-pressed', this.currentTheme === 'dark' ? 'false' : 'true');
        themeToggle.setAttribute('aria-label', this.currentTheme === 'dark' ? 'Alternar para tema claro' : 'Alternar para tema escuro');
    },
    watchSystemPreference() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = e => {
            if (!localStorage.getItem(this.STORAGE_KEY)) this.setTheme(e.matches ? 'dark' : 'light', false);
        };
        if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', handleChange);
        else mediaQuery.addListener(handleChange);
    }
};

document.addEventListener('DOMContentLoaded', () => ThemeManager.init());