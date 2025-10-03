// 患者流量趋势图表显示模式状态
let patientFlowChartMode = 'day'; // 'day' 或 'month'


// 开发模式配置 - 控制日志输出
const DEBUG_MODE = false; // 生产环境设为false，开发环境设为true

// DOM元素缓存
const domCache = new Map();

// 已记录的缺失元素，避免重复警告
const missingElements = new Set();

/**
 * 防抖函数 - 性能优化
 * @param {Function} func - 需要防抖的函数
 * @param {number} wait - 等待时间(毫秒)
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait = 300) {
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

/**
 * 节流函数 - 性能优化
 * @param {Function} func - 需要节流的函数
 * @param {number} limit - 时间限制(毫秒)
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// performanceMonitor对象已移除（未使用）

/**
 * 获取DOM元素（带缓存）- 优化版本
 * @param {string} id - 元素ID
 * @param {boolean} silent - 是否静默模式（不输出警告）
 * @returns {HTMLElement|null} DOM元素
 */
function getCachedElement(id, silent = false) {
    if (!id) {
        if (DEBUG_MODE && !silent) {
            console.warn('getCachedElement: 元素ID为空');
        }
        return null;
    }
    
    if (!domCache.has(id)) {
        const element = document.getElementById(id);
        if (!element) {
            // 只在开发模式且未记录过时才警告
            if (DEBUG_MODE && !silent && !missingElements.has(id)) {
                console.warn(`getCachedElement: 未找到元素 #${id}`);
                missingElements.add(id);
            }
        }
        domCache.set(id, element);
    }
    return domCache.get(id);
}

// getCachedElements函数已移除（未使用）

// 时间显示更新 - 优化DOM查询，添加星期显示
function updateTime() {
    const now = new Date();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    
    const timeString = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const currentTimeEl = getCachedElement('current-time');
    if (currentTimeEl) currentTimeEl.textContent = `${timeString} ${weekday}`;
}

// 确保所有数据元素可见
function ensureElementsVisible() {
    const elements = document.querySelectorAll('.metric-item, .department-item, .quality-item');
    elements.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.style.visibility = 'visible';
        element.style.display = 'block';
    });
}



// 更新数据
// 数据验证工具
const dataValidator = {
    // 验证数值范围
    validateRange(value, min, max, defaultValue = 0) {
        const num = parseFloat(value);
        if (isNaN(num)) return defaultValue;
        return Math.max(min, Math.min(max, num));
    },
    
    // 验证百分比
    validatePercentage(value, defaultValue = 0) {
        return this.validateRange(value, 0, 100, defaultValue);
    },
    
    // 验证货币格式
    validateCurrency(value, defaultValue = 0) {
        const num = parseFloat(value.toString().replace(/[¥,]/g, ''));
        return isNaN(num) ? defaultValue : Math.max(0, num);
    },
    
    // 验证整数
    validateInteger(value, min = 0, defaultValue = 0) {
        const num = parseInt(value.toString().replace(/,/g, ''));
        return isNaN(num) ? defaultValue : Math.max(min, Math.floor(num));
    }
};

// 错误消息显示
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(244, 67, 54, 0.9);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    // 3秒后自动移除
    safeSetTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 3000);
}

function updateData() {
    try {
        // 数据更新通过各个专门的函数处理
    
    // 图表数据更新已整合到其他函数中
    
    // 更新详细运营数据
    updateDetailedMetrics();
    
    // 更新趋势数据
    updateTrends();
    
    // 更新科室数据
    updateDepartmentData();
    
    // 更新质量指标
    updateQualityMetrics();
    
    // 确保所有元素可见
    ensureElementsVisible();
    
    } catch (error) {
        if (DEBUG_MODE) console.error('更新数据时发生错误:', error);
        showErrorMessage('数据更新失败，请刷新页面重试');
    }
}

// 等待时间图表相关代码已移除（HTML中不存在对应元素）

// 安全的图表更新函数 - 增强错误处理
function safeChartUpdate(chartInstance, option, chartName = '未知图表') {
    if (!chartInstance) {
        if (DEBUG_MODE) {
            console.warn(`safeChartUpdate: ${chartName} 实例不存在`);
        }
        return false;
    }
    
    if (typeof chartInstance.setOption !== 'function') {
        if (DEBUG_MODE) {
            console.error(`safeChartUpdate: ${chartName} 的 setOption 方法不可用`);
        }
        return false;
    }
    
    try {
        chartInstance.setOption(option, true); // 使用 notMerge 选项以提升性能
        return true;
    } catch (error) {
        if (DEBUG_MODE) {
            console.error(`safeChartUpdate: ${chartName} 更新失败:`, error);
        }
        return false;
    }
}

/**
 * 安全的图表初始化函数
 * @param {string} elementId - 图表容器ID
 * @param {string} chartName - 图表名称
 * @returns {Object|null} ECharts实例或null
 */
function safeChartInit(elementId, chartName = '未知图表') {
    try {
        const element = getCachedElement(elementId, true); // 静默模式
        if (!element) {
            if (DEBUG_MODE) {
                console.error(`safeChartInit: ${chartName} 容器元素 #${elementId} 不存在`);
            }
            return null;
        }
        
        if (typeof echarts === 'undefined' || typeof echarts.init !== 'function') {
            console.error('safeChartInit: ECharts 库未正确加载');
            return null;
        }
        
        return echarts.init(element);
    } catch (error) {
        console.error(`safeChartInit: 初始化 ${chartName} 时出错:`, error);
        return null;
    }
}

// updateChartsData函数已移除（内容已清空）

// 更新详细运营指标
/**
 * 更新收入指标
 * 生成随机收入数据并更新页面显示
 */
