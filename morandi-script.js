// 莫兰迪风格医院数据看板 JavaScript 功能

// 全局配置
const CONFIG = {
  updateInterval: 10000, // 数据更新间隔（毫秒）
  chartAnimationDuration: 1000, // 图表动画时长
  debugMode: false // 调试模式
};

// 全局变量
let charts = {};
let updateTimer = null;
let isDarkMode = false;
let chartInitRetryCount = 0;
const MAX_CHART_RETRY = 3;

// DOM 元素缓存
const elements = {
  currentTime: null,
  themeToggle: null,
  totalPatients: null,
  bedOccupancy: null,
  staffOnDuty: null,
  dailyRevenue: null,
  resourceUtilizationChart: null,
  revenueChart: null,
  // 新增元素
  currentPatients: null,
  bedUtilization: null,
  avgWaitTime: null,
  hourlyRevenue: null,
  efficiencyScore: null,
  alertList: null,
  // 左侧区域元素
  leftTotalPatients: null,
  leftBedOccupancy: null,
  leftStaffOnDuty: null,
  leftDailyRevenue: null
};

// 初始化函数
function init() {
  try {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    // 等待ECharts库加载
    if (typeof echarts === 'undefined') {
      console.log('等待ECharts库加载...');
      setTimeout(init, 100);
      return;
    }
    
    // 缓存 DOM 元素
    cacheElements();
    
    // 初始化主题
    initTheme();
    
    // 初始化时间显示
    initTimeDisplay();
    
  // 延迟初始化图表，确保DOM完全渲染
  setTimeout(function() {
    initChartsWithRetry();
  }, 500);
    
    // 初始化事件监听器
    initEventListeners();
    
    // 开始数据更新
    startDataUpdates();
    
    // 初始数据加载
    updateAllData();
    
    // 立即更新实时数据指标
    setTimeout(function() {
      // 初始化实时数据指标图表
      initRealTimeMetricsCharts();
      updateRealTimeMetrics();
      // 强制显示实时数据指标
      forceShowRealTimeMetrics();
      // 强制显示所有区域内容
      forceShowAllSections();
    }, 500);
    
    console.log('莫兰迪风格医院数据看板初始化完成');
  } catch (error) {
    console.error('初始化失败:', error);
    showError('系统初始化失败，请刷新页面重试');
  }
}

// 缓存 DOM 元素
function cacheElements() {
  elements.currentTime = document.getElementById('current-time');
  elements.themeToggle = document.getElementById('theme-toggle');
  elements.totalPatients = document.getElementById('left-total-patients');
  elements.bedOccupancy = document.getElementById('left-bed-occupancy');
  elements.staffOnDuty = document.getElementById('left-staff-on-duty');
  elements.dailyRevenue = document.getElementById('left-daily-revenue');
  elements.resourceUtilizationChart = document.getElementById('resourceUtilizationChart');
  elements.revenueChart = document.getElementById('revenueChart');
  // 新增元素缓存
  elements.efficiencyScore = document.getElementById('efficiency-score');
  elements.alertList = document.getElementById('alertList');
  // 实时数据指标图表容器
  elements.currentPatientsChart = document.getElementById('current-patients-chart');
  elements.bedUtilizationChart = document.getElementById('bed-utilization-chart');
  elements.avgWaitTimeChart = document.getElementById('avg-wait-time-chart');
  elements.hourlyRevenueChart = document.getElementById('hourly-revenue-chart');
  // 实时人数显示
  elements.currentPatientsCount = document.getElementById('current-patients-count');
  elements.bedUtilizationCount = document.getElementById('bed-utilization-count');
  elements.avgWaitTimeCount = document.getElementById('avg-wait-time-count');
  elements.hourlyRevenueCount = document.getElementById('hourly-revenue-count');
  // 左侧区域元素缓存
  elements.leftTotalPatients = document.getElementById('left-total-patients');
  elements.leftBedOccupancy = document.getElementById('left-bed-occupancy');
  elements.leftStaffOnDuty = document.getElementById('left-staff-on-duty');
  elements.leftDailyRevenue = document.getElementById('left-daily-revenue');
}

// 初始化主题
function initTheme() {
  // 从本地存储读取主题设置
  const savedTheme = localStorage.getItem('morandi-theme');
  if (savedTheme === 'dark') {
    isDarkMode = true;
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  
  updateThemeButton();
}

// 初始化时间显示
function initTimeDisplay() {
  updateTime();
  setInterval(updateTime, 1000);
}

// 更新时间显示
function updateTime() {
  if (!elements.currentTime) return;
  
  const now = new Date();
  const timeString = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  if (elements.currentTime) {
    elements.currentTime.textContent = timeString;
  }
}

// 带重试的图表初始化
function initChartsWithRetry() {
  try {
    initCharts();
    chartInitRetryCount = 0; // 重置重试计数
  } catch (error) {
    console.error('图表初始化失败:', error);
    if (chartInitRetryCount < MAX_CHART_RETRY) {
      chartInitRetryCount++;
      console.log('图表初始化重试 ' + chartInitRetryCount + '/' + MAX_CHART_RETRY);
      setTimeout(function() {
        initChartsWithRetry();
      }, 1000 * chartInitRetryCount); // 递增延迟
    } else {
      console.error('图表初始化重试次数已达上限，请检查ECharts库是否正确加载');
    }
  }
}

// 初始化图表
function initCharts() {
  if (typeof echarts === 'undefined') {
    console.error('ECharts 库未加载');
    return;
  }
  
  console.log('开始初始化图表...');
  
  // 检查DOM元素是否存在
  if (!elements.resourceUtilizationChart) {
    console.error('资源利用率图表容器未找到');
  } else {
    console.log('资源利用率图表容器尺寸:', {
      width: elements.resourceUtilizationChart.offsetWidth,
      height: elements.resourceUtilizationChart.offsetHeight
    });
    
    // 确保容器有足够的高度
  }
  
  if (!elements.revenueChart) {
    console.error('收入分析图表容器未找到');
  } else {
    console.log('收入分析图表容器尺寸:', {
      width: elements.revenueChart.offsetWidth,
      height: elements.revenueChart.offsetHeight
    });
    
    // 确保容器有足够的高度
  }
  
  // 初始化资源利用率图表
  initResourceUtilizationChart();
  
  // 初始化收入分析图表
  initRevenueChart();
  
  console.log('图表初始化完成，已创建图表:', Object.keys(charts));
  
  // 监听窗口大小变化
  window.addEventListener('resize', debounce(function() {
    console.log('窗口大小变化，调整图表尺寸...');
    Object.values(charts).forEach(function(chart) {
      if (chart && chart.resize) {
        chart.resize();
      }
    });
  }, 300));
  
  // 添加页面可见性变化监听
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      console.log('页面重新可见，调整图表尺寸...');
      setTimeout(function() {
        Object.values(charts).forEach(function(chart) {
          if (chart && chart.resize) {
            chart.resize();
          }
        });
      }, 100);
    }
  });
}

