/* 科技风格医院数据看板交互脚本 */

// 性能优化工具函数
function debounce(func, wait) {
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

function throttle(func, limit) {
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

// DOM元素缓存
const elementCache = new Map();

function getCachedElement(selector) {
  if (elementCache.has(selector)) {
    return elementCache.get(selector);
  }
  
  const element = document.querySelector(selector);
  if (element) {
    elementCache.set(selector, element);
  }
  return element;
}

// 图表管理器
class ChartManager {
  constructor() {
    this.charts = new Map();
    this.init();
  }

  init() {
    // 检查ECharts是否加载
    if (typeof echarts === 'undefined') {
      console.warn('ECharts library not loaded, charts will not be initialized');
      return;
    }

    // 延迟初始化，确保DOM完全加载
    setTimeout(() => {
      this.initCharts();
      this.startDataUpdates();
    }, 500);
  }

  initCharts() {
    // 初始化患者流量图表
        this.initPatientFlowChart();
    // 初始化系统负载图表
        this.initSystemLoadChart();
    // 初始化环境监控图表
        this.initEnvironmentCharts();
    }

    initPatientFlowChart() {
    const container = getCachedElement('#patient-flow-chart');
    if (!container) return;

    // 创建图表容器
    const chartContainer = document.createElement('div');
    chartContainer.style.width = '100%';
    chartContainer.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(chartContainer);

    const chart = echarts.init(chartContainer, null, {
      renderer: 'canvas',
      useDirtyRect: true
    });

        const option = {
            backgroundColor: 'transparent',
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
        top: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
        data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
        axisLine: {
          lineStyle: { color: '#00d4ff' }
        },
        axisLabel: {
          color: '#b8c5d1',
          fontSize: 10
        }
            },
            yAxis: {
                type: 'value',
        axisLine: {
          lineStyle: { color: '#00d4ff' }
        },
        axisLabel: {
          color: '#b8c5d1',
          fontSize: 10
        },
        splitLine: {
          lineStyle: { color: 'rgba(0, 212, 255, 0.1)' }
        }
            },
            series: [{
        data: [120, 200, 150, 80, 70, 110, 90],
                type: 'line',
                smooth: true,
        lineStyle: {
          color: '#00d4ff',
          width: 3
        },
        itemStyle: {
          color: '#00d4ff'
        },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
              { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
                            { offset: 1, color: 'rgba(0, 212, 255, 0.05)' }
                        ]
                    }
        }
            }]
        };

        chart.setOption(option);
    this.charts.set('patientFlow', chart);
    }

    initSystemLoadChart() {
    const container = getCachedElement('#system-load-chart');
    if (!container) return;
    const chartContainer = document.createElement('div');
    chartContainer.style.width = '100%';
    chartContainer.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(chartContainer);

    const chart = echarts.init(chartContainer, null, {
      renderer: 'canvas',
      useDirtyRect: true
    });

        const option = {
            backgroundColor: 'transparent',
            series: [{
                type: 'gauge',
        startAngle: 200,
        endAngle: -20,
                radius: '80%',
                min: 0,
                max: 100,
                splitNumber: 10,
        itemStyle: {
          color: '#6c5ce7'
        },
        progress: {
          show: true,
          width: 8
        },
        pointer: {
          show: false
        },
                axisLine: {
                    lineStyle: {
                        width: 8,
                        color: [
                            [0.3, '#ff4757'],
                            [0.7, '#ffaa00'],
                            [1, '#00ff88']
                        ]
                    }
                },
                axisTick: {
          distance: -30,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: '#6c5ce7'
          }
                },
                splitLine: {
          distance: -30,
          length: 30,
          lineStyle: {
            width: 4,
            color: '#6c5ce7'
          }
                },
                axisLabel: {
          distance: -20,
                    color: '#b8c5d1',
          fontSize: 10
                },
                detail: {
                    valueAnimation: true,
                    formatter: '{value}%',
          color: '#6c5ce7',
          fontSize: 16
                },
        data: [{
          value: 75
        }]
            }]
        };

        chart.setOption(option);
    this.charts.set('systemLoad', chart);
    }

    initEnvironmentCharts() {
    // 为环境监控项添加小图表
    const envItems = document.querySelectorAll('.env-chart');
    
    if (envItems.length === 0) {
      console.warn('No environment chart containers found');
      return;
    }

    envItems.forEach((item, index) => {
      try {
        // 清空容器并创建新的图表容器
        item.innerHTML = '';
        
        const chartContainer = document.createElement('div');
        chartContainer.style.width = '100%';
        chartContainer.style.height = '100%';
        chartContainer.style.minHeight = '40px';
        item.appendChild(chartContainer);

        // 等待DOM更新
        setTimeout(() => {
          const chart = echarts.init(chartContainer, null, {
            renderer: 'canvas',
            useDirtyRect: true
          });

          // 根据索引创建不同类型的图表
          let option;
          switch(index) {
            case 0: // 温度
              option = this.createTemperatureChart();
              break;
            case 1: // 湿度
              option = this.createHumidityChart();
              break;
            case 2: // 空气质量
              option = this.createAirQualityChart();
              break;
            case 3: // 功耗
              option = this.createPowerChart();
              break;
            default:
              option = this.createDefaultChart();
          }

          chart.setOption(option);
          this.charts.set(`env_${index}`, chart);
          
          // 监听容器大小变化
          const resizeObserver = new ResizeObserver(() => {
            chart.resize();
          });
          resizeObserver.observe(chartContainer);
          
        }, 100);
        
      } catch (error) {
        console.error(`Failed to initialize environment chart ${index}:`, error);
      }
    });
  }

  createTemperatureChart() {
    return {
      backgroundColor: 'transparent',
            series: [{
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        radius: '90%',
        min: 0,
        max: 50,
        splitNumber: 5,
        itemStyle: {
          color: '#ff4757'
        },
        progress: {
          show: true,
          width: 6,
          itemStyle: {
                    color: {
                        type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
                        colorStops: [
                { offset: 0, color: '#00d4ff' },
                { offset: 0.5, color: '#ffaa00' },
                { offset: 1, color: '#ff4757' }
              ]
            }
          }
        },
        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.3, '#00d4ff'],
              [0.7, '#ffaa00'],
              [1, '#ff4757']
            ]
          }
        },
        axisTick: {
          distance: -15,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: '#ff4757'
          }
        },
        splitLine: {
          distance: -15,
          length: 15,
          lineStyle: {
            width: 3,
            color: '#ff4757'
          }
        },
        axisLabel: {
          distance: -8,
          color: '#b8c5d1',
          fontSize: 8
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}°C',
          color: '#ff4757',
          fontSize: 12,
          fontWeight: 'bold'
        },
        data: [{
          value: 22.5
        }]
      }]
    };
  }

  createHumidityChart() {
    return {
      backgroundColor: 'transparent',
      series: [{
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        radius: '90%',
        min: 0,
        max: 100,
        splitNumber: 5,
        itemStyle: {
          color: '#00d4ff'
        },
        progress: {
          show: true,
          width: 6,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: '#ff4757' },
                { offset: 0.5, color: '#ffaa00' },
                { offset: 1, color: '#00d4ff' }
              ]
            }
          }
        },
        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.3, '#ff4757'],
              [0.7, '#ffaa00'],
              [1, '#00d4ff']
            ]
          }
        },
        axisTick: {
          distance: -15,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: '#00d4ff'
          }
        },
        splitLine: {
          distance: -15,
          length: 15,
          lineStyle: {
            width: 3,
            color: '#00d4ff'
          }
        },
        axisLabel: {
          distance: -8,
          color: '#b8c5d1',
          fontSize: 8
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: '#00d4ff',
          fontSize: 12,
          fontWeight: 'bold'
        },
        data: [{
          value: 45
        }]
      }]
    };
  }

  createAirQualityChart() {
    return {
      backgroundColor: 'transparent',
      series: [{
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        radius: '90%',
        min: 0,
        max: 500,
        splitNumber: 5,
        itemStyle: {
          color: '#00ff88'
        },
        progress: {
          show: true,
          width: 6,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: '#00ff88' },
                { offset: 0.4, color: '#ffaa00' },
                { offset: 0.6, color: '#ff4757' },
                { offset: 1, color: '#6c5ce7' }
              ]
            }
          }
        },
        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.2, '#00ff88'],
              [0.4, '#ffaa00'],
              [0.6, '#ff4757'],
              [1, '#6c5ce7']
            ]
          }
        },
        axisTick: {
          distance: -15,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: '#00ff88'
          }
        },
        splitLine: {
          distance: -15,
          length: 15,
          lineStyle: {
            width: 3,
            color: '#00ff88'
          }
        },
        axisLabel: {
          distance: -8,
          color: '#b8c5d1',
          fontSize: 8
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
          color: '#00ff88',
          fontSize: 12,
          fontWeight: 'bold'
        },
        data: [{
          value: 45
        }]
      }]
    };
  }

  createPowerChart() {
    return {
      backgroundColor: 'transparent',
      series: [{
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        radius: '90%',
        min: 0,
        max: 100,
        splitNumber: 5,
        itemStyle: {
          color: '#6c5ce7'
        },
        progress: {
          show: true,
          width: 6,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: '#00ff88' },
                { offset: 0.5, color: '#ffaa00' },
                { offset: 1, color: '#6c5ce7' }
              ]
            }
          }
        },
        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.3, '#00ff88'],
              [0.7, '#ffaa00'],
              [1, '#6c5ce7']
            ]
          }
        },
        axisTick: {
          distance: -15,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: '#6c5ce7'
          }
        },
        splitLine: {
          distance: -15,
          length: 15,
          lineStyle: {
            width: 3,
            color: '#6c5ce7'
          }
        },
        axisLabel: {
          distance: -8,
          color: '#b8c5d1',
          fontSize: 8
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}kW',
          color: '#6c5ce7',
          fontSize: 12,
          fontWeight: 'bold'
        },
        data: [{
          value: 45.6
        }]
      }]
    };
  }

  createDefaultChart() {
    return {
      backgroundColor: 'transparent',
      series: [{
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        radius: '90%',
        min: 0,
        max: 100,
        splitNumber: 5,
        itemStyle: {
          color: '#00d4ff'
        },
        progress: {
          show: true,
          width: 6,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: '#ff4757' },
                { offset: 0.5, color: '#ffaa00' },
                { offset: 1, color: '#00d4ff' }
              ]
            }
          }
        },
        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.3, '#ff4757'],
              [0.7, '#ffaa00'],
              [1, '#00d4ff']
            ]
          }
        },
        axisTick: {
          distance: -15,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: '#00d4ff'
          }
        },
        splitLine: {
          distance: -15,
          length: 15,
          lineStyle: {
            width: 3,
            color: '#00d4ff'
          }
        },
        axisLabel: {
          distance: -8,
          color: '#b8c5d1',
          fontSize: 8
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: '#00d4ff',
          fontSize: 12,
          fontWeight: 'bold'
        },
        data: [{
          value: 75
        }]
      }]
    };
  }

  startDataUpdates() {
    setInterval(() => {
      this.updateCharts();
    }, 5000);
  }

  updateCharts() {
    try {
      // 更新患者流量图表数据
      const patientFlowChart = this.charts.get('patientFlow');
      if (patientFlowChart) {
        const newData = Array.from({length: 7}, () => Math.floor(Math.random() * 200) + 50);
        patientFlowChart.setOption({
          series: [{
            data: newData
          }]
            });
        }

        // 更新系统负载图表
      const systemLoadChart = this.charts.get('systemLoad');
      if (systemLoadChart) {
        const newValue = Math.floor(Math.random() * 40) + 60; // 60-100%
        systemLoadChart.setOption({
          series: [{
            data: [{
              value: newValue
            }]
          }]
        });
      }

      // 更新环境监控图表
      this.charts.forEach((chart, key) => {
        if (key.startsWith('env_')) {
          try {
            const index = parseInt(key.split('_')[1]);
                let newValue;
                
            // 根据图表类型生成不同的数据范围
            switch(index) {
              case 0: // 温度
                newValue = (Math.random() * 15 + 15).toFixed(1); // 15-30°C
                break;
              case 1: // 湿度
                newValue = Math.floor(Math.random() * 40 + 30); // 30-70%
                break;
              case 2: // 空气质量
                newValue = Math.floor(Math.random() * 100 + 20); // 20-120
                break;
              case 3: // 功耗
                newValue = (Math.random() * 20 + 30).toFixed(1); // 30-50kW
                        break;
              default:
                newValue = Math.floor(Math.random() * 100);
            }
            
            chart.setOption({
              series: [{
                data: [{
                  value: parseFloat(newValue)
                }]
              }]
            });
          } catch (error) {
            console.error(`Failed to update chart ${key}:`, error);
          }
        }
      });
    } catch (error) {
      console.error('Failed to update charts:', error);
    }
  }

  resize() {
    this.charts.forEach(chart => {
      if (chart && typeof chart.resize === 'function') {
        chart.resize();
            }
        });
    }

  dispose() {
    this.charts.forEach(chart => {
      if (chart && typeof chart.dispose === 'function') {
        chart.dispose();
      }
    });
    this.charts.clear();
  }
}