function updateRevenueMetrics() {
    try {
        const dailyRevenue = Math.floor(Math.random() * 500000) + 2000000;
        const revenueComparison = (Math.random() * 20 - 5).toFixed(1);
        
        const dailyRevenueEl = getCachedElement('daily-revenue');
        const revenueComparisonElement = getCachedElement('revenue-comparison');
        
        if (dailyRevenueEl) dailyRevenueEl.textContent = '¥' + dailyRevenue.toLocaleString();
        if (revenueComparisonElement) {
            revenueComparisonElement.textContent = (revenueComparison > 0 ? '+' : '') + revenueComparison + '%';
            revenueComparisonElement.className = 'comparison-value ' + (revenueComparison > 0 ? 'up' : 'down');
        }
    } catch (error) {
        console.error('更新收入指标时出错:', error);
    }
}

/**
 * 更新患者流量指标
 * 生成随机患者数据并更新页面显示
 */
// updatePatientMetrics函数已移除（HTML中不存在对应元素）

/**
 * 更新详细运营指标
 * 调用各个子函数更新不同的指标数据
 */
function updateDetailedMetrics() {
    updateRevenueMetrics();
    updatePatientFlowChart();
    updateStaffMetrics();
    updateEquipmentAndAppointmentData();
}

// 更新患者流量图表
function updatePatientFlowChart() {
    if (window.patientFlowChart && typeof window.patientFlowChart.setOption === 'function' && patientFlowChartMode === 'day') {
        const currentData = [45, 23, 156, 234, 189, 78].map(val => val + Math.floor(Math.random() * 20 - 10));
        const lastYearData = [38, 45, 142, 198, 165, 89].map(val => val + Math.floor(Math.random() * 15 - 8));
        const lastMonthData = [42, 28, 148, 215, 172, 85].map(val => val + Math.floor(Math.random() * 18 - 9));
        
        window.patientFlowChart.setOption({
            series: [
                { data: currentData },
                { data: lastYearData },
                { data: lastMonthData }
            ]
        });
    }
}

// 更新医护人员指标 - 优化DOM查询
function updateStaffMetrics() {
    const staffOnDuty = Math.floor(Math.random() * 100) + 1200;
    const attendanceRate = (Math.random() * 5 + 95).toFixed(1);
    
    const staffOnDutyEl = getCachedElement('staff-on-duty');
    const attendanceRateEl = getCachedElement('attendance-rate');
    
    if (staffOnDutyEl) staffOnDutyEl.textContent = staffOnDuty.toLocaleString();
    if (attendanceRateEl) attendanceRateEl.textContent = attendanceRate + '%';
}

// 更新药品库存指标 - 优化DOM查询
// updateMedicationMetrics函数已移除（HTML中不存在对应元素）

// updateEfficiencyMetrics函数已移除（HTML中不存在对应元素）

// 更新设备状态和预约管理数据
function updateEquipmentAndAppointmentData() {
    // 检查设备 - 使用缓存优化
    const equipmentUsage = Math.floor(Math.random() * 30) + 70;
    const faultyEquipment = Math.floor(Math.random() * 8) + 1;
    
    const equipmentUsageEl = getCachedElement('equipment-usage');
    const faultyElement = getCachedElement('faulty-equipment');
    
    if (equipmentUsageEl) equipmentUsageEl.textContent = equipmentUsage + '%';
    if (faultyElement) {
        faultyElement.textContent = faultyEquipment + '台';
        faultyElement.className = 'comparison-value ' + (faultyEquipment > 5 ? 'warning' : 'normal');
    }
    
    // 预约管理 - 使用缓存优化
    const appointmentCount = Math.floor(Math.random() * 500) + 2000;
    const cancellationRate = (Math.random() * 5 + 2).toFixed(1);
    
    const appointmentCountEl = getCachedElement('appointment-count');
    const cancellationElement = getCachedElement('cancellation-rate');
    
    if (appointmentCountEl) appointmentCountEl.textContent = appointmentCount.toLocaleString();
    if (cancellationElement) {
        cancellationElement.textContent = cancellationRate + '%';
        cancellationElement.className = 'comparison-value ' + (cancellationRate > 4 ? 'warning' : 'down');
    }
}

// 更新趋势数据
function updateTrends() {
    const trends = ['up', 'down', 'stable'];
    const trendElements = document.querySelectorAll('.metric-trend');
    
    trendElements.forEach(element => {
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        const randomValue = (Math.random() * 15).toFixed(1);
        
        element.className = `metric-trend ${randomTrend}`;
        
        switch(randomTrend) {
            case 'up':
                element.textContent = `↗ +${randomValue}%`;
                break;
            case 'down':
                element.textContent = `↘ -${randomValue}%`;
                break;
            case 'stable':
                element.textContent = '→ 0%';
                break;
        }
    });
}

// 更新科室数据
function updateDepartmentData() {
    const departments = [
        { name: '内科', patients: [400, 500], beds: [80, 120] },
        { name: '外科', patients: [200, 280], beds: [40, 80] },
        { name: '急诊科', patients: [70, 100], beds: [10, 15] },
        { name: '儿科', patients: [130, 180], beds: [20, 40] },
        { name: '妇产科', patients: [60, 90], beds: [12, 25] },
        { name: '骨科', patients: [100, 150], beds: [25, 35] }
    ];
    
    const departmentItems = document.querySelectorAll('.department-item');
    
    departmentItems.forEach((item, index) => {
        if (index < departments.length) {
            const dept = departments[index];
            const patients = Math.floor(Math.random() * (dept.patients[1] - dept.patients[0])) + dept.patients[0];
            const occupiedBeds = Math.floor(Math.random() * (dept.beds[1] - dept.beds[0])) + dept.beds[0];
            const totalBeds = dept.beds[1];
            
            const patientsSpan = item.querySelector('.dept-patients');
            const bedsSpan = item.querySelector('.dept-beds');
            const statusSpan = item.querySelector('.department-status');
            
            if (patientsSpan) patientsSpan.textContent = `患者: ${patients}`;
            if (bedsSpan) bedsSpan.textContent = `床位: ${occupiedBeds}/${totalBeds}`;
            
            // 更新状态
            const occupancyRate = occupiedBeds / totalBeds;
            if (occupancyRate > 0.9) {
                statusSpan.textContent = '繁忙';
                statusSpan.className = 'department-status busy';
            } else if (occupancyRate > 0.8) {
                statusSpan.textContent = '紧急';
                statusSpan.className = 'department-status urgent';
            } else {
                statusSpan.textContent = '正常';
                statusSpan.className = 'department-status normal';
            }
        }
    });
}