// 初始化资源利用率图表
function initResourceUtilizationChart() {
  if (!elements.resourceUtilizationChart) {
    console.error('资源利用率图表容器不存在');
    return;
  }
  
  // 确保容器有足够的尺寸
  if (elements.resourceUtilizationChart.offsetWidth < 200 || elements.resourceUtilizationChart.offsetHeight < 200) {
    console.warn('资源利用率图表容器尺寸不足，设置最小尺寸');
    elements.resourceUtilizationChart.style.minWidth = '200px';
    elements.resourceUtilizationChart.style.minHeight = '200px';
  }
  
  try {
    charts.resourceUtilization = echarts.init(elements.resourceUtilizationChart);
    console.log('资源利用率图表初始化成功');
  } catch (error) {
    console.error('资源利用率图表初始化失败:', error);
    return;
  }
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#8B9DC3',
      borderWidth: 1,
      textStyle: {
        color: '#4A4A4A'
      },
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#8B9DC3'
        }
      }
    },
    legend: {
      data: ['床位利用率', '设备利用率', '人员利用率'],
      textStyle: {
        color: isDarkMode ? '#E0E0E0' : '#4A4A4A',
        fontSize: 12
      },
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['床位', '设备', '人员', '药品', '耗材', '能源'],
      axisLine: {
        lineStyle: {
          color: isDarkMode ? '#404040' : '#E0E0E0'
        }
      },
      axisLabel: {
        color: isDarkMode ? '#B0B0B0' : '#6A6A6A',
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: isDarkMode ? '#404040' : '#E0E0E0'
        }
      },
      axisLabel: {
        color: isDarkMode ? '#B0B0B0' : '#6A6A6A',
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: isDarkMode ? '#3A3A3A' : '#F0F0F0'
        }
      }
    },
    series: [
      {
        name: '床位利用率',
        type: 'line',
        data: [85, 92, 78, 88, 95, 82],
        smooth: true,
        itemStyle: {
          color: '#8B9DC3'
        },
        lineStyle: {
          color: '#8B9DC3',
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(139, 157, 195, 0.3)' },
            { offset: 1, color: 'rgba(139, 157, 195, 0.05)' }
          ])
        }
      },
      {
        name: '设备利用率',
        type: 'line',
        data: [72, 88, 65, 82, 90, 75],
        smooth: true,
        itemStyle: {
          color: '#A8A8A8'
        },
        lineStyle: {
          color: '#A8A8A8',
          width: 2
        }
      },
      {
        name: '人员利用率',
        type: 'line',
        data: [68, 85, 72, 78, 88, 70],
        smooth: true,
        itemStyle: {
          color: '#D4A5A5'
        },
        lineStyle: {
          color: '#D4A5A5',
          width: 2
        }
      }
    ]
  };
  
  try {
    charts.resourceUtilization.setOption(option);
    console.log('资源利用率图表配置设置成功');
    
    // 确保图表正确渲染
    setTimeout(function() {
      if (charts.resourceUtilization) {
        charts.resourceUtilization.resize();
        console.log('资源利用率图表已调整尺寸');
        
        // 强制重新渲染图表
        charts.resourceUtilization.setOption(option, true);
        console.log('资源利用率图表已强制重新渲染');
      }
    }, 100);
    
    // 隐藏加载状态
    const loadingElement = document.getElementById('resourceUtilizationLoading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  } catch (error) {
    console.error('资源利用率图表配置设置失败:', error);
  }
}

// 初始化收入分析图表
function initRevenueChart() {
  if (!elements.revenueChart) {
    console.error('收入分析图表容器不存在');
    return;
  }
  
  try {
    charts.revenue = echarts.init(elements.revenueChart);
    console.log('收入分析图表初始化成功');
  } catch (error) {
    console.error('收入分析图表初始化失败:', error);
    return;
  }
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#8B9DC3',
      borderWidth: 1,
      textStyle: {
        color: '#4A4A4A'
      },
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: {
        color: isDarkMode ? '#E0E0E0' : '#4A4A4A',
        fontSize: 11
      },
      itemWidth: 12,
      itemHeight: 8,
      itemGap: 8
    },
    series: [
      {
        name: '收入结构',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#FFFFFF',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: isDarkMode ? '#E0E0E0' : '#4A4A4A'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 45, name: '门诊收入', itemStyle: { color: '#8B9DC3' } },
          { value: 30, name: '住院收入', itemStyle: { color: '#A8A8A8' } },
          { value: 15, name: '检查收入', itemStyle: { color: '#D4A5A5' } },
          { value: 10, name: '其他收入', itemStyle: { color: '#9BB5A1' } }
        ]
      }
    ]
  };
  
  try {
    charts.revenue.setOption(option);
    console.log('收入分析图表配置设置成功');
    
    // 确保图表正确渲染
    setTimeout(function() {
      if (charts.revenue) {
        charts.revenue.resize();
        console.log('收入分析图表已调整尺寸');
      }
    }, 100);
    
    // 隐藏加载状态
    const loadingElement = document.getElementById('revenueLoading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  } catch (error) {
    console.error('收入分析图表配置设置失败:', error);
  }
}

// 初始化事件监听器
function initEventListeners() {
  // 主题切换
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener('click', toggleTheme);
  }
  
  // 图表控制按钮
  const controlButtons = document.querySelectorAll('.control-btn');
  controlButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      // 移除其他按钮的 active 类
      controlButtons.forEach(function(b) {
        b.classList.remove('active');
      });
      // 添加当前按钮的 active 类
      e.target.classList.add('active');
      
      // 更新图表数据
      updateResourceUtilizationChart(e.target.dataset.period);
    });
  });
  
  // 告警中心标签页
  const alertTabs = document.querySelectorAll('.alert-tab');
  alertTabs.forEach(function(tab) {
    tab.addEventListener('click', function(e) {
      // 移除其他标签页的 active 类
      alertTabs.forEach(function(t) {
        t.classList.remove('active');
      });
      // 添加当前标签页的 active 类
      e.target.classList.add('active');
      
      // 过滤告警列表
      filterAlerts(e.target.dataset.type);
    });
  });
  
  // 图表控制按钮
  const controlBtns = document.querySelectorAll('.control-btn');
  controlBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      // 移除所有active类
      controlBtns.forEach(function(b) {
        b.classList.remove('active');
      });
      // 添加active类到当前按钮
      e.target.classList.add('active');
      // 获取时间周期
      const period = e.target.getAttribute('data-period');
      updateChartPeriod(period);
    });
  });
}

