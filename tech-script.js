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
      this.initProgressBars();
    }, 500);
  }

  initCharts() {
    // 初始化环境监控图表
        this.initEnvironmentCharts();
    // 初始化核心指标图表
        this.initCoreMetricsCharts();
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

  initCoreMetricsCharts() {
    // 初始化今日收入图表
    this.initRevenueChart();
    // 初始化患者流量图表
    this.initPatientsChart();
    // 初始化设备使用率图表
    this.initEquipmentChart();
    // 初始化能耗监控图表
    this.initEnergyChart();
    // 初始化运营效率图表
    this.initEfficiencyChart();
    // 初始化患者满意度图表
    this.initSatisfactionChart();
  }

  initRevenueChart() {
    const container = getCachedElement('#revenue-chart');
    if (!container) return;

    // 清空容器并创建新的图表容器
    container.innerHTML = '';
    
    const chartContainer = document.createElement('div');
    chartContainer.style.width = '100%';
    chartContainer.style.height = '100%';
    container.appendChild(chartContainer);

    const chart = echarts.init(chartContainer, null, {
      renderer: 'canvas',
      useDirtyRect: true
    });

        const option = {
            backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#00d4ff',
        borderWidth: 1,
        textStyle: {
          color: '#ffffff',
          fontSize: 10
        },
        formatter: function(params) {
          const value = params[0].value;
          const formattedValue = (value / 10000).toFixed(1) + '万';
          return `时间: ${params[0].axisValue}<br/>收入: ¥${formattedValue}`;
        }
      },
      legend: {
        show: false
      },
            grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        top: '5%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
        data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        axisLine: {
          lineStyle: { color: '#00d4ff' }
        },
        axisLabel: {
          color: '#b8c5d1',
          fontSize: 8
        },
        axisTick: {
          lineStyle: { color: '#00d4ff' }
        }
            },
            yAxis: {
                type: 'value',
        axisLine: {
          lineStyle: { color: '#00d4ff' }
        },
        axisLabel: {
          color: '#b8c5d1',
          fontSize: 8,
          formatter: function(value) {
            return (value / 10000).toFixed(0) + '万';
          }
        },
        splitLine: {
          lineStyle: { color: 'rgba(0, 212, 255, 0.1)' }
        }
            },
            series: [{
        name: '今日收入',
        data: [1200000, 1800000, 1500000, 2200000, 2000000, 2456789],
                type: 'line',
                smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          color: '#00d4ff',
          width: 2
        },
        itemStyle: {
          color: '#00d4ff',
          borderColor: '#ffffff',
          borderWidth: 1
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
    this.charts.set('revenue', chart);
    }

  initPatientsChart() {
    const container = getCachedElement('#patients-chart');
    if (!container) return;

    container.innerHTML = '';
    
    const chartContainer = document.createElement('div');
    chartContainer.style.width = '100%';
    chartContainer.style.height = '100%';
    container.appendChild(chartContainer);

    const chart = echarts.init(chartContainer, null, {
      renderer: 'canvas',
      useDirtyRect: true
    });

        const option = {
            backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#00ff88',
        borderWidth: 1,
        textStyle: {
          color: '#ffffff',
          fontSize: 10
        },
        formatter: function(params) {
          const value = params[0].value;
          return `时间: ${params[0].axisValue}<br/>患者流量: ${value}人`;
        }
      },
      legend: {
          show: false
        },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        top: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                axisLine: {
          lineStyle: { color: '#00ff88' }
        },
        axisLabel: {
          color: '#b8c5d1',
          fontSize: 8
        },
        axisTick: {
          lineStyle: { color: '#00ff88' }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: { color: '#00ff88' }
        },
        axisLabel: {
          color: '#b8c5d1',
          fontSize: 8,
          formatter: function(value) {
            return value + '人';
          }
        },
        splitLine: {
          lineStyle: { color: 'rgba(0, 255, 136, 0.1)' }
        }
      },
      series: [{
        name: '患者流量',
        data: [800, 1200, 1800, 2000, 1900, 2156],
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
                    lineStyle: {
          color: '#00ff88',
          width: 2
        },
        itemStyle: {
          color: '#00ff88',
          borderColor: '#ffffff',
          borderWidth: 1
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 255, 136, 0.3)' },
              { offset: 1, color: 'rgba(0, 255, 136, 0.05)' }
            ]
          }
        }
      }]
    };

    chart.setOption(option);
    this.charts.set('patients', chart);
  }

  initEquipmentChart() {
    const container = getCachedElement('#equipment-chart');
    if (!container) return;

    container.innerHTML = '';
    
    const chartContainer = document.createElement('div');
    chartContainer.style.width = '100%';
    chartContainer.style.height = '100%';
    container.appendChild(chartContainer);

    const chart = echarts.init(chartContainer, null, {
      renderer: 'canvas',
      useDirtyRect: true
    });

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#ffaa00',
        borderWidth: 1,
        textStyle: {
          color: '#ffffff',
          fontSize: 10
        },
        formatter: function(params) {
          const value = params[0].value;
          return `时间: ${params[0].axisValue}<br/>设备使用率: ${value}%`;
        }
      },
      legend: {
        show: false
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        top: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        axisLine: {
          lineStyle: { color: '#ffaa00' }
        },
        axisLabel: {
          color: '#b8c5d1',
          fontSize: 8
                },
                axisTick: {
          lineStyle: { color: '#ffaa00' }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: { color: '#ffaa00' }
        },
        axisLabel: {
          color: '#b8c5d1',
          fontSize: 8,
          formatter: function(value) {
            return value + '%';
          }
                },
                splitLine: {
          lineStyle: { color: 'rgba(255, 170, 0, 0.1)' }
        }
      },
      series: [{
        name: '设备使用率',
        data: [65, 70, 75, 80, 78, 78],
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
          lineStyle: {
          color: '#ffaa00',
          width: 2
        },
        itemStyle: {
          color: '#ffaa00',
          borderColor: '#ffffff',
          borderWidth: 1
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 170, 0, 0.3)' },
              { offset: 1, color: 'rgba(255, 170, 0, 0.05)' }
            ]
          }
        }
      }]
    };

    chart.setOption(option);
    this.charts.set('equipment', chart);
  }

  initEnergyChart() {
    const container = getCachedElement('#energy-chart');
    if (!container) return;

    container.innerHTML = '';
    
    const chartContainer = document.createElement('div');
    chartContainer.style.width = '100%';
    chartContainer.style.height = '100%';
    container.appendChild(chartContainer);

    const chart = echarts.init(chartContainer, null, {
      renderer: 'canvas',
      useDirtyRect: true
    });

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#6c5ce7',
        borderWidth: 1,
        textStyle: {
          color: '#ffffff',
          fontSize: 10
        },
        formatter: function(params) {
          const value = params[0].value;
          return `时间: ${params[0].axisValue}<br/>能耗: ${value}kW`;
        }
      },
      legend: {
        show: false
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        top: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        axisLine: {
          lineStyle: { color: '#6c5ce7' }
                },
                axisLabel: {
                    color: '#b8c5d1',
          fontSize: 8
        },
        axisTick: {
          lineStyle: { color: '#6c5ce7' }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: { color: '#6c5ce7' }
        },
        axisLabel: {
          color: '#b8c5d1',
          fontSize: 8,
          formatter: function(value) {
            return value + 'kW';
          }
        },
        splitLine: {
          lineStyle: { color: 'rgba(108, 92, 231, 0.1)' }
        }
      },
      series: [{
        name: '能耗监控',
        data: [35, 39, 42, 46, 45, 46],
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          color: '#6c5ce7',
          width: 2
        },
        itemStyle: {
          color: '#6c5ce7',
          borderColor: '#ffffff',
          borderWidth: 1
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(108, 92, 231, 0.3)' },
              { offset: 1, color: 'rgba(108, 92, 231, 0.05)' }
            ]
          }
        }
            }]
        };

        chart.setOption(option);
    this.charts.set('energy', chart);
  }

  initEfficiencyChart() {
    const container = getCachedElement('#efficiency-chart');
    if (!container) return;

    container.innerHTML = '';
        
        const chartContainer = document.createElement('div');
        chartContainer.style.width = '100%';
        chartContainer.style.height = '100%';
    container.appendChild(chartContainer);

          const chart = echarts.init(chartContainer, null, {
            renderer: 'canvas',
            useDirtyRect: true
          });

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#00cec9',
        borderWidth: 1,
        textStyle: {
          color: '#ffffff',
          fontSize: 10
        },
        formatter: function(params) {
          const value = params[0].value;
          return `时间: ${params[0].axisValue}<br/>运营效率: ${value}%`;
        }
      },
      legend: {
        show: false
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        top: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        axisLine: {
          lineStyle: { color: '#00cec9' }
        },
        axisLabel: {
          color: '#b8c5d1',
          fontSize: 8
        },
        axisTick: {
          lineStyle: { color: '#00cec9' }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: { color: '#00cec9' }
        },
        axisLabel: {
          color: '#b8c5d1',
          fontSize: 8,
          formatter: function(value) {
            return value + '%';
          }
        },
        splitLine: {
          lineStyle: { color: 'rgba(0, 206, 201, 0.1)' }
        }
      },
      series: [{
        name: '运营效率',
        data: [89, 90, 92, 93, 92, 93],
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          color: '#00cec9',
          width: 2
        },
        itemStyle: {
          color: '#00cec9',
          borderColor: '#ffffff',
          borderWidth: 1
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 206, 201, 0.3)' },
              { offset: 1, color: 'rgba(0, 206, 201, 0.05)' }
            ]
          }
        }
      }]
    };

          chart.setOption(option);
    this.charts.set('efficiency', chart);
  }

  initSatisfactionChart() {
    const container = getCachedElement('#satisfaction-chart');
    if (!container) return;

    container.innerHTML = '';
    
    const chartContainer = document.createElement('div');
    chartContainer.style.width = '100%';
    chartContainer.style.height = '100%';
    container.appendChild(chartContainer);

    const chart = echarts.init(chartContainer, null, {
      renderer: 'canvas',
      useDirtyRect: true
    });

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#ff4757',
        borderWidth: 1,
        textStyle: {
          color: '#ffffff',
          fontSize: 10
        },
        formatter: function(params) {
          const value = params[0].value;
          return `时间: ${params[0].axisValue}<br/>患者满意度: ${value}%`;
        }
      },
      legend: {
        show: false
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        top: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        axisLine: {
          lineStyle: { color: '#ff4757' }
        },
        axisLabel: {
          color: '#b8c5d1',
          fontSize: 8
        },
        axisTick: {
          lineStyle: { color: '#ff4757' }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: { color: '#ff4757' }
        },
        axisLabel: {
          color: '#b8c5d1',
          fontSize: 8,
          formatter: function(value) {
            return value + '%';
          }
        },
        splitLine: {
          lineStyle: { color: 'rgba(255, 71, 87, 0.1)' }
        }
      },
      series: [{
        name: '患者满意度',
        data: [94, 95, 96, 97, 97, 97],
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          color: '#ff4757',
          width: 2
        },
        itemStyle: {
          color: '#ff4757',
          borderColor: '#ffffff',
          borderWidth: 1
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 71, 87, 0.3)' },
              { offset: 1, color: 'rgba(255, 71, 87, 0.05)' }
            ]
          }
        }
      }]
    };

    chart.setOption(option);
    this.charts.set('satisfaction', chart);
  }

  initProgressBars() {
    // 初始化所有进度条
    const progressFills = document.querySelectorAll('.progress-fill[data-width]');
    progressFills.forEach(fill => {
      const width = fill.getAttribute('data-width');
      if (width) {
        fill.style.width = width + '%';
      }
    });
  }

  createTemperatureChart() {
    return {
      backgroundColor: 'transparent',
            series: [{
        type: 'gauge',
        center: ['50%', '70%'],
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
          distance: -20,
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
        center: ['50%', '70%'],
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
          distance: -20,
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
        center: ['50%', '70%'],
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
          distance: -20,
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
        center: ['50%', '70%'],
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
          distance: -20,
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
      // 更新核心指标图表
      this.updateCoreMetricsCharts();

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

  updateCoreMetricsCharts() {
    try {
      // 更新收入图表
      const revenueChart = this.charts.get('revenue');
      if (revenueChart) {
        const baseValue = 2000000;
        const newData = Array.from({length: 6}, (_, i) => {
          const variation = Math.floor((Math.random() - 0.5) * 800000);
          return Math.max(Math.floor(baseValue + variation + (i * 100000)), 1000000);
        });
        revenueChart.setOption({
          series: [{
            data: newData
          }]
        });
      }

      // 更新患者流量图表
      const patientsChart = this.charts.get('patients');
      if (patientsChart) {
        const baseValue = 1800;
        const newData = Array.from({length: 6}, (_, i) => {
          const variation = Math.floor((Math.random() - 0.5) * 400);
          return Math.max(Math.floor(baseValue + variation + (i * 50)), 800);
        });
        patientsChart.setOption({
          series: [{
            data: newData
          }]
        });
      }

      // 更新设备使用率图表
      const equipmentChart = this.charts.get('equipment');
      if (equipmentChart) {
        const baseValue = 75;
        const newData = Array.from({length: 6}, (_, i) => {
          const variation = Math.floor((Math.random() - 0.5) * 10);
          return Math.max(Math.min(Math.floor(baseValue + variation + (i * 1)), 100), 50);
        });
        equipmentChart.setOption({
          series: [{
            data: newData
          }]
        });
      }

      // 更新能耗监控图表
      const energyChart = this.charts.get('energy');
      if (energyChart) {
        const baseValue = 42;
        const newData = Array.from({length: 6}, (_, i) => {
          const variation = Math.floor((Math.random() - 0.5) * 8);
          return Math.max(Math.floor(baseValue + variation + (i * 0.5)), 30);
        });
        energyChart.setOption({
          series: [{
            data: newData
          }]
        });
      }

      // 更新运营效率图表
      const efficiencyChart = this.charts.get('efficiency');
      if (efficiencyChart) {
        const baseValue = 92;
        const newData = Array.from({length: 6}, (_, i) => {
          const variation = Math.floor((Math.random() - 0.5) * 4);
          return Math.max(Math.min(Math.floor(baseValue + variation + (i * 0.2)), 100), 85);
        });
        efficiencyChart.setOption({
          series: [{
            data: newData
          }]
        });
      }

      // 更新患者满意度图表
      const satisfactionChart = this.charts.get('satisfaction');
      if (satisfactionChart) {
        const baseValue = 96;
        const newData = Array.from({length: 6}, (_, i) => {
          const variation = Math.floor((Math.random() - 0.5) * 2);
          return Math.max(Math.min(Math.floor(baseValue + variation + (i * 0.1)), 100), 90);
        });
        satisfactionChart.setOption({
          series: [{
            data: newData
          }]
        });
      }
    } catch (error) {
      console.error('Failed to update core metrics charts:', error);
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
      { selector: '.main-metric-value', values: ['¥2,456,789', '2,156', '78%', '45.6kW', '92.5%', '96.8%'] },
    ];

    metrics.forEach(metric => {
      const elements = document.querySelectorAll(metric.selector);
      elements.forEach((element, index) => {
        if (metric.values[index]) {
          // 添加更新动画
          element.classList.add('updating');
          setTimeout(() => {
          element.textContent = metric.values[index];
            element.classList.remove('updating');
          }, 250);
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