// 更新质量指标 - 优化DOM查询
function updateQualityMetrics() {
    const infectionRate = (Math.random() * 0.5 + 0.5).toFixed(1);
    const readmissionRate = (Math.random() * 2 + 2).toFixed(1);
    const avgStay = (Math.random() * 2 + 6).toFixed(1);
    const safetyScore = (Math.random() * 2 + 97).toFixed(1);
    
    const infectionRateEl = getCachedElement('infection-rate');
    const readmissionRateEl = getCachedElement('readmission-rate');
    const avgStayEl = getCachedElement('avg-stay');
    const safetyScoreEl = getCachedElement('safety-score');
    
    if (infectionRateEl) infectionRateEl.textContent = infectionRate + '%';
    if (readmissionRateEl) readmissionRateEl.textContent = readmissionRate + '%';
    if (avgStayEl) avgStayEl.textContent = avgStay + '天';
    if (safetyScoreEl) safetyScoreEl.textContent = safetyScore;
}

// 更新实时监控数据 - 优化DOM查询
function updateMonitoringData() {
    updateHospitalMetrics();
    updateNetworkMetrics();
    updateStatusIndicators();
    ensureElementsVisible();
}

// 更新医院指标
function updateHospitalMetrics() {
    const hospitalLoad = Math.floor(Math.random() * 30) + 70;
    const powerConsumption = (Math.random() * 20 + 35).toFixed(1);
    
    const hospitalLoadEl = getCachedElement('hospital-load');
    const powerConsumptionEl = getCachedElement('power-consumption');
    if (hospitalLoadEl) hospitalLoadEl.textContent = hospitalLoad + '%';
    if (powerConsumptionEl) powerConsumptionEl.textContent = powerConsumption + 'kW';
    
    updateHospitalLoadStatus(hospitalLoad);
    updatePowerStatus(powerConsumption);
}

// 更新医院负荷状态
function updateHospitalLoadStatus(hospitalLoad) {
    const hospitalLoadStatus = getCachedElement('hospital-load-status');
    if (!hospitalLoadStatus) return;
    
    let status;
    let className;
    
    if (hospitalLoad > 85) {
        status = '高负荷';
        className = 'comparison-value warning';
    } else if (hospitalLoad > 70) {
        status = '正常';
        className = 'comparison-value normal';
    } else {
        status = '低负荷';
        className = 'comparison-value normal';
    }
    
    hospitalLoadStatus.textContent = status;
    hospitalLoadStatus.className = className;
}

// 更新功耗状态
function updatePowerStatus(powerConsumption) {
    const powerStatus = getCachedElement('power-status');
    if (!powerStatus) return;
    
    const powerValue = parseFloat(powerConsumption);
    let status;
    let className;
    
    if (powerValue > 50) {
        status = '高功耗';
        className = 'comparison-value warning';
    } else if (powerValue > 35) {
        status = '正常';
        className = 'comparison-value normal';
    } else {
        status = '低功耗';
        className = 'comparison-value normal';
    }
    
    powerStatus.textContent = status;
    powerStatus.className = className;
}

// 更新网络指标
function updateNetworkMetrics() {
    const uploadSpeed = Math.floor(Math.random() * 50) + 100;
    const downloadSpeed = Math.floor(Math.random() * 200) + 800;
    const onlineDevices = Math.floor(Math.random() * 100) + 2300;
    const networkLatency = Math.floor(Math.random() * 10) + 8;
    
    const uploadSpeedEl = getCachedElement('upload-speed');
    const downloadSpeedEl = getCachedElement('download-speed');
    const onlineDevicesEl = getCachedElement('online-devices');
    const networkLatencyEl = getCachedElement('network-latency');
    
    if (uploadSpeedEl) uploadSpeedEl.textContent = uploadSpeed + ' Mbps';
    if (downloadSpeedEl) downloadSpeedEl.textContent = downloadSpeed + ' Mbps';
    if (onlineDevicesEl) onlineDevicesEl.textContent = onlineDevices.toLocaleString();
    if (networkLatencyEl) networkLatencyEl.textContent = networkLatency + 'ms';
}

// 更新状态指示器
function updateStatusIndicators() {
    const statusItems = document.querySelectorAll('.status-item');
    const statusTexts = [
        '系统运行正常', '部分科室繁忙', '设备运行良好', '库存充足',
        '网络连接正常', '电力供应稳定', '环境监控正常', '安全系统在线'
    ];
    const statusTypes = ['normal', 'warning', 'error'];
    
    statusItems.forEach((item, index) => {
        const icon = item.querySelector('.status-icon');
        const text = item.querySelector('.status-text');
        
        // 随机更新状态
        if (Math.random() < 0.1) { // 10%概率更新状态
            const randomType = statusTypes[Math.floor(Math.random() * statusTypes.length)];
            const randomText = statusTexts[Math.floor(Math.random() * statusTexts.length)];
            
            icon.className = 'status-icon ' + randomType;
            
            switch(randomType) {
                case 'normal':
                    icon.textContent = '🟢';
                    break;
                case 'warning':
                    icon.textContent = '🟡';
                    break;
                case 'error':
                    icon.textContent = '🔴';
                    break;
            }
            
            text.textContent = randomText;
        }
    });
}

// 检查ECharts是否可用
function checkEChartsAvailable() {
    if (typeof echarts === 'undefined') {
        if (DEBUG_MODE) console.error('ECharts 库未加载');
        return false;
    }
    if (typeof echarts.init !== 'function') {
        if (DEBUG_MODE) console.error('echarts.init 方法不可用');
        return false;
    }
    return true;
}

// 性能优化配置
function getPerformanceOptimizedConfig() {
    return {
        animation: false,
        animationDuration: 0,
        animationEasing: 'linear',
        // 禁用不必要的交互效果
        brush: {
            enabled: false
        },
        // 优化渲染性能
        progressive: 1000,
        progressiveThreshold: 3000
    };
}

