// 自定义布局拖拽功能
class DragLayoutManager {
    constructor() {
        this.draggedElement = null;
        this.dragOverElement = null;
        this.dropZones = [];
        this.layoutConfig = this.loadLayoutConfig();
        this.isEditMode = false;
        this.init();
    }

    init() {
        this.setupDragDrop();
        this.setupLayoutControls();
        this.setupLayoutToggle();
        this.applyLayoutConfig();
    }

    setupDragDrop() {
        // 为所有可拖拽的卡片添加拖拽功能
        const draggableCards = document.querySelectorAll('.tech-card[draggable="true"]');
        
        draggableCards.forEach(card => {
            this.makeDraggable(card);
        });

        // 设置拖拽区域
        this.setupDropZones();
    }

    makeDraggable(element) {
        element.draggable = true;
        
        element.addEventListener('dragstart', (e) => {
            if (!this.isEditMode) return;
            
            this.draggedElement = element;
            element.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', element.outerHTML);
            
            // 创建拖拽预览
            const dragImage = element.cloneNode(true);
            dragImage.style.transform = 'rotate(5deg)';
            dragImage.style.opacity = '0.8';
            document.body.appendChild(dragImage);
            e.dataTransfer.setDragImage(dragImage, 0, 0);
            
            setTimeout(() => {
                document.body.removeChild(dragImage);
            }, 0);
        });

        element.addEventListener('dragend', (e) => {
            element.classList.remove('dragging');
            this.draggedElement = null;
            this.clearDropZones();
        });
    }

    setupDropZones() {
        const panels = document.querySelectorAll('.left-panel, .center-panel, .right-panel');
        
        panels.forEach(panel => {
            panel.addEventListener('dragover', (e) => {
                if (!this.isEditMode) return;
                
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                
                this.dragOverElement = panel;
                panel.classList.add('drag-over');
            });

            panel.addEventListener('dragleave', (e) => {
                if (!this.isEditMode) return;
                
                if (!panel.contains(e.relatedTarget)) {
                    panel.classList.remove('drag-over');
                    this.dragOverElement = null;
                }
            });

            panel.addEventListener('drop', (e) => {
                if (!this.isEditMode) return;
                
                e.preventDefault();
                panel.classList.remove('drag-over');
                
                if (this.draggedElement && this.draggedElement !== panel) {
                    this.moveCard(this.draggedElement, panel);
                }
            });
        });
    }

    moveCard(card, targetPanel) {
        // 移除原位置的卡片
        const originalPanel = card.closest('.left-panel, .center-panel, .right-panel');
        if (originalPanel) {
            originalPanel.removeChild(card);
        }

        // 添加到新位置
        targetPanel.appendChild(card);
        
        // 重新设置拖拽功能
        this.makeDraggable(card);
        
        // 保存布局配置
        this.saveLayoutConfig();
        
        // 显示成功提示
        this.showNotification('模块位置已更新', 'success');
    }

    setupLayoutControls() {
        // 创建布局控制面板
        const controlPanel = this.createControlPanel();
        document.body.appendChild(controlPanel);
    }