// 切换主题
function toggleTheme() {
  isDarkMode = !isDarkMode;
  
  if (isDarkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('morandi-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('morandi-theme', 'light');
  }
  
  updateThemeButton();
  updateChartsTheme();
}

// 更新主题按钮
function updateThemeButton() {
  if (!elements.themeToggle) return;
  
  const icon = elements.themeToggle.querySelector('.theme-icon');
  const text = elements.themeToggle.querySelector('.theme-text');
  
  if (isDarkMode) {
    elements.themeToggle.classList.add('active');
    if (icon) icon.textContent = '☀️';
    if (text) text.textContent = '浅色';
  } else {
    elements.themeToggle.classList.remove('active');
    if (icon) icon.textContent = '🌙';
    if (text) text.textContent = '深色';
  }
}

// 更新图表主题
function updateChartsTheme() {
  // 重新初始化图表以应用新主题
  setTimeout(function() {
    initCharts();
  }, 100);
}

// 更新资源利用率图表
function updateResourceUtilizationChart(period = 'day') {
  if (!charts.resourceUtilization) return;
  
  let data, xAxisData;
  
  switch (period) {
    case 'week':
      xAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      data = {
        today: [85, 88, 92, 90, 87, 82, 80],
        yesterday: [82, 85, 89, 87, 84, 79, 77],
        lastWeek: [83, 86, 90, 88, 85, 80, 78]
      };
      break;
    case 'month':
      xAxisData = Array.from({length: 30}, function(_, i) { return (i + 1) + '日'; });
      data = {
        today: Array.from({length: 30}, function() { return Math.floor(Math.random() * 20) + 75; }),
        yesterday: Array.from({length: 30}, function() { return Math.floor(Math.random() * 20) + 70; }),
        lastWeek: Array.from({length: 30}, function() { return Math.floor(Math.random() * 20) + 72; })
      };
      break;
    default: // day
      xAxisData = ['床位', '设备', '人员', '药品', '耗材', '能源'];
      data = {
        today: [85, 92, 78, 88, 95, 82],
        yesterday: [82, 89, 75, 85, 92, 79],
        lastWeek: [83, 90, 76, 86, 93, 80]
      };
  }
  
  const option = {
    xAxis: {
      data: xAxisData
    },
    series: [
      { data: data.today },
      { data: data.yesterday },
      { data: data.lastWeek }
    ]
  };
  
  charts.resourceUtilization.setOption(option);
}

// 开始数据更新
function startDataUpdates() {
  updateTimer = setInterval(updateAllData, CONFIG.updateInterval);
}

// 更新所有数据
function updateAllData() {
  updateLeftSectionData();
  updateCoreMetrics();
  updateDepartmentData();
  updateQualityMetrics();
  updateSystemStatus();
  updateAlerts();
  updateEnvironmentData();
  updateRealTimeMetrics();
  updateOperationalDashboard();
  updatePerformanceMonitoring();
}

// 更新左侧区域数据
function updateLeftSectionData() {
  console.log('更新左侧区域数据...');
  
  if (elements.leftTotalPatients) {
    const totalPatients = Math.floor(Math.random() * 500) + 2000;
    elements.leftTotalPatients.textContent = totalPatients.toLocaleString();
    console.log('更新左侧今日患者数:', totalPatients);
  }
  
  if (elements.leftBedOccupancy) {
    const occupancy = (Math.random() * 20 + 70).toFixed(0);
    elements.leftBedOccupancy.textContent = occupancy + '%';
    console.log('更新左侧床位使用率:', occupancy + '%');
  }
  
  if (elements.leftStaffOnDuty) {
    const staffCount = Math.floor(Math.random() * 200) + 1200;
    elements.leftStaffOnDuty.textContent = staffCount.toLocaleString();
    console.log('更新左侧在岗医护数:', staffCount);
  }
  
  if (elements.leftDailyRevenue) {
    const revenue = (Math.random() * 1 + 2).toFixed(2);
    elements.leftDailyRevenue.textContent = '¥' + revenue + 'M';
    console.log('更新左侧今日收入:', '¥' + revenue + 'M');
  }
}



// 更新核心指标
function updateCoreMetrics() {
  // 模拟数据更新
  const metrics = {
    totalPatients: Math.floor(Math.random() * 500) + 2000,
    bedOccupancy: Math.floor(Math.random() * 20) + 70,
    staffOnDuty: Math.floor(Math.random() * 100) + 1200,
    dailyRevenue: (Math.random() * 1000000 + 2000000) / 1000000
  };
  
  // 更新 DOM
  if (elements.totalPatients) {
    elements.totalPatients.textContent = metrics.totalPatients.toLocaleString();
  }
  
  if (elements.bedOccupancy) {
    elements.bedOccupancy.textContent = metrics.bedOccupancy + '%';
  }
  
  if (elements.staffOnDuty) {
    elements.staffOnDuty.textContent = metrics.staffOnDuty.toLocaleString();
  }
  
  if (elements.dailyRevenue) {
    elements.dailyRevenue.textContent = '¥' + metrics.dailyRevenue.toFixed(2) + 'M';
  }
  
  // 更新趋势指示器
  updateTrendIndicators();
}

// 更新趋势指示器
function updateTrendIndicators() {
  const trendElements = document.querySelectorAll('.metric-trend');
  const trends = ['up', 'down', 'stable'];
  
  trendElements.forEach(function(element) {
    const randomTrend = trends[Math.floor(Math.random() * trends.length)];
    const randomValue = (Math.random() * 15).toFixed(1);
    
    element.className = 'metric-trend ' + randomTrend;
    
    switch (randomTrend) {
      case 'up':
        element.textContent = '+' + randomValue + '%';
        break;
      case 'down':
        element.textContent = '-' + randomValue + '%';
        break;
      case 'stable':
        element.textContent = '0%';
        break;
    }
  });
}

// 更新科室数据
function updateDepartmentData() {
  const departmentItems = document.querySelectorAll('.department-item');
  const departments = [
    { name: '内科', patients: [400, 500] },
    { name: '外科', patients: [200, 280] },
    { name: '急诊科', patients: [70, 100] },
    { name: '儿科', patients: [130, 180] },
    { name: '妇产科', patients: [60, 90] },
    { name: '骨科', patients: [100, 150] }
  ];
  
  departmentItems.forEach(function(item, index) {
    if (index < departments.length) {
      const dept = departments[index];
      const patients = Math.floor(Math.random() * (dept.patients[1] - dept.patients[0])) + dept.patients[0];
      
      const patientsSpan = item.querySelector('.dept-patients');
      const statusSpan = item.querySelector('.dept-status');
      
      if (patientsSpan) {
        patientsSpan.textContent = '患者: ' + patients;
      }
      
      // 更新状态
      if (statusSpan) {
        const occupancyRate = patients / dept.patients[1];
        if (occupancyRate > 0.9) {
          statusSpan.textContent = '繁忙';
          statusSpan.className = 'dept-status busy';
        } else if (occupancyRate > 0.8) {
          statusSpan.textContent = '紧急';
          statusSpan.className = 'dept-status urgent';
        } else {
          statusSpan.textContent = '正常';
          statusSpan.className = 'dept-status normal';
        }
      }
    }
  });
}

// 更新质量指标
function updateQualityMetrics() {
  const qualityItems = document.querySelectorAll('.quality-item');
  const metrics = [
    { value: (Math.random() * 0.5 + 0.5).toFixed(1) + '%', label: '感染率' },
    { value: (Math.random() * 2 + 2).toFixed(1) + '%', label: '再入院率' },
    { value: (Math.random() * 2 + 6).toFixed(1) + '天', label: '平均住院日' },
    { value: (Math.random() * 2 + 97).toFixed(1), label: '满意度' }
  ];
  
  qualityItems.forEach(function(item, index) {
    if (index < metrics.length) {
      const valueElement = item.querySelector('.quality-value');
      if (valueElement) {
        valueElement.textContent = metrics[index].value;
      }
    }
  });
}

// 更新系统状态
function updateSystemStatus() {
  const systemItems = document.querySelectorAll('.system-item');
  const equipmentItems = document.querySelectorAll('.equipment-item');
  
  // 更新系统状态
  systemItems.forEach(function(item) {
    const statusElement = item.querySelector('.system-status');
    if (statusElement && Math.random() > 0.1) { // 90% 概率在线
      statusElement.textContent = '在线';
      statusElement.className = 'system-status online';
    } else if (statusElement) {
      statusElement.textContent = '离线';
      statusElement.className = 'system-status offline';
    }
  });
  
  // 更新设备状态
  equipmentItems.forEach(function(item) {
    const statusElement = item.querySelector('.equipment-status');
    if (statusElement) {
      const statuses = ['online', 'maintenance', 'offline'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      statusElement.className = 'equipment-status ' + randomStatus;
      
      switch (randomStatus) {
        case 'online':
          statusElement.textContent = '运行中';
          break;
        case 'maintenance':
          statusElement.textContent = '维护中';
          break;
        case 'offline':
          statusElement.textContent = '离线';
          break;
      }
    }
  });
}

// 更新告警
function updateAlerts() {
  const alertList = document.querySelector('.alert-list');
  if (!alertList) return;
  
  // 随机添加新告警
  if (Math.random() > 0.7) {
    const alerts = [
      { type: 'critical', content: '系统负载过高', status: 'pending' },
      { type: 'warning', content: '床位使用率过高', status: 'processing' },
      { type: 'info', content: '定期维护提醒', status: 'resolved' },
      { type: 'critical', content: '设备连接异常', status: 'pending' }
    ];
    
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    const alertItem = document.createElement('div');
    alertItem.className = 'alert-item ' + randomAlert.type;
    
    // 获取对应的图标
    var alertIcon = 'ℹ️';
    if (randomAlert.type === 'critical') {
      alertIcon = '🚨';
    } else if (randomAlert.type === 'warning') {
      alertIcon = '⚠️';
    }
    
    var alertTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    var statusText = '未处理';
    if (randomAlert.status === 'processing') {
      statusText = '处理中';
    } else if (randomAlert.status === 'resolved') {
      statusText = '已处理';
    }
    
    alertItem.innerHTML = 
      '<div class="alert-icon">' + alertIcon + '</div>' +
      '<div class="alert-content">' +
        '<div class="alert-title">' + randomAlert.content + '</div>' +
        '<div class="alert-time">' + alertTime + '</div>' +
      '</div>' +
      '<div class="alert-status ' + randomAlert.status + '">' + statusText + '</div>';
    
    alertList.insertBefore(alertItem, alertList.firstChild);
    
    // 保持最多5条告警
    if (alertList.children.length > 5) {
      alertList.removeChild(alertList.lastChild);
    }
  }
}

// 更新环境数据
function updateEnvironmentData() {
  const envItems = document.querySelectorAll('.env-item');
  const envData = [
    { value: (Math.random() * 10 + 18).toFixed(1) + '°C', label: '温度' },
    { value: Math.floor(Math.random() * 30 + 40) + '%', label: '湿度' },
    { value: Math.floor(Math.random() * 20 + 10), label: 'PM2.5' },
    { value: (Math.random() * 20 + 35).toFixed(1) + 'kW', label: '功耗' }
  ];
  
  envItems.forEach(function(item, index) {
    if (index < envData.length) {
      const valueElement = item.querySelector('.env-value');
      if (valueElement) {
        valueElement.textContent = envData[index].value;
      }
    }
  });
}

// 初始化实时数据指标图表
function initRealTimeMetricsCharts() {
  console.log('初始化实时数据指标图表...');
  
  // 初始化当前在院患者图表
  if (elements.currentPatientsChart) {
    try {
      charts.currentPatients = echarts.init(elements.currentPatientsChart);
      initCurrentPatientsChart();
      console.log('当前在院患者图表初始化成功');
    } catch (error) {
      console.error('当前在院患者图表初始化失败:', error);
    }
  }
  
  // 初始化床位使用率图表
  if (elements.bedUtilizationChart) {
    try {
      charts.bedUtilization = echarts.init(elements.bedUtilizationChart);
      initBedUtilizationChart();
      console.log('床位使用率图表初始化成功');
    } catch (error) {
      console.error('床位使用率图表初始化失败:', error);
    }
  }
  
  // 初始化平均等待时间图表
  if (elements.avgWaitTimeChart) {
    try {
      charts.avgWaitTime = echarts.init(elements.avgWaitTimeChart);
      initAvgWaitTimeChart();
      console.log('平均等待时间图表初始化成功');
    } catch (error) {
      console.error('平均等待时间图表初始化失败:', error);
    }
  }
  
  // 初始化小时收入图表
  if (elements.hourlyRevenueChart) {
    try {
      charts.hourlyRevenue = echarts.init(elements.hourlyRevenueChart);
      initHourlyRevenueChart();
      console.log('小时收入图表初始化成功');
    } catch (error) {
      console.error('小时收入图表初始化失败:', error);
    }
  }
}

// 初始化当前在院患者图表
function initCurrentPatientsChart() {
  if (!charts.currentPatients) return;
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#8B9DC3',
      borderWidth: 1,
      textStyle: {
        color: '#4A4A4A',
        fontSize: 12
      },
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#8B9DC3'
        }
      },
      formatter: function(params) {
        const data = params[0];
        return '<div style="padding: 8px;">' +
               '<div style="font-weight: 600; margin-bottom: 4px;">当前在院患者</div>' +
               '<div style="color: #8B9DC3;">时间: ' + data.axisValue + '</div>' +
               '<div style="color: #8B9DC3;">患者数: ' + data.value + '人</div>' +
               '</div>';
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      top: '10%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      axisLine: {
        lineStyle: {
          color: isDarkMode ? '#404040' : '#E0E0E0'
        }
      },
      axisLabel: { 
        fontSize: 10,
        color: isDarkMode ? '#B0B0B0' : '#6A6A6A'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: isDarkMode ? '#404040' : '#E0E0E0'
        }
      },
      axisLabel: { 
        fontSize: 10,
        color: isDarkMode ? '#B0B0B0' : '#6A6A6A'
      },
      splitLine: {
        lineStyle: {
          color: isDarkMode ? '#3A3A3A' : '#F0F0F0'
        }
      }
    },
    series: [{
      data: [1200, 1150, 1234, 1280, 1250, 1200],
      type: 'line',
      smooth: true,
      symbol: 'none',
      itemStyle: {
        color: '#8B9DC3'
      },
      lineStyle: {
        color: '#8B9DC3',
        width: 2
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(139, 157, 195, 0.3)' },
          { offset: 1, color: 'rgba(139, 157, 195, 0.05)' }
        ])
      }
    }]
  };
  
  charts.currentPatients.setOption(option);
}