// 定时器管理 - 改进内存管理
const activeTimers = new Set();
const activeIntervals = new Set();

// 安全的setTimeout包装器
function safeSetTimeout(callback, delay) {
    const id = setTimeout(() => {
        activeTimers.delete(id);
        callback();
    }, delay);
    activeTimers.add(id);
    return id;
}

// 安全的setInterval包装器
function safeSetInterval(callback, delay) {
    const id = setInterval(callback, delay);
    activeIntervals.add(id);
    return id;
}

// 清理定时器和事件监听器 - 优化内存管理
function cleanup() {
    try {
        // 清理所有活跃的定时器
        activeTimers.forEach(id => {
            try {
                clearTimeout(id);
            } catch (error) {
                if (DEBUG_MODE) console.warn('清理setTimeout失败:', error);
            }
        });
        activeTimers.clear();
        
        // 清理所有活跃的间隔器
        activeIntervals.forEach(id => {
            try {
                clearInterval(id);
            } catch (error) {
                if (DEBUG_MODE) console.warn('清理setInterval失败:', error);
            }
        });
        activeIntervals.clear();
        
        // 清理图表实例 - 添加错误处理
        const chartInstances = [
            'patientFlowChart', 'energyChart', 'trafficChart', 'qualityChart',
            'temperatureChart', 'humidityChart', 'airQualityChart', 'powerChart',
            'networkChart', 'revenueChart', 'equipmentStatusChart'
        ];
        
        chartInstances.forEach(chartName => {
            try {
                if (window[chartName] && typeof window[chartName].dispose === 'function') {
                    window[chartName].dispose();
                    window[chartName] = null;
                }
            } catch (error) {
                if (DEBUG_MODE) console.warn(`清理图表 ${chartName} 失败:`, error);
            }
        });
        
        // 清理DOM缓存
        domCache.clear();
        
        // 清理缺失元素记录
        missingElements.clear();
        
        // 清理事件监听器
        if (window.resizeHandler) {
            window.removeEventListener('resize', window.resizeHandler);
            window.resizeHandler = null;
        }
        
    } catch (error) {
        if (DEBUG_MODE) {
            console.error('清理资源时发生错误:', error);
        }
    }
}

// chartLazyLoader对象已移除（未使用）

// 患者流量图表配置
function getPatientFlowOption() {
    return {
        ...getPerformanceOptimizedConfig(),
        backgroundColor: 'transparent',
        textStyle: { color: '#ffffff' },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00ffff',
            textStyle: { color: '#ffffff' }
        },
        legend: {
            data: ['当日患者', '去年同期', '上月同期'],
            textStyle: { color: '#ffffff' }
        },
        grid: {
            left: '3%', right: '4%', bottom: '3%', top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            axisLine: { lineStyle: { color: '#ffffff' } },
            axisLabel: { color: '#ffffff' }
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#ffffff' } },
            axisLabel: { color: '#ffffff' },
            splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        series: [
            {
                name: '当日患者', type: 'line',
                data: [45, 23, 156, 234, 189, 78], smooth: true,
                itemStyle: { color: '#00e5ff' },
                lineStyle: { color: '#00e5ff', width: 3 },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(0, 229, 255, 0.3)' },
                        { offset: 1, color: 'rgba(0, 229, 255, 0.05)' }
                    ])
                }
            },
            {
                name: '去年同期', type: 'line',
                data: [38, 45, 142, 198, 165, 89], smooth: true,
                itemStyle: { color: '#ff6b6b' },
                lineStyle: { color: '#ff6b6b', width: 2 }
            },
            {
                name: '上月同期', type: 'line',
                data: [42, 28, 148, 215, 172, 85], smooth: true,
                itemStyle: { color: '#4ecdc4' },
                lineStyle: { color: '#4ecdc4', width: 2 }
            }
        ]
    };
}

// 患者流量图表切换选项
function getPatientFlowToggleOption(period) {
    const baseConfig = {
        backgroundColor: 'transparent',
        textStyle: { color: '#ffffff' },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00ffff',
            textStyle: { color: '#ffffff' }
        },
        grid: {
            left: '3%', right: '4%', bottom: '3%', top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category', boundaryGap: false,
            axisLine: { lineStyle: { color: '#ffffff' } },
            axisLabel: { color: '#ffffff' }
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#ffffff' } },
            axisLabel: { color: '#ffffff' },
            splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
        }
    };

    if (period === 'day') {
        return {
            ...baseConfig,
            legend: { data: ['今日', '昨日', '上周同日'], textStyle: { color: '#ffffff' } },
            xAxis: { ...baseConfig.xAxis, data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'] },
            series: [
                { name: '今日', type: 'line', data: [12, 8, 5, 15, 45, 78, 95, 88, 76, 65, 42, 28], smooth: true, itemStyle: { color: '#00e5ff' }, lineStyle: { color: '#00e5ff', width: 3 }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(0, 229, 255, 0.3)' }, { offset: 1, color: 'rgba(0, 229, 255, 0.05)' }]) } },
                { name: '昨日', type: 'line', data: [10, 6, 8, 18, 42, 82, 89, 85, 72, 68, 45, 32], smooth: true, itemStyle: { color: '#ff6b6b' }, lineStyle: { color: '#ff6b6b', width: 2 } },
                { name: '上周同日', type: 'line', data: [15, 12, 10, 20, 48, 75, 92, 90, 78, 70, 50, 35], smooth: true, itemStyle: { color: '#4ecdc4' }, lineStyle: { color: '#4ecdc4', width: 2 } }
            ]
        };
    } else {
        const monthData = Array.from({length: 30}, () => Math.floor(Math.random() * 200) + 300);
        const lastMonthData = Array.from({length: 30}, () => Math.floor(Math.random() * 180) + 280);
        const lastYearData = Array.from({length: 30}, () => Math.floor(Math.random() * 160) + 250);
        
        return {
            ...baseConfig,
            legend: { data: ['本月', '上月', '去年同月'], textStyle: { color: '#ffffff' } },
            xAxis: { ...baseConfig.xAxis, data: Array.from({length: 30}, (_, i) => `${i + 1}日`), axisLabel: { color: '#ffffff', interval: 4, rotate: 45 } },
            yAxis: { ...baseConfig.yAxis, min: 200, max: 600, axisLabel: { color: '#ffffff', formatter: value => value + '人' } },
            series: [
                { name: '本月', type: 'line', data: monthData, smooth: true, itemStyle: { color: '#00e5ff' }, lineStyle: { color: '#00e5ff', width: 3 }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(0, 229, 255, 0.3)' }, { offset: 1, color: 'rgba(0, 229, 255, 0.05)' }]) } },
                { name: '上月', type: 'line', data: lastMonthData, smooth: true, itemStyle: { color: '#ff6b6b' }, lineStyle: { color: '#ff6b6b', width: 2 } },
                { name: '去年同月', type: 'line', data: lastYearData, smooth: true, itemStyle: { color: '#4ecdc4' }, lineStyle: { color: '#4ecdc4', width: 2 } }
            ]
        };
    }
}

// 初始化患者流量图表
function initPatientFlowChart() {
    const element = document.getElementById('patientFlowChart');
    if (!element) return;
    
    window.patientFlowChart = echarts.init(element);
    window.patientFlowChart.setOption(getPatientFlowOption());
    
    // 绑定切换事件
    const toggleButtons = document.querySelectorAll('.chart-container-small:nth-child(1) .chart-toggle .toggle-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const period = this.getAttribute('data-period');
            patientFlowChartMode = period;
            
            if (window.patientFlowChart) {
                window.patientFlowChart.setOption(getPatientFlowToggleOption(period), true);
            }
        });
    });
}

