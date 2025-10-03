/**
 * 主题存储清理工具
 * 用于清理可能存在的主题存储冲突
 */

class ThemeStorageCleaner {
    constructor() {
        this.themeKeys = {
            'index-theme': 'index.html - 主页主题',
            'tech-theme': 'tech-dashboard.html - 科技风格仪表板主题',
            'dashboard-theme-mode': 'classic-dashboard.html - 经典仪表板主题',
            'morandi-theme': 'morandi-dashboard.html - 莫兰迪风格仪表板主题'
        };
        
        // 旧的冲突键名
        this.conflictKeys = ['theme'];
    }

    /**
     * 清理冲突的主题存储
     */
    cleanConflictStorage() {
        console.log('🧹 开始清理主题存储冲突...');
        
        // 检查并清理冲突的键名
        this.conflictKeys.forEach(key => {
            if (localStorage.getItem(key)) {
                console.warn(`⚠️ 发现冲突的主题存储键: ${key}`);
                localStorage.removeItem(key);
                console.log(`✅ 已清理冲突键: ${key}`);
            }
        });

        // 显示当前所有主题存储
        this.showCurrentThemeStorage();
    }

    /**
     * 显示当前所有主题存储
     */
    showCurrentThemeStorage() {
        console.log('📊 当前主题存储状态:');
        
        Object.keys(this.themeKeys).forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                console.log(`✅ ${key}: ${value} (${this.themeKeys[key]})`);
            } else {
                console.log(`⚪ ${key}: 未设置 (${this.themeKeys[key]})`);
            }
        });
    }

    /**
     * 重置所有主题存储
     */
    resetAllThemes() {
        console.log('🔄 重置所有主题存储...');
        
        Object.keys(this.themeKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        
        this.conflictKeys.forEach(key => {
            localStorage.removeItem(key);
        });
        
        console.log('✅ 所有主题存储已重置');
    }

    /**
     * 设置默认主题
     */
    setDefaultThemes() {
        console.log('🎨 设置默认主题...');
        
        // 为每个页面设置默认的浅色主题
        Object.keys(this.themeKeys).forEach(key => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, 'light');
                console.log(`✅ 设置默认主题: ${key} = light`);
            }
        });
    }

    /**
     * 检查存储冲突
     */
    checkConflicts() {
        console.log('🔍 检查主题存储冲突...');
        
        let hasConflicts = false;
        
        // 检查冲突键名
        this.conflictKeys.forEach(key => {
            if (localStorage.getItem(key)) {
                console.error(`❌ 发现冲突键: ${key}`);
                hasConflicts = true;
            }
        });

        // 检查重复值
        const values = {};
        Object.keys(this.themeKeys).forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                if (!values[value]) {
                    values[value] = [];
                }
                values[value].push(key);
            }
        });

        Object.keys(values).forEach(value => {
            if (values[value].length > 1) {
                console.warn(`⚠️ 多个键使用相同值 "${value}": ${values[value].join(', ')}`);
            }
        });

        if (!hasConflicts) {
            console.log('✅ 未发现主题存储冲突');
        }

        return !hasConflicts;
    }
}

// 导出清理工具
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeStorageCleaner;
} else {
    window.ThemeStorageCleaner = ThemeStorageCleaner;
}

// 自动检查和清理（仅在开发环境）
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', function() {
        const cleaner = new ThemeStorageCleaner();
        
        // 检查冲突
        if (!cleaner.checkConflicts()) {
            // 如果有冲突，自动清理
            cleaner.cleanConflictStorage();
        }
        
        // 显示当前状态
        cleaner.showCurrentThemeStorage();
    });
}