// 初始化床位使用率图表
function initBedUtilizationChart() {
  if (!charts.bedUtilization) return;
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#A8A8A8',
      borderWidth: 1,
      textStyle: {
        color: '#4A4A4A',
        fontSize: 12
      },
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#A8A8A8'
        }
      },
      formatter: function(params) {
        const data = params[0];
        return '<div style="padding: 8px;">' +
               '<div style="font-weight: 600; margin-bottom: 4px;">床位使用率</div>' +
               '<div style="color: #A8A8A8;">时间: ' + data.axisValue + '</div>' +
               '<div style="color: #A8A8A8;">使用率: ' + data.value + '%</div>' +
               '</div>';
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      top: '10%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      axisLine: {
        lineStyle: {
          color: isDarkMode ? '#404040' : '#E0E0E0'
        }
      },
      axisLabel: { 
        fontSize: 10,
        color: isDarkMode ? '#B0B0B0' : '#6A6A6A'
      }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLine: {
        lineStyle: {
          color: isDarkMode ? '#404040' : '#E0E0E0'
        }
      },
      axisLabel: { 
        fontSize: 10,
        color: isDarkMode ? '#B0B0B0' : '#6A6A6A'
      },
      splitLine: {
        lineStyle: {
          color: isDarkMode ? '#3A3A3A' : '#F0F0F0'
        }
      }
    },
    series: [{
      data: [85, 82, 87, 90, 88, 87],
      type: 'line',
      smooth: true,
      symbol: 'none',
      itemStyle: {
        color: '#A8A8A8'
      },
      lineStyle: {
        color: '#A8A8A8',
        width: 2
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(168, 168, 168, 0.3)' },
          { offset: 1, color: 'rgba(168, 168, 168, 0.05)' }
        ])
      }
    }]
  };
  
  charts.bedUtilization.setOption(option);
}