// 初始化图表 - 优化性能
function initCharts() {
    try {
        if (!checkEChartsAvailable()) return;
        
        initPatientFlowChart();
        initEnergyChart();
        initOtherCharts();
        initResizeHandler();
    } catch (error) {
        if (DEBUG_MODE) console.error('图表初始化错误:', error);
    }
}

// 能源消耗图表配置
function getEnergyOption() {
    return {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00e5ff',
            textStyle: { color: '#ffffff' }
        },
        legend: {
            data: ['电力', '水', '燃气'],
            textStyle: { color: '#ffffff' }
        },
        grid: {
            left: '3%', right: '4%', bottom: '3%', top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category', boundaryGap: false,
            data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            axisLine: { lineStyle: { color: '#ffffff' } },
            axisLabel: { color: '#ffffff' }
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#ffffff' } },
            axisLabel: { color: '#ffffff' },
            splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        series: [
            {
                name: '电力', type: 'line',
                data: [120, 132, 101, 134, 90, 230],
                itemStyle: { color: '#ff6b6b' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(255, 107, 107, 0.3)' },
                        { offset: 1, color: 'rgba(255, 107, 107, 0.05)' }
                    ])
                }
            },
            {
                name: '水', type: 'line',
                data: [220, 182, 191, 234, 290, 330],
                itemStyle: { color: '#4ecdc4' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(78, 205, 196, 0.3)' },
                        { offset: 1, color: 'rgba(78, 205, 196, 0.05)' }
                    ])
                }
            },
            {
                name: '燃气', type: 'line',
                data: [150, 232, 201, 154, 190, 330],
                itemStyle: { color: '#45b7d1' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(69, 183, 209, 0.3)' },
                        { offset: 1, color: 'rgba(69, 183, 209, 0.05)' }
                    ])
                }
            }
        ]
    };
}

// 初始化能源消耗图表
function initEnergyChart() {
    const element = document.getElementById('energyChart');
    if (!element) return;
    
    window.energyChart = echarts.init(element);
    window.energyChart.setOption(getEnergyOption());
    
    // 绑定切换事件
    const toggleButtons = document.querySelectorAll('.chart-container-small:nth-child(2) .chart-toggle .toggle-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const period = this.getAttribute('data-period');
            if (window.energyChart) {
                const option = period === 'day' ? getEnergyDayOption() : getEnergyMonthOption();
                window.energyChart.setOption(option, true);
            }
        });
    });
}