    setupLayoutToggle() {
        const toggleBtn = document.getElementById('layout-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const controlPanel = document.querySelector('.layout-control-panel');
                if (controlPanel) {
                    controlPanel.classList.toggle('show');
                }
            });
        }
    }

    createControlPanel() {
        const panel = document.createElement('div');
        panel.className = 'layout-control-panel';
        panel.innerHTML = `
            <div class="control-header">
                <h3><i class="fas fa-th-large"></i> 布局设置</h3>
                <button class="close-btn" onclick="this.parentElement.parentElement.style.display='none'">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="control-content">
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="edit-mode-toggle">
                        编辑模式
                    </label>
                </div>
                <div class="control-group">
                    <button class="control-btn" onclick="window.dragLayoutManager.resetLayout()">
                        <i class="fas fa-undo"></i> 重置布局
                    </button>
                    <button class="control-btn" onclick="window.dragLayoutManager.saveCurrentLayout()">
                        <i class="fas fa-save"></i> 保存布局
                    </button>
                </div>
                <div class="control-group">
                    <button class="control-btn" onclick="window.dragLayoutManager.exportLayout()">
                        <i class="fas fa-download"></i> 导出配置
                    </button>
                    <button class="control-btn" onclick="window.dragLayoutManager.importLayout()">
                        <i class="fas fa-upload"></i> 导入配置
                    </button>
                </div>
            </div>
        `;

        // 绑定编辑模式切换
        const editToggle = panel.querySelector('#edit-mode-toggle');
        editToggle.addEventListener('change', (e) => {
            this.toggleEditMode(e.target.checked);
        });

        return panel;
    }

    toggleEditMode(enabled) {
        this.isEditMode = enabled;
        
        const cards = document.querySelectorAll('.tech-card');
        cards.forEach(card => {
            if (enabled) {
                card.draggable = true;
                card.classList.add('editable');
                this.makeDraggable(card);
            } else {
                card.draggable = false;
                card.classList.remove('editable', 'dragging');
            }
        });

        const panels = document.querySelectorAll('.left-panel, .center-panel, .right-panel');
        panels.forEach(panel => {
            if (enabled) {
                panel.classList.add('edit-mode');
            } else {
                panel.classList.remove('edit-mode', 'drag-over');
            }
        });

        this.showNotification(enabled ? '编辑模式已开启' : '编辑模式已关闭', 'info');
    }

    saveLayoutConfig() {
        const layout = {
            leftPanel: [],
            centerPanel: [],
            rightPanel: []
        };

        // 收集各面板中的卡片顺序
        const leftPanel = document.querySelector('.left-panel');
        const centerPanel = document.querySelector('.center-panel');
        const rightPanel = document.querySelector('.right-panel');

        if (leftPanel) {
            Array.from(leftPanel.children).forEach(card => {
                if (card.classList.contains('tech-card')) {
                    layout.leftPanel.push(card.className);
                }
            });
        }

        if (centerPanel) {
            Array.from(centerPanel.children).forEach(card => {
                if (card.classList.contains('tech-card')) {
                    layout.centerPanel.push(card.className);
                }
            });
        }

        if (rightPanel) {
            Array.from(rightPanel.children).forEach(card => {
                if (card.classList.contains('tech-card')) {
                    layout.rightPanel.push(card.className);
                }
            });
        }

        localStorage.setItem('dashboardLayout', JSON.stringify(layout));
    }

    loadLayoutConfig() {
        const saved = localStorage.getItem('dashboardLayout');
        return saved ? JSON.parse(saved) : null;
    }

    applyLayoutConfig() {
        if (!this.layoutConfig) return;

        const leftPanel = document.querySelector('.left-panel');
        const centerPanel = document.querySelector('.center-panel');
        const rightPanel = document.querySelector('.right-panel');

        // 应用左侧面板布局
        if (leftPanel && this.layoutConfig.leftPanel) {
            this.reorderCards(leftPanel, this.layoutConfig.leftPanel);
        }

        // 应用中央面板布局
        if (centerPanel && this.layoutConfig.centerPanel) {
            this.reorderCards(centerPanel, this.layoutConfig.centerPanel);
        }

        // 应用右侧面板布局
        if (rightPanel && this.layoutConfig.rightPanel) {
            this.reorderCards(rightPanel, this.layoutConfig.rightPanel);
        }
    }

    reorderCards(panel, cardClasses) {
        const cards = Array.from(panel.querySelectorAll('.tech-card'));
        const cardMap = new Map();
        
        cards.forEach(card => {
            cardMap.set(card.className, card);
        });

        // 清空面板
        cards.forEach(card => panel.removeChild(card));

        // 按配置顺序重新添加
        cardClasses.forEach(className => {
            const card = cardMap.get(className);
            if (card) {
                panel.appendChild(card);
            }
        });
    }

    resetLayout() {
        localStorage.removeItem('dashboardLayout');
        location.reload();
    }

    saveCurrentLayout() {
        this.saveLayoutConfig();
        this.showNotification('布局已保存', 'success');
    }

    exportLayout() {
        const layout = this.layoutConfig || this.getCurrentLayout();
        const dataStr = JSON.stringify(layout, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'dashboard-layout.json';
        link.click();
        
        this.showNotification('布局配置已导出', 'success');
    }

    importLayout() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const layout = JSON.parse(e.target.result);
                        localStorage.setItem('dashboardLayout', JSON.stringify(layout));
                        location.reload();
                    } catch (error) {
                        console.error('配置文件解析错误:', error);
                        this.showNotification('配置文件格式错误', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }

    getCurrentLayout() {
        const layout = {
            leftPanel: [],
            centerPanel: [],
            rightPanel: []
        };

        const leftPanel = document.querySelector('.left-panel');
        const centerPanel = document.querySelector('.center-panel');
        const rightPanel = document.querySelector('.right-panel');

        if (leftPanel) {
            Array.from(leftPanel.children).forEach(card => {
                if (card.classList.contains('tech-card')) {
                    layout.leftPanel.push(card.className);
                }
            });
        }

        if (centerPanel) {
            Array.from(centerPanel.children).forEach(card => {
                if (card.classList.contains('tech-card')) {
                    layout.centerPanel.push(card.className);
                }
            });
        }

        if (rightPanel) {
            Array.from(rightPanel.children).forEach(card => {
                if (card.classList.contains('tech-card')) {
                    layout.rightPanel.push(card.className);
                }
            });
        }

        return layout;
    }

    clearDropZones() {
        const panels = document.querySelectorAll('.left-panel, .center-panel, .right-panel');
        panels.forEach(panel => {
            panel.classList.remove('drag-over');
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        let iconClass = 'info-circle';
        if (type === 'success') {
            iconClass = 'check-circle';
        } else if (type === 'error') {
            iconClass = 'exclamation-circle';
        }
        
        notification.innerHTML = `
            <i class="fas fa-${iconClass}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// 初始化拖拽布局管理器
document.addEventListener('DOMContentLoaded', () => {
    window.dragLayoutManager = new DragLayoutManager();
});