// 时间管理器
class TimeManager {
  constructor() {
    this.init();
  }

  init() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-CN', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const dateStr = now.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'long'
    });

    const timeElement = getCachedElement('#current-time');
    const dateElement = getCachedElement('#current-date');
    const lastUpdateElement = getCachedElement('#last-update-time');
    
    if (timeElement) timeElement.textContent = timeStr;
    if (dateElement) dateElement.textContent = dateStr;
    if (lastUpdateElement) lastUpdateElement.textContent = timeStr;
  }
}


// 数据更新管理器
class DataManager {
  constructor() {
    this.init();
  }

  init() {
    this.updateData();
    setInterval(() => this.updateData(), 10000);
  }

  updateData() {
    this.updateMetrics();
    this.updateAlerts();
  }

  updateMetrics() {
    // 更新主要指标
    const metrics = [
      { selector: '.main-metric-value', values: ['¥2,456,789', '2,156', '78%', '45.6kW'] },
    ];

    metrics.forEach(metric => {
      const elements = document.querySelectorAll(metric.selector);
      elements.forEach((element, index) => {
        if (metric.values[index]) {
          element.textContent = metric.values[index];
        }
            });
        });
    }

  updateAlerts() {
    // 更新告警计数
    const alertCount = document.querySelector('.alert-count');
    if (alertCount) {
      const count = Math.floor(Math.random() * 5) + 1;
      alertCount.textContent = count;
    }
  }
}