// 能源图表日/月选项
function getEnergyDayOption() {
    return {
        ...getEnergyOption(),
        xAxis: { ...getEnergyOption().xAxis, data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'] },
        series: [
            { name: '电力', type: 'line', data: [120, 110, 95, 105, 140, 180, 200, 185, 160, 135, 125, 115], itemStyle: { color: '#ff6b6b' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(255, 107, 107, 0.3)' }, { offset: 1, color: 'rgba(255, 107, 107, 0.05)' }]) } },
            { name: '水', type: 'line', data: [220, 200, 180, 190, 240, 280, 300, 285, 260, 235, 225, 215], itemStyle: { color: '#4ecdc4' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(78, 205, 196, 0.3)' }, { offset: 1, color: 'rgba(78, 205, 196, 0.05)' }]) } },
            { name: '燃气', type: 'line', data: [150, 140, 125, 135, 170, 210, 230, 215, 190, 165, 155, 145], itemStyle: { color: '#45b7d1' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(69, 183, 209, 0.3)' }, { offset: 1, color: 'rgba(69, 183, 209, 0.05)' }]) } }
        ]
    };
}

function getEnergyMonthOption() {
    const electricityData = Array.from({length: 30}, () => Math.floor(Math.random() * 100) + 100);
    const waterData = Array.from({length: 30}, () => Math.floor(Math.random() * 120) + 180);
    const gasData = Array.from({length: 30}, () => Math.floor(Math.random() * 80) + 120);
    
    return {
        ...getEnergyOption(),
        xAxis: { ...getEnergyOption().xAxis, data: Array.from({length: 30}, (_, i) => `${i + 1}日`), axisLabel: { color: '#ffffff', interval: 4, rotate: 45 } },
        series: [
            { name: '电力', type: 'line', data: electricityData, itemStyle: { color: '#ff6b6b' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(255, 107, 107, 0.3)' }, { offset: 1, color: 'rgba(255, 107, 107, 0.05)' }]) } },
            { name: '水', type: 'line', data: waterData, itemStyle: { color: '#4ecdc4' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(78, 205, 196, 0.3)' }, { offset: 1, color: 'rgba(78, 205, 196, 0.05)' }]) } },
            { name: '燃气', type: 'line', data: gasData, itemStyle: { color: '#45b7d1' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(69, 183, 209, 0.3)' }, { offset: 1, color: 'rgba(69, 183, 209, 0.05)' }]) } }
        ]
    };
}

// 初始化其他图表
function initOtherCharts() {
    initTrafficChart();
    initQualityChart();
    initGaugeCharts();
    initNetworkChart();
    initRevenueChart();
    initEquipmentChart();
}

// 初始化交通流量图表
function initTrafficChart() {
    const element = document.getElementById('trafficChart');
    if (!element) return;
    
    window.trafficChart = echarts.init(element);
    window.trafficChart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00e5ff',
            textStyle: { color: '#ffffff' }
        },
        legend: {
            orient: 'vertical', left: 'left',
            textStyle: { color: '#ffffff' }
        },
        series: [{
            name: '停车场使用', type: 'pie',
            radius: ['40%', '70%'], center: ['60%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
            label: { show: false, position: 'center' },
            emphasis: { label: { show: true, fontSize: '20', fontWeight: 'bold', color: '#ffffff' } },
            labelLine: { show: false },
            data: [
                { value: 191, name: '已使用', itemStyle: { color: '#ff6b6b' } },
                { value: 54, name: '空闲', itemStyle: { color: '#4ecdc4' } }
            ]
        }]
    });
}

// 初始化质量图表
function initQualityChart() {
    const element = document.getElementById('qualityChart');
    if (!element) return;
    
    window.qualityChart = echarts.init(element);
    window.qualityChart.setOption({
        backgroundColor: 'transparent',
        title: {
            text: '医疗质量趋势',
            textStyle: { color: '#4caf50', fontSize: 14 },
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#4caf50',
            textStyle: { color: '#ffffff' }
        },
        legend: {
            data: ['感染率', '再入院率', '满意度'],
            textStyle: { color: '#ffffff' },
            top: 35, itemGap: 15, itemWidth: 12, itemHeight: 8
        },
        grid: {
            left: '3%', right: '4%', bottom: '3%', top: '25%',
            containLabel: true
        },
        xAxis: {
            type: 'category', boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            axisLine: { lineStyle: { color: '#ffffff' } },
            axisLabel: { color: '#ffffff', fontSize: 10 }
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#ffffff' } },
            axisLabel: { color: '#ffffff', fontSize: 10 },
            splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        series: [
            { name: '感染率', type: 'line', data: [0.8, 0.7, 0.9, 0.6, 0.8, 0.7, 0.8], itemStyle: { color: '#f44336' }, lineStyle: { width: 2 } },
            { name: '再入院率', type: 'line', data: [3.2, 3.5, 3.1, 3.0, 3.3, 3.4, 3.2], itemStyle: { color: '#ff9800' }, lineStyle: { width: 2 } },
            { name: '满意度', type: 'line', data: [96.8, 97.2, 96.5, 97.0, 96.9, 97.1, 96.8], itemStyle: { color: '#4caf50' }, lineStyle: { width: 2 } }
        ]
    });
}

// 初始化仪表盘图表
function initGaugeCharts() {
    initTemperatureChart();
    initHumidityChart();
    initAirQualityChart();
    initPowerChart();
}

// 通用仪表盘配置
function getGaugeConfig(name, value, min, max, formatter) {
    return {
        backgroundColor: 'transparent',
        series: [{
            type: 'gauge',
            startAngle: 180, endAngle: 0,
            center: ['50%', '85%'], radius: '130%',
            min, max, splitNumber: 4,
            axisLine: {
                lineStyle: {
                    width: 5,
                    color: [[0.3, '#4caf50'], [0.7, '#ff9800'], [1, '#f44336']]
                }
            },
            pointer: {
                icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                length: '12%', width: 18,
                offsetCenter: [0, '-60%'],
                itemStyle: { color: '#00ffff' }
            },
            axisTick: { length: 10, lineStyle: { color: 'auto', width: 2 } },
            splitLine: { length: 18, lineStyle: { color: 'auto', width: 4 } },
            axisLabel: {
                color: '#ffffff', fontSize: 9, distance: -60,
                rotate: 'tangential', formatter
            },
            title: { offsetCenter: [0, '-10%'], fontSize: 9, color: '#ffffff' },
            detail: {
                fontSize: 12, offsetCenter: [0, '-35%'],
                valueAnimation: true, formatter: value => formatter(value),
                color: '#00ffff'
            },
            data: [{ value, name }]
        }]
    };
}

function initTemperatureChart() {
    const element = document.getElementById('temperatureChart');
    if (!element) return;
    
    window.temperatureChart = echarts.init(element);
    window.temperatureChart.setOption(getGaugeConfig('温度', 22.5, 0, 40, value => Math.round(value) + '°C'));
}

function initHumidityChart() {
    const element = document.getElementById('humidityChart');
    if (!element) return;
    
    window.humidityChart = echarts.init(element);
    window.humidityChart.setOption(getGaugeConfig('湿度', 58, 0, 100, value => Math.round(value) + '%'));
}

function initAirQualityChart() {
    const element = document.getElementById('airQualityChart');
    if (!element) return;
    
    window.airQualityChart = echarts.init(element);
    window.airQualityChart.setOption(getGaugeConfig('PM2.5', 15, 0, 500, value => Math.round(value)));
}

function initPowerChart() {
    const element = document.getElementById('powerChart');
    if (!element) return;
    
    try {
        window.powerChart = echarts.init(element);
        window.powerChart.setOption(getGaugeConfig('用电', 1245, 800, 1600, value => Math.round(value) + 'kWh'));
    } catch (error) {
        if (DEBUG_MODE) console.error('powerChart 初始化失败:', error);
        window.powerChart = null;
    }
}

// 初始化网络图表
function initNetworkChart() {
    const element = document.getElementById('networkChart');
    if (!element) return;
    
    window.networkChart = echarts.init(element);
    window.networkChart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00ffff',
            textStyle: { color: '#ffffff' }
        },
        legend: {
            data: ['上行', '下行'],
            textStyle: { color: '#ffffff' }, top: 25
        },
        grid: {
            left: '3%', right: '4%', bottom: '3%', top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category', boundaryGap: false,
            data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            axisLine: { lineStyle: { color: '#ffffff' } },
            axisLabel: { color: '#ffffff', fontSize: 10 }
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#ffffff' } },
            axisLabel: { color: '#ffffff', fontSize: 10 },
            splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        series: [
            { name: '上行', type: 'line', data: [120, 132, 101, 134, 90, 230], itemStyle: { color: '#ff9800' }, lineStyle: { width: 2 } },
            { name: '下行', type: 'line', data: [220, 182, 191, 234, 290, 330], itemStyle: { color: '#4caf50' }, lineStyle: { width: 2 } }
        ]
    });
}

// 初始化收入图表
function initRevenueChart() {
    const element = document.getElementById('revenueChart');
    if (!element) return;
    
    window.revenueChart = echarts.init(element);
    window.revenueChart.setOption({
        backgroundColor: 'transparent',
        textStyle: { color: '#ffffff' },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00ffff',
            textStyle: { color: '#ffffff' }
        },
        legend: {
            orient: 'vertical', right: '0%', top: 'center',
            textStyle: { color: '#ffffff', fontSize: 11, fontWeight: 'normal' },
            itemWidth: 10, itemHeight: 10, itemGap: 6
        },
        series: [{
            type: 'pie', radius: ['35%', '65%'], center: ['25%', '50%'],
            data: [
                { value: 45, name: '门诊收入', itemStyle: { color: '#00e5ff' } },
                { value: 30, name: '住院收入', itemStyle: { color: '#4caf50' } },
                { value: 15, name: '检查收入', itemStyle: { color: '#ff9800' } },
                { value: 10, name: '其他收入', itemStyle: { color: '#9c27b0' } }
            ],
            label: { show: false }, labelLine: { show: false },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10, shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 255, 255, 0.5)'
                }
            }
        }]
    });
}

// 初始化设备状态图表
function initEquipmentChart() {
    const element = document.getElementById('equipmentStatusChart');
    if (!element) return;
    
    window.equipmentStatusChart = echarts.init(element);
    window.equipmentStatusChart.setOption({
        backgroundColor: 'transparent',
        textStyle: { color: '#ffffff' },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00ffff',
            textStyle: { color: '#ffffff' }
        },
        legend: {
            orient: 'vertical', right: '0%', top: 'center',
            textStyle: { color: '#ffffff', fontSize: 11, fontWeight: 'normal' },
            itemWidth: 10, itemHeight: 10, itemGap: 6
        },
        series: [{
            type: 'pie', radius: ['35%', '65%'], center: ['25%', '50%'],
            data: [
                { value: 78, name: '正常运行', itemStyle: { color: '#4caf50' } },
                { value: 15, name: '维护中', itemStyle: { color: '#ff9800' } },
                { value: 5, name: '故障', itemStyle: { color: '#f44336' } },
                { value: 2, name: '待机', itemStyle: { color: '#9e9e9e' } }
            ],
            label: { show: false }, labelLine: { show: false },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10, shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 255, 255, 0.5)'
                }
            }
        }]
    });
}

// 初始化响应式处理
function initResizeHandler() {
    const resizeHandler = throttle(() => {
        const chartInstances = [
            'energyChart', 'patientFlowChart', 'trafficChart', 'qualityChart',
            'temperatureChart', 'humidityChart', 'airQualityChart', 'powerChart',
            'networkChart', 'revenueChart', 'equipmentStatusChart'
        ];
        
        chartInstances.forEach(chartName => {
            try {
                if (window[chartName] && typeof window[chartName].resize === 'function') {
                    window[chartName].resize();
                }
            } catch (error) {
                if (DEBUG_MODE) console.warn(`图表 ${chartName} resize失败:`, error);
            }
        });
    }, 300);
    
    window.addEventListener('resize', resizeHandler);
    window.resizeHandler = resizeHandler;
}

// 系统状态随机更新
function updateSystemStatus() {
    const systemCards = document.querySelectorAll('.system-card');
    systemCards.forEach(card => {
        const statusElement = card.querySelector('.system-status');
        const metricsElements = card.querySelectorAll('.system-metrics span');
        
        // 随机更新状态（90%概率在线）
        if (Math.random() > 0.1) {
            statusElement.textContent = '在线';
            statusElement.className = 'system-status online';
        } else {
            statusElement.textContent = '离线';
            statusElement.className = 'system-status offline';
        }
        
        // 更新部分数据
        if (metricsElements.length > 0) {
            const firstMetric = metricsElements[0];
            if (firstMetric.textContent.includes('摄像头')) {
                const count = Math.floor(Math.random() * 10) + 150;
                firstMetric.textContent = `摄像头: ${count}个`;
            } else if (firstMetric.textContent.includes('停车场')) {
                const count = Math.floor(Math.random() * 20) + 240;
                firstMetric.textContent = `停车场: ${count}个车位`;
            } else if (firstMetric.textContent.includes('门禁点')) {
                const count = Math.floor(Math.random() * 10) + 85;
                firstMetric.textContent = `门禁点: ${count}个`;
            }
        }
    });
}

// 添加新的告警
function addNewAlert() {
    const alertList = document.querySelector('.alert-list');
    const alerts = [
        { type: 'warning', content: '系统负载过高', time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) },
        { type: 'info', content: '定期维护提醒', time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) },
        { type: 'success', content: '数据同步完成', time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }
    ];
    
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    const alertItem = document.createElement('div');
    alertItem.className = `alert-item ${randomAlert.type}`;
    alertItem.innerHTML = `
        <span class="alert-time">${randomAlert.time}</span>
        <span class="alert-content">${randomAlert.content}</span>
    `;
    
    alertList.insertBefore(alertItem, alertList.firstChild);
    
    // 保持最多5条告警
    if (alertList.children.length > 5) {
        alertList.removeChild(alertList.lastChild);
    }
}