// 初始化平均等待时间图表
function initAvgWaitTimeChart() {
  if (!charts.avgWaitTime) return;
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#D4A5A5',
      borderWidth: 1,
      textStyle: {
        color: '#4A4A4A',
        fontSize: 12
      },
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#D4A5A5'
        }
      },
      formatter: function(params) {
        const data = params[0];
        return '<div style="padding: 8px;">' +
               '<div style="font-weight: 600; margin-bottom: 4px;">平均等待时间</div>' +
               '<div style="color: #D4A5A5;">时间: ' + data.axisValue + '</div>' +
               '<div style="color: #D4A5A5;">等待时间: ' + data.value + '分钟</div>' +
               '</div>';
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      top: '10%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      axisLine: {
        lineStyle: {
          color: isDarkMode ? '#404040' : '#E0E0E0'
        }
      },
      axisLabel: { 
        fontSize: 10,
        color: isDarkMode ? '#B0B0B0' : '#6A6A6A'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: isDarkMode ? '#404040' : '#E0E0E0'
        }
      },
      axisLabel: { 
        fontSize: 10,
        color: isDarkMode ? '#B0B0B0' : '#6A6A6A'
      },
      splitLine: {
        lineStyle: {
          color: isDarkMode ? '#3A3A3A' : '#F0F0F0'
        }
      }
    },
    series: [{
      data: [15, 8, 12, 18, 14, 10],
      type: 'line',
      smooth: true,
      symbol: 'none',
      itemStyle: {
        color: '#D4A5A5'
      },
      lineStyle: {
        color: '#D4A5A5',
        width: 2
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(212, 165, 165, 0.3)' },
          { offset: 1, color: 'rgba(212, 165, 165, 0.05)' }
        ])
      }
    }]
  };
  
  charts.avgWaitTime.setOption(option);
}