// 响应式管理器
class ResponsiveManager {
  constructor() {
    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', throttle(() => this.handleResize(), 100));
  }

  handleResize() {
    // 重新调整图表尺寸
    if (window.chartManager) {
      window.chartManager.resize();
    }
  }
}

// 初始化函数
function init() {
  try {
    console.log('科技风格医院数据看板初始化开始...');
    
    // 创建管理器实例
    window.chartManager = new ChartManager();
    window.timeManager = new TimeManager();
    window.themeManager = new ThemeManager();
    window.dataManager = new DataManager();
    window.responsiveManager = new ResponsiveManager();
    
    // 设置事件监听器
    setupEventListeners();
    
    console.log('科技风格医院数据看板初始化完成');
  } catch (error) {
    console.error('初始化失败:', error);
  }
}

// 主题管理器
class ThemeManager {
  constructor() {
    this.currentTheme = 'dark';
    this.init();
  }

  init() {
    this.setupThemeToggle();
    this.loadSavedTheme();
  }

  setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    document.body.className = this.currentTheme;
    
    const themeIcon = document.querySelector('#theme-toggle i');
    if (themeIcon) {
      themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // 保存主题设置
    localStorage.setItem('theme', this.currentTheme);
  }

  loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
      document.body.className = this.currentTheme;
      