// 主题模式管理
class ThemeModeManager {
    constructor() {
        this.isDarkMode = false;
        this.init();
    }

    init() {
        // 从本地存储加载保存的模式
        const savedMode = localStorage.getItem('dashboard-theme-mode');
        if (savedMode === 'dark') {
            this.isDarkMode = true;
        }
        
        // 应用当前模式
        this.applyMode();
        
        // 绑定事件监听器
        this.bindEvents();
    }

    bindEvents() {
        const themeToggleBtn = document.getElementById('theme-toggle');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                this.toggleMode();
            });
        }
    }

    toggleMode() {
        this.isDarkMode = !this.isDarkMode;
        this.applyMode();
        
        // 保存到本地存储
        const modeValue = this.isDarkMode ? 'dark' : 'light';
        localStorage.setItem('dashboard-theme-mode', modeValue);
    }

    applyMode() {
        const body = document.body;
        const themeToggleBtn = document.getElementById('theme-toggle');
        const themeIcon = themeToggleBtn?.querySelector('.theme-icon');
        const themeText = themeToggleBtn?.querySelector('.theme-text');

        if (this.isDarkMode) {
            body.classList.add('dark-mode');
            if (themeIcon) themeIcon.textContent = '🌙';
            if (themeText) themeText.textContent = '夜间';
            if (themeToggleBtn) themeToggleBtn.classList.add('active');
        } else {
            body.classList.remove('dark-mode');
            if (themeIcon) themeIcon.textContent = '☀️';
            if (themeText) themeText.textContent = '白天';
            if (themeToggleBtn) themeToggleBtn.classList.remove('active');
        }

        // 图表颜色更新功能已移除
    }
}







// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    try {
        // 初始化主题模式管理器
        window.themeModeManager = new ThemeModeManager();
        
        
        // 初始化时间显示 - 每秒更新
        updateTime();
        safeSetInterval(updateTime, 1000); // 每秒更新一次
        
        // 延迟初始化图表，确保DOM和ECharts库完全加载
        safeSetTimeout(function() {
            // 检查ECharts是否可用
            if (typeof echarts === 'undefined') {
                safeSetTimeout(function() {
                    initCharts();
                }, 1000);
            } else {
                initCharts();
            }
            
            // 等待时间图表相关代码已移除
        }, 200);
        
        // 定期更新数据 - 优化：减少更新频率以提升性能
        safeSetInterval(updateData, 10000); // 从5秒改为10秒
        safeSetInterval(updateSystemStatus, 20000); // 从10秒改为20秒
        safeSetInterval(updateMonitoringData, 8000); // 从3秒改为8秒
        safeSetInterval(addNewAlert, 30000); // 从15秒改为30秒
        
        // 初始数据更新
        updateData();
        updateSystemStatus();
        updateMonitoringData();
        
        // 页面卸载时清理资源
        window.addEventListener('beforeunload', cleanup);
        window.addEventListener('unload', cleanup);
        
        // 确保所有元素可见
        ensureElementsVisible();
        
        // 模态框相关初始化已移除（HTML中不存在对应模态框）
        
        // 初始化无障碍访问性支持
        initAccessibility();
    } catch (error) {
        console.error('初始化过程中发生错误:', error);
        
        // 显示错误信息给用户
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(244, 67, 54, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <h3>系统初始化错误</h3>
            <p>页面加载过程中发生错误，请刷新页面重试。</p>
            <p>错误信息: ${error.message}</p>
            <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: white; color: #f44336; border: none; border-radius: 5px; cursor: pointer;">刷新页面</button>
        `;
        document.body.appendChild(errorDiv);
    }
});

// 处理ESC键关闭模态框
function handleEscapeKey() {
    const modals = document.querySelectorAll('.video-modal, .vehicle-modal');
    modals.forEach(modal => {
        if (modal.style.display !== 'none') {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });
}

// 处理Tab键导航
function handleTabKey(e) {
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
    }
}

// 处理方向键导航图表切换
function handleArrowKeys(e) {
    const activeToggle = document.querySelector('.toggle-btn.active');
    if (!activeToggle) return;
    
    const toggleGroup = activeToggle.parentElement;
    const toggles = Array.from(toggleGroup.querySelectorAll('.toggle-btn'));
    const currentIndex = toggles.indexOf(activeToggle);
    
    let newIndex;
    if (e.key === 'ArrowLeft') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : toggles.length - 1;
    } else {
        newIndex = currentIndex < toggles.length - 1 ? currentIndex + 1 : 0;
    }
    
    toggles[newIndex].click();
    toggles[newIndex].focus();
}

// 无障碍访问性支持
function initAccessibility() {
    // 键盘导航支持
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            handleEscapeKey();
        } else if (e.key === 'Tab') {
            handleTabKey(e);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            handleArrowKeys(e);
        }
    });
    
    // 为图表添加键盘支持
    const chartContainers = document.querySelectorAll('.chart-item');
    chartContainers.forEach(container => {
        container.setAttribute('tabindex', '0');
        container.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // 可以添加图表交互功能
                console.log('图表被激活:', container.id);
            }
        });
    });
    
    
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const group = this.parentElement;
            const buttons = group.querySelectorAll('.toggle-btn');
            buttons.forEach(btn => {
                btn.setAttribute('aria-pressed', btn === this ? 'true' : 'false');
            });
        });
    });
    
    // 主题切换按钮ARIA状态更新
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = document.body.classList.contains('dark-mode');
            this.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            const themeText = this.querySelector('.theme-text');
            if (themeText) {
                themeText.textContent = isDark ? '夜间' : '白天';
            }
        });
    }
}





// 视频监控模态框功能
// initVideoModal函数已移除（HTML中不存在对应模态框）

// 所有模态框相关函数已移除（HTML中不存在对应模态框）


// 页面卸载时清理资源
window.addEventListener('beforeunload', cleanup);