// 初始化小时收入图表
function initHourlyRevenueChart() {
  if (!charts.hourlyRevenue) return;
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#8B9DC3',
      borderWidth: 1,
      textStyle: {
        color: '#4A4A4A',
        fontSize: 12
      },
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#8B9DC3'
        }
      },
      formatter: function(params) {
        const data = params[0];
        return '<div style="padding: 8px;">' +
               '<div style="font-weight: 600; margin-bottom: 4px;">小时收入</div>' +
               '<div style="color: #8B9DC3;">时间: ' + data.axisValue + '</div>' +
               '<div style="color: #8B9DC3;">收入: ¥' + data.value + '万</div>' +
               '</div>';
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      top: '10%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      axisLine: {
        lineStyle: {
          color: isDarkMode ? '#404040' : '#E0E0E0'
        }
      },
      axisLabel: { 
        fontSize: 10,
        color: isDarkMode ? '#B0B0B0' : '#6A6A6A'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: isDarkMode ? '#404040' : '#E0E0E0'
        }
      },
      axisLabel: { 
        fontSize: 10,
        color: isDarkMode ? '#B0B0B0' : '#6A6A6A'
      },
      splitLine: {
        lineStyle: {
          color: isDarkMode ? '#3A3A3A' : '#F0F0F0'
        }
      }
    },
    series: [{
      data: [35, 20, 45, 55, 48, 42],
      type: 'line',
      smooth: true,
      symbol: 'none',
      itemStyle: {
        color: '#8B9DC3'
      },
      lineStyle: {
        color: '#8B9DC3',
        width: 2
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(139, 157, 195, 0.3)' },
          { offset: 1, color: 'rgba(139, 157, 195, 0.05)' }
        ])
      }
    }]
  };
  
  charts.hourlyRevenue.setOption(option);
}

// 更新实时数据指标
function updateRealTimeMetrics() {
  console.log('更新实时数据指标图表...');
  
  // 检查图表容器是否存在
  console.log('图表容器检查:', {
    currentPatientsChart: !!elements.currentPatientsChart,
    bedUtilizationChart: !!elements.bedUtilizationChart,
    avgWaitTimeChart: !!elements.avgWaitTimeChart,
    hourlyRevenueChart: !!elements.hourlyRevenueChart
  });
  
  // 更新实时数值显示
  if (elements.currentPatientsCount) {
    const currentPatients = Math.floor(Math.random() * 200) + 1200;
    elements.currentPatientsCount.textContent = currentPatients.toLocaleString();
    console.log('更新当前在院患者数:', currentPatients);
  }
  
  if (elements.bedUtilizationCount) {
    const bedUtilization = Math.floor(Math.random() * 20) + 75; // 75-95%
    elements.bedUtilizationCount.textContent = bedUtilization + '%';
    console.log('更新床位使用率:', bedUtilization + '%');
  }
  
  if (elements.avgWaitTimeCount) {
    const avgWaitTime = Math.floor(Math.random() * 15) + 8; // 8-23分钟
    elements.avgWaitTimeCount.textContent = avgWaitTime;
    console.log('更新平均等待时间:', avgWaitTime + '分钟');
  }
  
  if (elements.hourlyRevenueCount) {
    const hourlyRevenue = Math.floor(Math.random() * 3000) + 6000; // 6000-9000元
    elements.hourlyRevenueCount.textContent = '¥' + hourlyRevenue.toLocaleString();
    console.log('更新小时收入:', '¥' + hourlyRevenue);
  }
  
  // 图表数据会通过ECharts自动更新，这里只需要确保图表正常显示
  console.log('实时数据指标图表更新完成');
}


// 强制显示实时数据指标
function forceShowRealTimeMetrics() {
  console.log('强制显示实时数据指标...');
  
  const realTimeMetricsCard = document.querySelector('.real-time-metrics');
  if (realTimeMetricsCard) {
    console.log('找到实时数据指标卡片');
    realTimeMetricsCard.style.display = 'block';
    realTimeMetricsCard.style.visibility = 'visible';
    realTimeMetricsCard.style.opacity = '1';
  } else {
    console.error('未找到实时数据指标卡片');
  }
  
  const metricsRow = document.querySelector('.real-time-metrics .metrics-row');
  if (metricsRow) {
    console.log('找到指标行');
    metricsRow.style.display = 'grid';
    metricsRow.style.visibility = 'visible';
    metricsRow.style.opacity = '1';
  } else {
    console.error('未找到指标行');
  }
  
  const metricItems = document.querySelectorAll('.real-time-metrics .metric-item');
  console.log('找到指标项数量:', metricItems.length);
  
  metricItems.forEach(function(item, index) {
    console.log('设置指标项', index, '的显示样式');
    item.style.display = 'flex';
    item.style.visibility = 'visible';
    item.style.opacity = '1';
  });
  
  // 检查图表容器
  const chartContainers = document.querySelectorAll('.real-time-metrics .metric-chart');
  console.log('找到图表容器数量:', chartContainers.length);
  
  chartContainers.forEach(function(chart, index) {
    console.log('设置图表容器', index, '的显示样式');
    chart.style.display = 'block';
    chart.style.visibility = 'visible';
    chart.style.opacity = '1';
  });
}

// 强制显示所有区域内容
function forceShowAllSections() {
  console.log('强制显示所有区域内容...');
  
  // 强制显示运营数据看板
  const operationalDashboard = document.querySelector('.operational-dashboard');
  if (operationalDashboard) {
    console.log('找到运营数据看板');
    operationalDashboard.style.display = 'block';
    operationalDashboard.style.visibility = 'visible';
    operationalDashboard.style.opacity = '1';
    
    const dashboardGrid = operationalDashboard.querySelector('.dashboard-grid');
    if (dashboardGrid) {
      dashboardGrid.style.display = 'grid';
      dashboardGrid.style.visibility = 'visible';
      dashboardGrid.style.opacity = '1';
    }
  }
  
  // 强制显示性能监控面板
  const systemOverview = document.querySelector('.system-overview');
  if (systemOverview) {
    console.log('找到系统状态概览');
    systemOverview.style.display = 'block';
    systemOverview.style.visibility = 'visible';
    systemOverview.style.opacity = '1';
    
    const performanceSection = systemOverview.querySelector('.performance-section');
    if (performanceSection) {
      performanceSection.style.display = 'block';
      performanceSection.style.visibility = 'visible';
      performanceSection.style.opacity = '1';
    }
    
    const performanceGrid = systemOverview.querySelector('.performance-grid');
    if (performanceGrid) {
      performanceGrid.style.display = 'grid';
      performanceGrid.style.visibility = 'visible';
      performanceGrid.style.opacity = '1';
    }
  }
  
  // 强制显示告警中心
  const alertPanel = document.querySelector('.alert-panel');
  if (alertPanel) {
    console.log('找到实时告警面板');
    alertPanel.style.display = 'block';
    alertPanel.style.visibility = 'visible';
    alertPanel.style.opacity = '1';
    
    const alertCenterHeader = alertPanel.querySelector('.alert-center-header');
    if (alertCenterHeader) {
      alertCenterHeader.style.display = 'flex';
      alertCenterHeader.style.visibility = 'visible';
      alertCenterHeader.style.opacity = '1';
    }
    
    
    const alertTabs = alertPanel.querySelector('.alert-tabs');
    if (alertTabs) {
      alertTabs.style.display = 'flex';
      alertTabs.style.visibility = 'visible';
      alertTabs.style.opacity = '1';
    }
    
    const alertList = alertPanel.querySelector('.alert-list');
    if (alertList) {
      alertList.style.display = 'flex';
      alertList.style.visibility = 'visible';
      alertList.style.opacity = '1';
    }
  }
  
  // 检查并设置默认数据
  setDefaultDataForEmptySections();
  
  // 强制显示运营数据看板和性能监控面板
  forceShowOperationalAndPerformanceSections();
  
  // 强制显示图表
  forceShowCharts();
}