      const themeIcon = document.querySelector('#theme-toggle i');
      if (themeIcon) {
        themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
      }
    }
  }
}

// 设置事件监听器
function setupEventListeners() {
  // 图表控制按钮
  const chartBtns = document.querySelectorAll('.chart-btn');
  chartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // 移除其他按钮的active类
      chartBtns.forEach(b => b.classList.remove('active'));
      // 添加当前按钮的active类
      e.target.classList.add('active');
    });
  });

  // 时间选择按钮
  const timeBtns = document.querySelectorAll('.time-btn');
  timeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // 移除其他按钮的active类
      timeBtns.forEach(b => b.classList.remove('active'));
      // 添加当前按钮的active类
      e.target.classList.add('active');
    });
  });

  // 告警关闭按钮
  const alertBtns = document.querySelectorAll('.alert-btn');
  alertBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const alertItem = e.target.closest('.alert-item');
      if (alertItem) {
        alertItem.style.opacity = '0';
        setTimeout(() => {
          alertItem.remove();
        }, 300);
      }
    });
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  init();
  // 初始化主题管理器
  window.themeManager = new ThemeManager();
    });
    
    // 页面卸载时清理资源
    window.addEventListener('beforeunload', () => {
  if (window.chartManager) {
    window.chartManager.dispose();
  }
});