// 为空的区域设置默认数据
function setDefaultDataForEmptySections() {
  console.log('为空的区域设置默认数据...');
  
  // 检查效率分数
  const efficiencyScore = document.getElementById('efficiency-score');
  if (efficiencyScore && (!efficiencyScore.textContent || efficiencyScore.textContent.trim() === '')) {
    efficiencyScore.textContent = '92.5%';
    console.log('设置默认效率分数: 92.5%');
  }
  
  
  // 检查性能指标
  const performanceMetrics = document.querySelectorAll('.system-overview .performance-section .metric-value');
  performanceMetrics.forEach(function(metric, index) {
    if (!metric.textContent || metric.textContent.trim() === '') {
      const values = ['45%', '62%', '38%'];
      metric.textContent = values[index] || '0%';
      console.log('设置默认性能指标:', metric.textContent);
    }
  });
  
  // 检查网络状态
  const networkValues = document.querySelectorAll('.network-value');
  networkValues.forEach(function(value, index) {
    if (!value.textContent || value.textContent.trim() === '') {
      const values = ['延迟: 2ms', '延迟: 15ms', '45% / 100Mbps'];
      value.textContent = values[index] || '正常';
      console.log('设置默认网络状态:', value.textContent);
    }
  });
}

// 强制显示运营数据看板和性能监控面板
function forceShowOperationalAndPerformanceSections() {
  console.log('强制显示运营数据看板和性能监控面板...');
  
  // 强制显示效率条
  const efficiencyBars = document.querySelectorAll('.efficiency-bar');
  efficiencyBars.forEach(function(bar, index) {
    console.log('设置效率条', index, '的显示样式');
    bar.style.display = 'flex';
    bar.style.visibility = 'visible';
    bar.style.opacity = '1';
    bar.style.width = '100%';
    bar.style.overflow = 'visible';
  });
  
  // 强制显示效率条容器
  const efficiencyBarsContainer = document.querySelector('.efficiency-bars');
  if (efficiencyBarsContainer) {
    console.log('设置效率条容器的显示样式');
    efficiencyBarsContainer.style.display = 'flex';
    efficiencyBarsContainer.style.visibility = 'visible';
    efficiencyBarsContainer.style.opacity = '1';
    efficiencyBarsContainer.style.width = '100%';
    efficiencyBarsContainer.style.overflow = 'visible';
  }
  
  // 强制显示资源指标
  const resourceItems = document.querySelectorAll('.resource-item');
  resourceItems.forEach(function(item, index) {
    console.log('设置资源项', index, '的显示样式');
    item.style.display = 'flex';
    item.style.visibility = 'visible';
    item.style.opacity = '1';
    item.style.width = '100%';
  });
  
  // 强制显示性能指标行
  const metricRows = document.querySelectorAll('.metric-row');
  metricRows.forEach(function(row, index) {
    console.log('设置性能指标行', index, '的显示样式');
    row.style.display = 'flex';
    row.style.visibility = 'visible';
    row.style.opacity = '1';
    row.style.width = '100%';
  });
  
  // 强制显示网络项
  const networkItems = document.querySelectorAll('.network-item');
  networkItems.forEach(function(item, index) {
    console.log('设置网络项', index, '的显示样式');
    item.style.display = 'flex';
    item.style.visibility = 'visible';
    item.style.opacity = '1';
    item.style.width = '100%';
  });
  
  // 检查并修复缺失的数据
  fixMissingDataInSections();
}

// 修复区域中缺失的数据
function fixMissingDataInSections() {
  console.log('修复区域中缺失的数据...');
  
  // 检查效率条值
  const barValues = document.querySelectorAll('.bar-value');
  barValues.forEach(function(value, index) {
    if (!value.textContent || value.textContent.trim() === '') {
      const values = ['88%', '95%', '91%'];
      value.textContent = values[index] || '0%';
      console.log('设置默认效率条值:', value.textContent);
    }
  });
  
  // 检查资源使用率
  const resourceUsages = document.querySelectorAll('.resource-usage');
  resourceUsages.forEach(function(usage, index) {
    if (!usage.textContent || usage.textContent.trim() === '') {
      const values = ['使用率: 76%', '使用率: 82%', '使用率: 69%'];
      usage.textContent = values[index] || '使用率: 0%';
      console.log('设置默认资源使用率:', usage.textContent);
    }
  });
  
  // 检查性能指标值
  const performanceValues = document.querySelectorAll('.system-overview .performance-section .metric-value');
  performanceValues.forEach(function(value, index) {
    if (!value.textContent || value.textContent.trim() === '') {
      const values = ['45%', '62%', '38%'];
      value.textContent = values[index] || '0%';
      console.log('设置默认性能指标值:', value.textContent);
    }
  });
  
  // 检查网络状态值
  const networkValues = document.querySelectorAll('.network-value');
  networkValues.forEach(function(value, index) {
    if (!value.textContent || value.textContent.trim() === '') {
      const values = ['延迟: 2ms', '延迟: 15ms', '45% / 100Mbps'];
      value.textContent = values[index] || '正常';
      console.log('设置默认网络状态值:', value.textContent);
    }
  });
}

// 强制显示图表
function forceShowCharts() {
  console.log('强制显示图表...');
  
  // 强制显示资源利用率图表
  if (elements.resourceUtilizationChart) {
    console.log('设置资源利用率图表容器样式');
    elements.resourceUtilizationChart.style.display = 'block';
    elements.resourceUtilizationChart.style.visibility = 'visible';
    elements.resourceUtilizationChart.style.opacity = '1';
    elements.resourceUtilizationChart.style.width = '100%';
    elements.resourceUtilizationChart.style.minHeight = '200px';
    
    // 如果图表还没有初始化，尝试重新初始化
    if (!charts.resourceUtilization) {
      console.log('资源利用率图表未初始化，尝试重新初始化');
      setTimeout(function() {
        initResourceUtilizationChart();
      }, 200);
    } else {
      console.log('资源利用率图表已存在，强制重新渲染');
      setTimeout(function() {
        if (charts.resourceUtilization) {
          charts.resourceUtilization.resize();
          charts.resourceUtilization.setOption(charts.resourceUtilization.getOption(), true);
        }
      }, 200);
    }
  }
  
  // 强制显示收入分析图表
  if (elements.revenueChart) {
    console.log('设置收入分析图表容器样式');
    elements.revenueChart.style.display = 'block';
    elements.revenueChart.style.visibility = 'visible';
    elements.revenueChart.style.opacity = '1';
    elements.revenueChart.style.width = '100%';
    elements.revenueChart.style.minHeight = '200px';
    
    // 如果图表还没有初始化，尝试重新初始化
    if (!charts.revenue) {
      console.log('收入分析图表未初始化，尝试重新初始化');
      setTimeout(function() {
        initRevenueChart();
      }, 200);
    } else {
      console.log('收入分析图表已存在，强制重新渲染');
      setTimeout(function() {
        if (charts.revenue) {
          charts.revenue.resize();
          charts.revenue.setOption(charts.revenue.getOption(), true);
        }
      }, 200);
    }
  }
}

// 更新运营数据看板
function updateOperationalDashboard() {
  if (elements.efficiencyScore) {
    const efficiency = (Math.random() * 10 + 88).toFixed(1);
    elements.efficiencyScore.textContent = efficiency + '%';
  }
  
  // 更新效率条
  const efficiencyBars = document.querySelectorAll('.efficiency-bar .bar-fill');
  const departmentRanges = {
    '急诊科': [85, 95],
    '内科': [90, 98],
    '外科': [88, 96],
    '妇产科': [82, 92],
    '儿科': [88, 96],
    '骨科': [85, 94],
    '心内科': [90, 97]
  };
  
  efficiencyBars.forEach(function(bar) {
    const barLabel = bar.parentElement.previousElementSibling;
    const departmentName = barLabel ? barLabel.textContent.trim() : '';
    let newWidth;
    
    if (departmentRanges[departmentName]) {
      const range = departmentRanges[departmentName];
      newWidth = Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
    } else {
      newWidth = Math.floor(Math.random() * 20 + 80);
    }
    
    bar.style.width = newWidth + '%';
    const valueSpan = bar.parentElement.nextElementSibling;
    if (valueSpan) {
      valueSpan.textContent = newWidth + '%';
    }
  });
  
  // 更新资源使用率
  const resourceItems = document.querySelectorAll('.resource-usage');
  resourceItems.forEach(function(item) {
    const newUsage = Math.floor(Math.random() * 30 + 60);
    item.textContent = '使用率: ' + newUsage + '%';
  });
}

// 更新性能监控
function updatePerformanceMonitoring() {
  // 更新CPU使用率
  const cpuBar = document.querySelector('.bar-fill.cpu');
  if (cpuBar) {
    const cpuUsage = Math.floor(Math.random() * 40 + 30);
    cpuBar.style.width = cpuUsage + '%';
    const cpuValue = cpuBar.parentElement.nextElementSibling;
    if (cpuValue) {
      cpuValue.textContent = cpuUsage + '%';
    }
  }
  
  // 更新内存使用率
  const memoryBar = document.querySelector('.bar-fill.memory');
  if (memoryBar) {
    const memoryUsage = Math.floor(Math.random() * 30 + 50);
    memoryBar.style.width = memoryUsage + '%';
    const memoryValue = memoryBar.parentElement.nextElementSibling;
    if (memoryValue) {
      memoryValue.textContent = memoryUsage + '%';
    }
  }
  
  // 更新磁盘使用率
  const diskBar = document.querySelector('.bar-fill.disk');
  if (diskBar) {
    const diskUsage = Math.floor(Math.random() * 20 + 30);
    diskBar.style.width = diskUsage + '%';
    const diskValue = diskBar.parentElement.nextElementSibling;
    if (diskValue) {
      diskValue.textContent = diskUsage + '%';
    }
  }
  
  // 更新网络延迟
  const networkValues = document.querySelectorAll('.network-value');
  networkValues.forEach(function(item) {
    if (item.textContent.includes('延迟')) {
      const latency = Math.floor(Math.random() * 10 + 1);
      item.textContent = '延迟: ' + latency + 'ms';
    } else if (item.textContent.includes('带宽')) {
      const bandwidth = Math.floor(Math.random() * 30 + 30);
      item.textContent = bandwidth + '% / 100Mbps';
    }
  });
}

// 过滤告警列表
function filterAlerts(type) {
  const alertItems = document.querySelectorAll('.alert-item');

  alertItems.forEach(function(item) {
    if (type === 'all' || item.classList.contains(type)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// 更新图表周期
function updateChartPeriod(period) {
  console.log('更新图表周期:', period);
  
  // 根据周期更新资源利用率图表数据
  if (charts.resourceUtilization) {
    const option = charts.resourceUtilization.getOption();
    
    // 根据周期生成不同的数据
    let xAxisData, seriesData;
    
    switch (period) {
      case 'day':
        xAxisData = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
        seriesData = [120, 80, 200, 350, 280, 150];
        break;
      case 'week':
        xAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        seriesData = [1200, 1350, 1100, 1450, 1600, 800, 600];
        break;
      case 'month':
        xAxisData = ['第1周', '第2周', '第3周', '第4周'];
        seriesData = [4800, 5200, 4600, 5000];
        break;
      default:
        xAxisData = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
        seriesData = [120, 80, 200, 350, 280, 150];
    }
    
    option.xAxis[0].data = xAxisData;
    option.series[0].data = seriesData;
    
    charts.resourceUtilization.setOption(option);
    console.log('资源利用率图表周期已更新为:', period);
  }
}

// 工具函数
function debounce(func, wait) {
  var timeout;
  return function executedFunction() {
    var args = arguments;
    var later = function() {
      clearTimeout(timeout);
      func.apply(null, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #C4A5A5;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    z-index: 10000;
    font-family: inherit;
    font-size: 14px;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
  
  setTimeout(function() {
    if (errorDiv.parentNode) {
      errorDiv.parentNode.removeChild(errorDiv);
    }
  }, 5000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 页面卸载时清理资源
window.addEventListener('beforeunload', function() {
  if (updateTimer) {
    clearInterval(updateTimer);
  }
  
  Object.values(charts).forEach(function(chart) {
    if (chart && chart.dispose) {
      chart.dispose();
    }
  });
});

// 导出函数供外部使用
window.MorandiDashboard = {
  init,
  updateAllData,
  toggleTheme,
  charts
};
