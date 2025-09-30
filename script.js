// 患者流量趋势图表显示模式状态
let patientFlowChartMode = 'day'; // 'day' 或 'month'

// 手机端导航状态
let currentMobileSection = 0;
let isMobile = window.innerWidth <= 768;

// DOM元素缓存
const domCache = new Map();

/**
 * 获取DOM元素（带缓存）
 * @param {string} id - 元素ID
 * @returns {HTMLElement|null} DOM元素
 */
function getCachedElement(id) {
    if (!domCache.has(id)) {
        domCache.set(id, document.getElementById(id));
    }
    return domCache.get(id);
}

// 时间显示更新
function updateTime() {
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
    const currentTimeEl = document.getElementById('current-time');
    if (currentTimeEl) currentTimeEl.textContent = timeString;
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

// 手机端导航功能
function initMobileNavigation() {
    if (!isMobile) return;
    
    const sections = document.querySelectorAll('[data-section]');
    const navDots = document.querySelectorAll('.nav-dot');
    let startY = 0;
    let currentY = 0;
    let isScrolling = false;
    
    // 导航点点击事件
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            scrollToSection(index);
        });
    });
    
    // 触摸事件处理
    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        isScrolling = true;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (!isScrolling) return;
        currentY = e.touches[0].clientY;
        const deltaY = startY - currentY;
        
        // 如果滑动距离足够大，切换section
        if (Math.abs(deltaY) > 50) {
            if (deltaY > 0 && currentMobileSection < sections.length - 1) {
                // 向上滑动，下一个section
                scrollToSection(currentMobileSection + 1);
            } else if (deltaY < 0 && currentMobileSection > 0) {
                // 向下滑动，上一个section
                scrollToSection(currentMobileSection - 1);
            }
            isScrolling = false;
        }
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
        isScrolling = false;
    }, { passive: true });
    
    // 滚动到指定section
    function scrollToSection(index) {
        if (index < 0 || index >= sections.length) return;
        
        currentMobileSection = index;
        const targetSection = sections[index];
        
        // 更新导航点状态
        navDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // 平滑滚动到目标section
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // 监听滚动事件更新当前section
    let scrollTimeout;
    document.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateCurrentSection();
        }, 100);
    }, { passive: true });
    
    function updateCurrentSection() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
                if (currentMobileSection !== index) {
                    currentMobileSection = index;
                    navDots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === index);
                    });
                }
            }
        });
    }
}

// 手机端快速操作功能
function initMobileQuickActions() {
    if (!isMobile) return;
    
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            
            switch(action) {
                case 'refresh':
                    // 刷新数据
                    updateData();
                    // 添加刷新动画
                    this.style.transform = 'rotate(360deg)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 500);
                    break;
                    
                case 'fullscreen':
                    // 全屏切换
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen().catch(err => {
                            console.log('无法进入全屏模式:', err);
                        });
                    } else {
                        document.exitFullscreen();
                    }
                    break;
                    
                case 'theme':
                    // 切换主题
                    const themeToggle = document.getElementById('theme-toggle');
                    if (themeToggle) {
                        themeToggle.click();
                    }
                    break;
            }
        });
    });
}

// 更新数据
function updateData() {
    // 模拟数据更新
    const patients = Math.floor(Math.random() * 200) + 1200;
    const beds = Math.floor(Math.random() * 20) + 80;
    const emergency = Math.floor(Math.random() * 10) + 20;
    const surgery = Math.floor(Math.random() * 8) + 10;
    const waitingTime = Math.floor(Math.random() * 15) + 20;
    const satisfaction = (Math.random() * 3 + 95).toFixed(1);
    
    // 更新核心指标 - 检查元素是否存在
    const totalPatientsEl = document.getElementById('total-patients');
    const occupiedBedsEl = document.getElementById('occupied-beds');
    const emergencyCasesEl = document.getElementById('emergency-cases');
    const surgeryCountEl = document.getElementById('surgery-count');
    const waitingTimeEl = document.getElementById('waiting-time');
    const satisfactionRateEl = document.getElementById('satisfaction-rate');
    
    if (totalPatientsEl) totalPatientsEl.textContent = patients.toLocaleString();
    if (occupiedBedsEl) occupiedBedsEl.textContent = beds + '%';
    if (emergencyCasesEl) emergencyCasesEl.textContent = emergency;
    if (surgeryCountEl) surgeryCountEl.textContent = surgery;
    if (waitingTimeEl) waitingTimeEl.textContent = waitingTime;
    if (satisfactionRateEl) satisfactionRateEl.textContent = satisfaction + '%';
    
    // 更新图表数据
    updateChartsData();
    
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
}

// 强制重新初始化等待时间图表
function reinitWaitingTimeChart() {
    const waitingTimeElement = document.getElementById('waitingTimeChart');
    if (waitingTimeElement && !window.waitingTimeChart) {
        console.log('重新初始化等待时间图表...');
        window.waitingTimeChart = echarts.init(waitingTimeElement);
        const waitingTimeOption = {
            backgroundColor: 'transparent',
            textStyle: {
                color: '#ffffff'
            },
            grid: {
                left: '15%',
                right: '15%',
                top: '15%',
                bottom: '15%'
            },
            xAxis: {
                type: 'category',
                data: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
                axisLabel: {
                    color: '#ffffff',
                    fontSize: 9
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 50,
                axisLabel: {
                    color: '#ffffff',
                    fontSize: 9
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        type: 'dashed'
                    }
                }
            },
            series: [{
                data: [35, 28, 32, 25, 30, 28],
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: '#ff9800',
                    width: 3
                },
                itemStyle: {
                    color: '#ff9800',
                    borderColor: '#ffffff',
                    borderWidth: 2
                },
                symbol: 'circle',
                symbolSize: 6,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(255, 152, 0, 0.3)' },
                        { offset: 1, color: 'rgba(255, 152, 0, 0.05)' }
                    ])
                }
            }]
        };
        window.waitingTimeChart.setOption(waitingTimeOption);
        console.log('等待时间图表重新初始化完成');
    }
}

// 安全的图表更新函数
function safeChartUpdate(chartInstance, option) {
    if (chartInstance && typeof chartInstance.setOption === 'function') {
        try {
            chartInstance.setOption(option);
            return true;
        } catch (error) {
            console.error('图表更新失败:', error);
            return false;
        }
    }
    return false;
}

// 更新图表数据
function updateChartsData() {
    // 更新就诊人数趋势图
    const newData = Array.from({length: 6}, () => Math.floor(Math.random() * 200) + 50);
    safeChartUpdate(window.patientTrendChart, {
        series: [{
            data: newData
        }]
    });

    // 更新床位使用率仪表盘
    const bedUsage = Math.floor(Math.random() * 30) + 70;
    safeChartUpdate(window.bedUsageGauge, {
        series: [{
            data: [{
                value: bedUsage,
                name: '床位使用率'
            }]
        }]
    });

    // 更新急诊病例柱状图
    const emergencyData = Array.from({length: 4}, () => Math.floor(Math.random() * 10) + 1);
    safeChartUpdate(window.emergencyChart, {
        series: [{
            data: emergencyData
        }]
    });

    // 更新手术数量环形图
    const completed = Math.floor(Math.random() * 8) + 5;
    const ongoing = Math.floor(Math.random() * 5) + 1;
    const pending = Math.floor(Math.random() * 3) + 1;
    safeChartUpdate(window.surgeryChart, {
        series: [{
            data: [
                { value: completed, name: '已完成', itemStyle: { color: '#4caf50' } },
                { value: ongoing, name: '进行中', itemStyle: { color: '#ff9800' } },
                { value: pending, name: '待开始', itemStyle: { color: '#2196f3' } }
            ]
        }]
    });

    // 更新等待时间折线图
    if (!window.waitingTimeChart) {
        reinitWaitingTimeChart();
    }
    const waitingData = Array.from({length: 6}, () => Math.floor(Math.random() * 20) + 15);
    safeChartUpdate(window.waitingTimeChart, {
        series: [{
            data: waitingData,
            type: 'line',
            smooth: true,
            lineStyle: {
                color: '#ff9800',
                width: 3
            },
            itemStyle: {
                color: '#ff9800',
                borderColor: '#ffffff',
                borderWidth: 2
            },
            symbol: 'circle',
            symbolSize: 6,
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(255, 152, 0, 0.3)' },
                    { offset: 1, color: 'rgba(255, 152, 0, 0.05)' }
                ])
            }
        }]
    });

    // 更新满意度雷达图
    const satisfactionData = Array.from({length: 4}, () => Math.floor(Math.random() * 10) + 90);
    safeChartUpdate(window.satisfactionChart, {
        series: [{
            data: [{
                value: satisfactionData
            }]
        }]
    });
}

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
function updatePatientMetrics() {
    try {
        const todayPatients = Math.floor(Math.random() * 300) + 1000;
        const patientComparison = (Math.random() * 15 - 5).toFixed(1);
        
        const todayPatientsEl = getCachedElement('today-patients');
        const patientComparisonEl = getCachedElement('patient-comparison');
        
        if (todayPatientsEl) todayPatientsEl.textContent = todayPatients.toLocaleString();
        if (patientComparisonEl) {
            patientComparisonEl.textContent = (patientComparison > 0 ? '+' : '') + patientComparison + '%';
            patientComparisonEl.className = 'patient-value ' + (patientComparison > 0 ? 'up' : 'down');
        }
    } catch (error) {
        console.error('更新患者流量指标时出错:', error);
    }
}

/**
 * 更新详细运营指标
 * 调用各个子函数更新不同的指标数据
 */
function updateDetailedMetrics() {
    updateRevenueMetrics();
    updatePatientMetrics();
    
    updatePatientFlowChart();
    updateStaffMetrics();
    updateMedicationMetrics();
    updateEfficiencyMetrics();
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

// 更新医护人员指标
function updateStaffMetrics() {
    const staffOnDuty = Math.floor(Math.random() * 100) + 1200;
    const attendanceRate = (Math.random() * 5 + 95).toFixed(1);
    
    const staffOnDutyEl = document.getElementById('staff-on-duty');
    const attendanceRateEl = document.getElementById('attendance-rate');
    
    if (staffOnDutyEl) staffOnDutyEl.textContent = staffOnDuty.toLocaleString();
    if (attendanceRateEl) attendanceRateEl.textContent = attendanceRate + '%';
}

// 更新药品库存指标
function updateMedicationMetrics() {
    const medicationStock = Math.floor(Math.random() * 20) + 80;
    const outOfStock = Math.floor(Math.random() * 20) + 5;
    
    const medicationStockEl = document.getElementById('medication-stock');
    const outOfStockElement = document.getElementById('out-of-stock');
    
    if (medicationStockEl) medicationStockEl.textContent = medicationStock + '%';
    if (outOfStockElement) {
        outOfStockElement.textContent = outOfStock + '种';
        outOfStockElement.className = 'comparison-value ' + (outOfStock > 15 ? 'warning' : 'normal');
    }
}

// 更新工作效率指标
function updateEfficiencyMetrics() {
    const efficiencyRate = (Math.random() * 10 + 85).toFixed(1);
    const targetAchievement = (Math.random() * 20 + 90).toFixed(1);
    
    const efficiencyRateEl = document.getElementById('efficiency-rate');
    const targetElement = document.getElementById('target-achievement');
    
    if (efficiencyRateEl) efficiencyRateEl.textContent = efficiencyRate + '%';
    if (targetElement) {
        targetElement.textContent = targetAchievement + '%';
        targetElement.className = 'comparison-value ' + (targetAchievement > 100 ? 'up' : 'stable');
    }
    
    // 检查设备 - 检查元素是否存在
    const equipmentUsage = Math.floor(Math.random() * 30) + 70;
    const faultyEquipment = Math.floor(Math.random() * 8) + 1;
    
    const equipmentUsageEl = document.getElementById('equipment-usage');
    const faultyElement = document.getElementById('faulty-equipment');
    
    if (equipmentUsageEl) equipmentUsageEl.textContent = equipmentUsage + '%';
    if (faultyElement) {
        faultyElement.textContent = faultyEquipment + '台';
        faultyElement.className = 'comparison-value ' + (faultyEquipment > 5 ? 'warning' : 'normal');
    }
    
    // 预约管理 - 检查元素是否存在
    const appointmentCount = Math.floor(Math.random() * 500) + 2000;
    const cancellationRate = (Math.random() * 5 + 2).toFixed(1);
    
    const appointmentCountEl = document.getElementById('appointment-count');
    const cancellationElement = document.getElementById('cancellation-rate');
    
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

// 更新质量指标
function updateQualityMetrics() {
    const infectionRate = (Math.random() * 0.5 + 0.5).toFixed(1);
    const readmissionRate = (Math.random() * 2 + 2).toFixed(1);
    const avgStay = (Math.random() * 2 + 6).toFixed(1);
    const safetyScore = (Math.random() * 2 + 97).toFixed(1);
    
    const infectionRateEl = document.getElementById('infection-rate');
    const readmissionRateEl = document.getElementById('readmission-rate');
    const avgStayEl = document.getElementById('avg-stay');
    const safetyScoreEl = document.getElementById('safety-score');
    
    if (infectionRateEl) infectionRateEl.textContent = infectionRate + '%';
    if (readmissionRateEl) readmissionRateEl.textContent = readmissionRate + '%';
    if (avgStayEl) avgStayEl.textContent = avgStay + '天';
    if (safetyScoreEl) safetyScoreEl.textContent = safetyScore;
}

// 更新实时监控数据
function updateMonitoringData() {
    // 更新监控概览数据
    const hospitalLoad = Math.floor(Math.random() * 30) + 70;
    const powerConsumption = (Math.random() * 20 + 35).toFixed(1);
    const avgTemp = (Math.random() * 4 + 20).toFixed(1);
    const humidity = Math.floor(Math.random() * 20) + 50;
    
    const hospitalLoadEl = document.getElementById('hospital-load');
    const powerConsumptionEl = document.getElementById('power-consumption');
    const avgTempEl = document.getElementById('avg-temp');
    const humidityEl = document.getElementById('humidity');
    
    if (hospitalLoadEl) hospitalLoadEl.textContent = hospitalLoad + '%';
    if (powerConsumptionEl) powerConsumptionEl.textContent = powerConsumption + 'kW';
    if (avgTempEl) avgTempEl.textContent = avgTemp + '°C';
    if (humidityEl) humidityEl.textContent = humidity + '%';
    
    // 更新状态指示器
    const hospitalLoadStatus = document.getElementById('hospital-load-status');
    const powerStatus = document.getElementById('power-status');
    
    if (hospitalLoadStatus) {
        // 确定医院负荷状态
        let loadStatus, loadClass;
        if (hospitalLoad > 85) {
            loadStatus = '高负荷';
            loadClass = 'comparison-value warning';
        } else if (hospitalLoad > 70) {
            loadStatus = '正常';
            loadClass = 'comparison-value normal';
        } else {
            loadStatus = '低负荷';
            loadClass = 'comparison-value normal';
        }
        
        hospitalLoadStatus.textContent = loadStatus;
        hospitalLoadStatus.className = loadClass;
    }
    
    if (powerStatus) {
        const powerValue = parseFloat(powerConsumption);
        
        // 确定功耗状态
        let powerStatusText, powerClass;
        if (powerValue > 50) {
            powerStatusText = '高功耗';
            powerClass = 'comparison-value warning';
        } else if (powerValue > 35) {
            powerStatusText = '正常';
            powerClass = 'comparison-value normal';
        } else {
            powerStatusText = '低功耗';
            powerClass = 'comparison-value normal';
        }
        
        powerStatus.textContent = powerStatusText;
        powerStatus.className = powerClass;
    }
    
    // 更新能源统计
    const dailyPower = Math.floor(Math.random() * 200) + 1200;
    const powerComparison = (Math.random() * 10 - 5).toFixed(1);
    
    const dailyPowerEl = document.getElementById('daily-power');
    const comparisonElement = document.getElementById('power-comparison');
    
    if (dailyPowerEl) dailyPowerEl.textContent = dailyPower.toLocaleString() + ' kWh';
    if (comparisonElement) {
        comparisonElement.textContent = powerComparison + '%';
        
        // 确定比较结果的样式
        const comparisonClass = powerComparison > 0 ? 'energy-value up' : 'energy-value down';
        comparisonElement.className = comparisonClass;
    }
    
    // 更新环境数据
    const currentTemp = (Math.random() * 4 + 20).toFixed(1);
    const currentHumidity = Math.floor(Math.random() * 20) + 50;
    const currentPower = Math.floor(Math.random() * 400) + 1000;
    const airQuality = Math.floor(Math.random() * 30) + 10;
    
    const currentTempEl = document.getElementById('current-temp');
    const currentHumidityEl = document.getElementById('current-humidity');
    const currentPowerEl = document.getElementById('current-power');
    const currentAirQualityEl = document.getElementById('current-air-quality');
    
    if (currentTempEl) currentTempEl.textContent = currentTemp + '°C';
    if (currentHumidityEl) currentHumidityEl.textContent = currentHumidity + '%';
    if (currentPowerEl) currentPowerEl.textContent = currentPower + 'kWh';
    if (currentAirQualityEl) currentAirQualityEl.textContent = airQuality < 50 ? '优' : airQuality < 100 ? '良' : '中';
    
    // 更新电力图表
    if (window.powerChart && typeof window.powerChart.setOption === 'function') {
        window.powerChart.setOption({
            series: [{
                data: [{
                    value: currentPower,
                    name: '用电'
                }]
            }]
        });
    }
    
    // 更新网络数据
    const uploadSpeed = Math.floor(Math.random() * 50) + 100;
    const downloadSpeed = Math.floor(Math.random() * 200) + 800;
    const onlineDevices = Math.floor(Math.random() * 100) + 2300;
    const networkLatency = Math.floor(Math.random() * 10) + 8;
    
    const uploadSpeedEl = document.getElementById('upload-speed');
    const downloadSpeedEl = document.getElementById('download-speed');
    const onlineDevicesEl = document.getElementById('online-devices');
    const networkLatencyEl = document.getElementById('network-latency');
    
    if (uploadSpeedEl) uploadSpeedEl.textContent = uploadSpeed + ' Mbps';
    if (downloadSpeedEl) downloadSpeedEl.textContent = downloadSpeed + ' Mbps';
    if (onlineDevicesEl) onlineDevicesEl.textContent = onlineDevices.toLocaleString();
    if (networkLatencyEl) networkLatencyEl.textContent = networkLatency + 'ms';
    
    // 更新状态指示器
    updateStatusIndicators();
    
    // 确保所有元素可见
    ensureElementsVisible();
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
        console.error('ECharts 库未加载');
        return false;
    }
    if (typeof echarts.init !== 'function') {
        console.error('echarts.init 方法不可用');
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

// 清理定时器和事件监听器
function cleanup() {
    // 清理所有定时器
    const highestTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
    }
    
    const highestIntervalId = setInterval(() => {}, 9999);
    for (let i = 0; i < highestIntervalId; i++) {
        clearInterval(i);
    }
    
    // 清理图表实例
    const chartInstances = [
        'patientFlowChart', 'energyChart', 'trafficChart', 'qualityChart',
        'temperatureChart', 'humidityChart', 'airQualityChart', 'powerChart',
        'networkChart', 'revenueChart', 'equipmentStatusChart', 'waitingTimeChart'
    ];
    
    chartInstances.forEach(chartName => {
        if (window[chartName]) {
            window[chartName].dispose();
            window[chartName] = null;
        }
    });
    
    // 清理DOM缓存
    domCache.clear();
}

// 初始化图表
function initCharts() {
    try {
        // 检查ECharts是否可用
        if (!checkEChartsAvailable()) {
            console.error('ECharts 不可用，跳过图表初始化');
            return;
        }
    // 患者流量图表
    const patientFlowElement = document.getElementById('patientFlowChart');
    if (patientFlowElement) {
        window.patientFlowChart = echarts.init(patientFlowElement);
    }
    const patientFlowOption = {
        ...getPerformanceOptimizedConfig(),
        backgroundColor: 'transparent',
        textStyle: {
            color: '#ffffff'
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00ffff',
            textStyle: {
                color: '#ffffff'
            }
        },
        legend: {
            data: ['当日患者', '去年同期', '上月同期'],
            textStyle: {
                color: '#ffffff'
            },
          
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            },
            axisLabel: {
                color: '#ffffff'
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            },
            axisLabel: {
                color: '#ffffff'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        series: [
            {
                name: '当日患者',
                type: 'line',
                data: [45, 23, 156, 234, 189, 78],
                smooth: true,
                itemStyle: {
                    color: '#00e5ff'
                },
                lineStyle: {
                    color: '#00e5ff',
                    width: 3
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(0, 229, 255, 0.3)' },
                        { offset: 1, color: 'rgba(0, 229, 255, 0.05)' }
                    ])
                }
            },
            {
                name: '去年同期',
                type: 'line',
                data: [38, 45, 142, 198, 165, 89],
                smooth: true,
                itemStyle: {
                    color: '#ff6b6b'
                },
                lineStyle: {
                    color: '#ff6b6b',
                    width: 2
                }
            },
            {
                name: '上月同期',
                type: 'line',
                data: [42, 28, 148, 215, 172, 85],
                smooth: true,
                itemStyle: {
                    color: '#4ecdc4'
                },
                lineStyle: {
                    color: '#4ecdc4',
                    width: 2
                }
            }
        ]
    };
    if (window.patientFlowChart) {
        window.patientFlowChart.setOption(patientFlowOption);
    }

    // 患者流量趋势图表日月切换功能
    const patientFlowToggleButtons = document.querySelectorAll('.chart-container-small:nth-child(1) .chart-toggle .toggle-btn');
    patientFlowToggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            patientFlowToggleButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的active类
            this.classList.add('active');
            
            // 获取切换的周期
            const period = this.getAttribute('data-period');
            
            // 更新图表模式状态
            patientFlowChartMode = period;
            
            // 更新患者流量图表数据
            if (window.patientFlowChart) {
                let newOption;
                if (period === 'day') {
                    // 日数据 - 12小时
                    newOption = {
                        backgroundColor: 'transparent',
                        textStyle: {
                            color: '#ffffff'
                        },
                        tooltip: {
                            trigger: 'axis',
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            borderColor: '#00ffff',
                            textStyle: {
                                color: '#ffffff'
                            }
                        },
                        legend: {
                            data: ['今日', '昨日', '上周同日'],
                            textStyle: {
                                color: '#ffffff'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            top: '15%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
                            axisLine: {
                                lineStyle: {
                                    color: '#ffffff'
                                }
                            },
                            axisLabel: {
                                color: '#ffffff'
                            }
                        },
                        yAxis: {
                            type: 'value',
                            axisLine: {
                                lineStyle: {
                                    color: '#ffffff'
                                }
                            },
                            axisLabel: {
                                color: '#ffffff'
                            },
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                }
                            }
                        },
                        series: [
                            {
                                name: '今日',
                                type: 'line',
                                data: [12, 8, 5, 15, 45, 78, 95, 88, 76, 65, 42, 28],
                                smooth: true,
                                itemStyle: {
                                    color: '#00e5ff'
                                },
                                lineStyle: {
                                    color: '#00e5ff',
                                    width: 3
                                },
                                areaStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: 'rgba(0, 229, 255, 0.3)' },
                                        { offset: 1, color: 'rgba(0, 229, 255, 0.05)' }
                                    ])
                                }
                            },
                            {
                                name: '昨日',
                                type: 'line',
                                data: [10, 6, 8, 18, 42, 82, 89, 85, 72, 68, 45, 32],
                                smooth: true,
                                itemStyle: {
                                    color: '#ff6b6b'
                                },
                                lineStyle: {
                                    color: '#ff6b6b',
                                    width: 2
                                }
                            },
                            {
                                name: '上周同日',
                                type: 'line',
                                data: [15, 12, 10, 20, 48, 75, 92, 90, 78, 70, 50, 35],
                                smooth: true,
                                itemStyle: {
                                    color: '#4ecdc4'
                                },
                                lineStyle: {
                                    color: '#4ecdc4',
                                    width: 2
                                }
                            }
                        ]
                    };
                } else {
                    // 月数据 - 30天
                    const monthData = Array.from({length: 30}, () => Math.floor(Math.random() * 200) + 300);
                    const lastMonthData = Array.from({length: 30}, () => Math.floor(Math.random() * 180) + 280);
                    const lastYearData = Array.from({length: 30}, () => Math.floor(Math.random() * 160) + 250);
                    
                    newOption = {
                        backgroundColor: 'transparent',
                        textStyle: {
                            color: '#ffffff'
                        },
                        tooltip: {
                            trigger: 'axis',
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            borderColor: '#00ffff',
                            textStyle: {
                                color: '#ffffff'
                            }
                        },
                        legend: {
                            data: ['本月', '上月', '去年同月'],
                            textStyle: {
                                color: '#ffffff'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            top: '15%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: Array.from({length: 30}, (_, i) => `${i + 1}日`),
                            axisLine: {
                                lineStyle: {
                                    color: '#ffffff'
                                }
                            },
                            axisLabel: {
                                color: '#ffffff',
                                interval: 4, // 每5天显示一个标签
                                rotate: 45 // 旋转45度避免重叠
                            }
                        },
                        yAxis: {
                            type: 'value',
                            min: 200,
                            max: 600,
                            axisLine: {
                                lineStyle: {
                                    color: '#ffffff'
                                }
                            },
                            axisLabel: {
                                color: '#ffffff',
                                formatter: function(value) {
                                    return value + '人';
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                }
                            }
                        },
                        series: [
                            {
                                name: '本月',
                                type: 'line',
                                data: monthData,
                                smooth: true,
                                itemStyle: {
                                    color: '#00e5ff'
                                },
                                lineStyle: {
                                    color: '#00e5ff',
                                    width: 3
                                },
                                areaStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: 'rgba(0, 229, 255, 0.3)' },
                                        { offset: 1, color: 'rgba(0, 229, 255, 0.05)' }
                                    ])
                                }
                            },
                            {
                                name: '上月',
                                type: 'line',
                                data: lastMonthData,
                                smooth: true,
                                itemStyle: {
                                    color: '#ff6b6b'
                                },
                                lineStyle: {
                                    color: '#ff6b6b',
                                    width: 2
                                }
                            },
                            {
                                name: '去年同月',
                                type: 'line',
                                data: lastYearData,
                                smooth: true,
                                itemStyle: {
                                    color: '#4ecdc4'
                                },
                                lineStyle: {
                                    color: '#4ecdc4',
                                    width: 2
                                }
                            }
                        ]
                    };
                }
                
                // 更新图表
                window.patientFlowChart.setOption(newOption, true);
            }
        });
    });

    // 能源消耗图表
    const energyElement = document.getElementById('energyChart');
    if (energyElement) {
        window.energyChart = echarts.init(energyElement);
    }
    const energyOption = {
        backgroundColor: 'transparent',
      
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00e5ff',
            textStyle: {
                color: '#ffffff'
            }
        },
        legend: {
            data: ['电力', '水', '燃气'],
            textStyle: {
                color: '#ffffff'
            },
          
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            },
            axisLabel: {
                color: '#ffffff'
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            },
            axisLabel: {
                color: '#ffffff'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        series: [
            {
                name: '电力',
                type: 'line',
                data: [120, 132, 101, 134, 90, 230],
                itemStyle: {
                    color: '#ff6b6b'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(255, 107, 107, 0.3)' },
                        { offset: 1, color: 'rgba(255, 107, 107, 0.05)' }
                    ])
                }
            },
            {
                name: '水',
                type: 'line',
                data: [220, 182, 191, 234, 290, 330],
                itemStyle: {
                    color: '#4ecdc4'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(78, 205, 196, 0.3)' },
                        { offset: 1, color: 'rgba(78, 205, 196, 0.05)' }
                    ])
                }
            },
            {
                name: '燃气',
                type: 'line',
                data: [150, 232, 201, 154, 190, 330],
                itemStyle: {
                    color: '#45b7d1'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(69, 183, 209, 0.3)' },
                        { offset: 1, color: 'rgba(69, 183, 209, 0.05)' }
                    ])
                }
            }
        ]
    };
    if (window.energyChart) {
        window.energyChart.setOption(energyOption);
    }

    // 能源消耗趋势图表日月切换功能
    const energyToggleButtons = document.querySelectorAll('.chart-container-small:nth-child(2) .chart-toggle .toggle-btn');
    energyToggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            energyToggleButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的active类
            this.classList.add('active');
            
            // 获取切换的周期
            const period = this.getAttribute('data-period');
            
            // 更新能源消耗图表数据
            if (window.energyChart) {
                let newOption;
                if (period === 'day') {
                    // 日数据 - 12小时
                    newOption = {
                        backgroundColor: 'transparent',
                        tooltip: {
                            trigger: 'axis',
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            borderColor: '#00e5ff',
                            textStyle: {
                                color: '#ffffff'
                            }
                        },
                        legend: {
                            data: ['电力', '水', '燃气'],
                            textStyle: {
                                color: '#ffffff'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            top: '15%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
                            axisLine: {
                                lineStyle: {
                                    color: '#ffffff'
                                }
                            },
                            axisLabel: {
                                color: '#ffffff'
                            }
                        },
                        yAxis: {
                            type: 'value',
                            axisLine: {
                                lineStyle: {
                                    color: '#ffffff'
                                }
                            },
                            axisLabel: {
                                color: '#ffffff'
                            },
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                }
                            }
                        },
                        series: [
                            {
                                name: '电力',
                                type: 'line',
                                data: [120, 110, 95, 105, 140, 180, 200, 185, 160, 135, 125, 115],
                                itemStyle: {
                                    color: '#ff6b6b'
                                },
                                areaStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: 'rgba(255, 107, 107, 0.3)' },
                                        { offset: 1, color: 'rgba(255, 107, 107, 0.05)' }
                                    ])
                                }
                            },
                            {
                                name: '水',
                                type: 'line',
                                data: [220, 200, 180, 190, 240, 280, 300, 285, 260, 235, 225, 215],
                                itemStyle: {
                                    color: '#4ecdc4'
                                },
                                areaStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: 'rgba(78, 205, 196, 0.3)' },
                                        { offset: 1, color: 'rgba(78, 205, 196, 0.05)' }
                                    ])
                                }
                            },
                            {
                                name: '燃气',
                                type: 'line',
                                data: [150, 140, 125, 135, 170, 210, 230, 215, 190, 165, 155, 145],
                                itemStyle: {
                                    color: '#45b7d1'
                                },
                                areaStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: 'rgba(69, 183, 209, 0.3)' },
                                        { offset: 1, color: 'rgba(69, 183, 209, 0.05)' }
                                    ])
                                }
                            }
                        ]
                    };
                } else {
                    // 月数据 - 30天
                    const electricityData = Array.from({length: 30}, () => Math.floor(Math.random() * 100) + 100);
                    const waterData = Array.from({length: 30}, () => Math.floor(Math.random() * 120) + 180);
                    const gasData = Array.from({length: 30}, () => Math.floor(Math.random() * 80) + 120);
                    
                    newOption = {
                        backgroundColor: 'transparent',
                        tooltip: {
                            trigger: 'axis',
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            borderColor: '#00e5ff',
                            textStyle: {
                                color: '#ffffff'
                            }
                        },
                        legend: {
                            data: ['电力', '水', '燃气'],
                            textStyle: {
                                color: '#ffffff'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            top: '15%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: Array.from({length: 30}, (_, i) => `${i + 1}日`),
                            axisLine: {
                                lineStyle: {
                                    color: '#ffffff'
                                }
                            },
                            axisLabel: {
                                color: '#ffffff',
                                interval: 4, // 每5天显示一个标签
                                rotate: 45 // 旋转45度避免重叠
                            }
                        },
                        yAxis: {
                            type: 'value',
                            axisLine: {
                                lineStyle: {
                                    color: '#ffffff'
                                }
                            },
                            axisLabel: {
                                color: '#ffffff'
                            },
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                }
                            }
                        },
                        series: [
                            {
                                name: '电力',
                                type: 'line',
                                data: electricityData,
                                itemStyle: {
                                    color: '#ff6b6b'
                                },
                                areaStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: 'rgba(255, 107, 107, 0.3)' },
                                        { offset: 1, color: 'rgba(255, 107, 107, 0.05)' }
                                    ])
                                }
                            },
                            {
                                name: '水',
                                type: 'line',
                                data: waterData,
                                itemStyle: {
                                    color: '#4ecdc4'
                                },
                                areaStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: 'rgba(78, 205, 196, 0.3)' },
                                        { offset: 1, color: 'rgba(78, 205, 196, 0.05)' }
                                    ])
                                }
                            },
                            {
                                name: '燃气',
                                type: 'line',
                                data: gasData,
                                itemStyle: {
                                    color: '#45b7d1'
                                },
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
                
                // 更新图表
                window.energyChart.setOption(newOption, true);
            }
        });
    });

    // 交通流量图表
    const trafficElement = document.getElementById('trafficChart');
    if (trafficElement) {
        window.trafficChart = echarts.init(trafficElement);
    }
    const trafficOption = {
        backgroundColor: 'transparent',
       
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00e5ff',
            textStyle: {
                color: '#ffffff'
            }
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: {
                color: '#ffffff'
            }
        },
        series: [
            {
                name: '停车场使用',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['60%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '20',
                        fontWeight: 'bold',
                        color: '#ffffff'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 191, name: '已使用', itemStyle: { color: '#ff6b6b' } },
                    { value: 54, name: '空闲', itemStyle: { color: '#4ecdc4' } }
                ]
            }
        ]
    };
    if (window.trafficChart) {
        window.trafficChart.setOption(trafficOption);
    }

    // 医疗质量指标图表
    const qualityElement = document.getElementById('qualityChart');
    if (qualityElement) {
        window.qualityChart = echarts.init(qualityElement);
    }
    const qualityOption = {
        backgroundColor: 'transparent',
        title: {
            text: '医疗质量趋势',
            textStyle: {
                color: '#4caf50',
                fontSize: 14
            },
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#4caf50',
            textStyle: {
                color: '#ffffff'
            }
        },
        legend: {
            data: ['感染率', '再入院率', '满意度'],
            textStyle: {
                color: '#ffffff'
            },
            top: 35,
            itemGap: 15,
            itemWidth: 12,
            itemHeight: 8
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '25%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: 10
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        series: [
            {
                name: '感染率',
                type: 'line',
                data: [0.8, 0.7, 0.9, 0.6, 0.8, 0.7, 0.8],
                itemStyle: {
                    color: '#f44336'
                },
                lineStyle: {
                    width: 2
                }
            },
            {
                name: '再入院率',
                type: 'line',
                data: [3.2, 3.5, 3.1, 3.0, 3.3, 3.4, 3.2],
                itemStyle: {
                    color: '#ff9800'
                },
                lineStyle: {
                    width: 2
                }
            },
            {
                name: '满意度',
                type: 'line',
                data: [96.8, 97.2, 96.5, 97.0, 96.9, 97.1, 96.8],
                itemStyle: {
                    color: '#4caf50'
                },
                lineStyle: {
                    width: 2
                }
            }
        ]
    };
    if (window.qualityChart) {
        window.qualityChart.setOption(qualityOption);
    }

    // 温度监控图表
    const temperatureElement = document.getElementById('temperatureChart');
    if (temperatureElement) {
        window.temperatureChart = echarts.init(temperatureElement);
    }
    const temperatureOption = {
        backgroundColor: 'transparent',
        series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            
            center: ['50%', '85%'],
            radius: '130%',
            min: 0,
            max: 40,
            splitNumber: 4,
            axisLine: {
                lineStyle: {
                    width: 5,
                    color: [[0.3, '#4caf50'], [0.7, '#ff9800'], [1, '#f44336']]
                }
            },
            pointer: {
                icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                length: '12%',
                width: 18,
                offsetCenter: [0, '-60%'],
                itemStyle: {
                    color: '#00ffff'
                }
            },
            axisTick: {
                length: 10,
                lineStyle: {
                    color: 'auto',
                    width: 2
                }
            },
            splitLine: {
                length: 18,
                lineStyle: {
                    color: 'auto',
                    width: 4
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: 9,
                distance: -60,
                rotate: 'tangential',
                formatter: function (value) {
                    if (value === 0) {
                        return '0°C';
                    } else if (value === 10) {
                        return '10°C';
                    } else if (value === 20) {
                        return '20°C';
                    } else if (value === 30) {
                        return '30°C';
                    } else if (value === 40) {
                        return '40°C';
                    }
                    return '';
                }
            },
            title: {
                offsetCenter: [0, '-10%'],
                fontSize: 9,
                color: '#ffffff'
            },
            detail: {
                fontSize: 12,
                offsetCenter: [0, '-35%'],
                valueAnimation: true,
                formatter: function (value) {
                    return Math.round(value) + '°C';
                },
                color: '#00ffff'
            },
            data: [{
                value: 22.5,
                name: '温度'
            }]
        }]
    };
    if (window.temperatureChart) {
        window.temperatureChart.setOption(temperatureOption);
    }

    // 湿度监控图表
    const humidityElement = document.getElementById('humidityChart');
    if (humidityElement) {
        window.humidityChart = echarts.init(humidityElement);
    }
    const humidityOption = {
        backgroundColor: 'transparent',
        series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            center: ['50%', '85%'],
            radius: '130%',
            min: 0,
            max: 100,
            splitNumber: 5,
            axisLine: {
                lineStyle: {
                    width: 5,
                    color: [[0.4, '#4caf50'], [0.7, '#ff9800'], [1, '#f44336']]
                }
            },
            pointer: {
                icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                length: '12%',
                width: 18,
                offsetCenter: [0, '-60%'],
                itemStyle: {
                    color: '#00ffff'
                }
            },
            axisTick: {
                length: 10,
                lineStyle: {
                    color: 'auto',
                    width: 2
                }
            },
            splitLine: {
                length: 18,
                lineStyle: {
                    color: 'auto',
                    width: 4
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: 9,
                distance: -60,
                rotate: 'tangential',
                formatter: function (value) {
                    if (value === 20) {
                        return '20%';
                    } else if (value === 50) {
                        return '50%';
                    } else if (value === 80) {
                        return '80%';
                    }
                    return '';
                }
            },
            title: {
                offsetCenter: [0, '-10%'],
                fontSize: 9,
                color: '#ffffff'
            },
            detail: {
                fontSize: 12,
                offsetCenter: [0, '-35%'],
                valueAnimation: true,
                formatter: function (value) {
                    return Math.round(value) + '%';
                },
                color: '#00ffff'
            },
            data: [{
                value: 58,
                name: '湿度'
            }]
        }]
    };
    if (window.humidityChart) {
        window.humidityChart.setOption(humidityOption);
    }

    // 空气质量监控图表
    const airQualityElement = document.getElementById('airQualityChart');
    if (airQualityElement) {
        window.airQualityChart = echarts.init(airQualityElement);
    }
    const airQualityOption = {
        backgroundColor: 'transparent',
        series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            center: ['50%', '85%'],
            radius: '130%',
            min: 0,
            max: 500,
            splitNumber: 5,
            axisLine: {
                lineStyle: {
                    width: 5,
                    color: [[0.2, '#4caf50'], [0.4, '#ff9800'], [0.6, '#ff5722'], [1, '#f44336']]
                }
            },
            pointer: {
                icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                length: '12%',
                width: 18,
                offsetCenter: [0, '-60%'],
                itemStyle: {
                    color: '#00ffff'
                }
            },
            axisTick: {
                length: 10,
                lineStyle: {
                    color: 'auto',
                    width: 2
                }
            },
            splitLine: {
                length: 18,
                lineStyle: {
                    color: 'auto',
                    width: 4
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: 9,
                distance: -60,
                rotate: 'tangential',
                formatter: function (value) {
                    if (value === 50) {
                        return '优';
                    } else if (value === 100) {
                        return '良';
                    } else if (value === 200) {
                        return '中';
                    }
                    return '';
                }
            },
            title: {
                offsetCenter: [0, '-10%'],
                fontSize: 9,
                color: '#ffffff'
            },
            detail: {
                fontSize: 12,
                offsetCenter: [0, '-35%'],
                valueAnimation: true,
                formatter: function (value) {
                    return Math.round(value);
                },
                color: '#00ffff'
            },
            data: [{
                value: 15,
                name: 'PM2.5'
            }]
        }]
    };
    if (window.airQualityChart) {
        window.airQualityChart.setOption(airQualityOption);
    }

    // 电力消耗图表
    const powerElement = document.getElementById('powerChart');
    if (powerElement) {
        try {
            window.powerChart = echarts.init(powerElement);
            console.log('powerChart 初始化成功');
        } catch (error) {
            console.error('powerChart 初始化失败:', error);
            window.powerChart = null;
        }
    } else {
        console.warn('powerChart 元素未找到');
        window.powerChart = null;
    }
    const powerOption = {
        backgroundColor: 'transparent',
        series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            center: ['50%', '85%'],
            radius: '130%', 
            min: 800,
            max: 1600,
            splitNumber: 8,
            axisLine: {
                lineStyle: {
                    width: 5,
                    color: [[0.6, '#4caf50'], [0.8, '#ff9800'], [1, '#f44336']]
                }
            },
            pointer: {
                icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                length: '12%',
                width: 18,
                offsetCenter: [0, '-60%'],
                itemStyle: {
                    color: '#00ffff'
                }
            },
            axisTick: {
                length: 10,
                lineStyle: {
                    color: 'auto',
                    width: 2
                }
            },
            splitLine: {
                length: 18,
                lineStyle: {
                    color: 'auto',
                    width: 4
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: 9,
                distance: -60,
                rotate: 'tangential',
                formatter: function (value) {
                    if (value === 1000) {
                        return '1.0k';
                    } else if (value === 1200) {
                        return '1.2k';
                    } else if (value === 1400) {
                        return '1.4k';
                    }
                    return '';
                }
            },
            title: {
                offsetCenter: [0, '-10%'],
                fontSize: 9,
                color: '#ffffff'
            },
            detail: {
                fontSize: 12,
                offsetCenter: [0, '-35%'],
                valueAnimation: true,
                formatter: function (value) {
                    return Math.round(value) + 'kWh';
                },
                color: '#00ffff'
            },
            data: [{
                value: 1245,
                name: '用电'
            }]
        }]
    };
    if (window.powerChart && typeof window.powerChart.setOption === 'function') {
        window.powerChart.setOption(powerOption);
    }

    // 网络流量图表
    const networkElement = document.getElementById('networkChart');
    if (networkElement) {
        window.networkChart = echarts.init(networkElement);
    }
    const networkOption = {
        backgroundColor: 'transparent',
     
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00ffff',
            textStyle: {
                color: '#ffffff'
            }
        },
        legend: {
            data: ['上行', '下行'],
            textStyle: {
                color: '#ffffff'
            },
            top: 25
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: 10
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        series: [
            {
                name: '上行',
                type: 'line',
                data: [120, 132, 101, 134, 90, 230],
                itemStyle: {
                    color: '#ff9800'
                },
                lineStyle: {
                    width: 2
                }
            },
            {
                name: '下行',
                type: 'line',
                data: [220, 182, 191, 234, 290, 330],
                itemStyle: {
                    color: '#4caf50'
                },
                lineStyle: {
                    width: 2
                }
            }
        ]
    };
    if (window.networkChart) {
        window.networkChart.setOption(networkOption);
    }

    // 收入分析饼图
    const revenueElement = document.getElementById('revenueChart');
    if (revenueElement) {
        window.revenueChart = echarts.init(revenueElement);
    }
    const revenueOption = {
        backgroundColor: 'transparent',
        textStyle: {
            color: '#ffffff'
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00ffff',
            textStyle: {
                color: '#ffffff'
            }
        },
        legend: {
            orient: 'vertical',
            right: '-20%',
            top: 'center',
            textStyle: {
                color: '#ffffff',
                fontSize: 8
            },
            itemWidth: 6,
            itemHeight: 6,
            itemGap: 3
        },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['30%', '50%'],
            data: [
                { value: 45, name: '门诊收入', itemStyle: { color: '#00e5ff' } },
                { value: 30, name: '住院收入', itemStyle: { color: '#4caf50' } },
                { value: 15, name: '检查收入', itemStyle: { color: '#ff9800' } },
                { value: 10, name: '其他收入', itemStyle: { color: '#9c27b0' } }
            ],
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 255, 255, 0.5)'
                }
            }
        }]
    };
    if (window.revenueChart) {
        window.revenueChart.setOption(revenueOption);
    }

    // 设备状态图表
    const equipmentStatusElement = document.getElementById('equipmentStatusChart');
    if (equipmentStatusElement) {
        window.equipmentStatusChart = echarts.init(equipmentStatusElement);
    }
    const equipmentStatusOption = {
        backgroundColor: 'transparent',
        textStyle: {
            color: '#ffffff'
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00ffff',
            textStyle: {
                color: '#ffffff'
            }
        },
        legend: {
            orient: 'vertical',
            right: '-20%',
            top: 'center',
            textStyle: {
                color: '#ffffff',
                fontSize: 8
            },
            itemWidth: 6,
            itemHeight: 6,
            itemGap: 3
        },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['30%', '50%'],
            data: [
                { value: 78, name: '正常运行', itemStyle: { color: '#4caf50' } },
                { value: 15, name: '维护中', itemStyle: { color: '#ff9800' } },
                { value: 5, name: '故障', itemStyle: { color: '#f44336' } },
                { value: 2, name: '待机', itemStyle: { color: '#9e9e9e' } }
            ],
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 255, 255, 0.5)'
                }
            }
        }]
    };
    if (window.equipmentStatusChart) {
        window.equipmentStatusChart.setOption(equipmentStatusOption);
    }

    // 就诊人数趋势图
    const patientTrendElement = document.getElementById('patientTrendChart');
    if (patientTrendElement) {
        try {
            window.patientTrendChart = echarts.init(patientTrendElement);
            console.log('patientTrendChart 初始化成功');
        } catch (error) {
            console.error('patientTrendChart 初始化失败:', error);
            window.patientTrendChart = null;
        }
    const patientTrendOption = {
        backgroundColor: 'transparent',
        textStyle: {
            color: '#ffffff'
        },
        grid: {
            left: '10%',
            right: '10%',
            top: '10%',
            bottom: '10%'
        },
        xAxis: {
            type: 'category',
            data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            axisLabel: {
                color: '#ffffff',
                fontSize: 8
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#ffffff',
                fontSize: 8
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        series: [{
            data: [45, 23, 156, 234, 189, 78],
            type: 'line',
            smooth: true,
            lineStyle: {
                color: '#00e5ff',
                width: 2
            },
            itemStyle: {
                color: '#00e5ff'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(0, 229, 255, 0.3)' },
                    { offset: 1, color: 'rgba(0, 229, 255, 0.05)' }
                ])
            },
            symbol: 'circle',
            symbolSize: 4
        }]
    };
    if (window.patientTrendChart && typeof window.patientTrendChart.setOption === 'function') {
        window.patientTrendChart.setOption(patientTrendOption);
        console.log('patientTrendChart 配置设置成功');
    }
    }

    // 床位使用率仪表盘
    const bedUsageElement = document.getElementById('bedUsageGauge');
    if (bedUsageElement && typeof echarts !== 'undefined') {
        try {
            window.bedUsageGauge = echarts.init(bedUsageElement);
            console.log('bedUsageGauge 初始化成功');
        } catch (error) {
            console.error('bedUsageGauge 初始化失败:', error);
        }
    const bedUsageOption = {
        backgroundColor: 'transparent',
        textStyle: {
            color: '#ffffff'
        },
        series: [{
            type: 'gauge',
            center: ['50%', '50%'],
            radius: '85%',
            min: 0,
            max: 100,
            splitNumber: 5,
            axisLine: {
                lineStyle: {
                    width: 4,
                    color: [
                        [0.3, '#ff6b6b'],
                        [0.7, '#ffa726'],
                        [1, '#4caf50']
                    ]
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            splitLine: {
                show: false
            },
            pointer: {
                show: false
            },
            title: {
                show: false
            },
            detail: {
                show: false
            },
            data: [{
                value: 85,
                name: '床位使用率'
            }]
        }]
    };
    window.bedUsageGauge.setOption(bedUsageOption);
    }

    // 急诊病例柱状图
    const emergencyElement = document.getElementById('emergencyChart');
    if (emergencyElement) {
        window.emergencyChart = echarts.init(emergencyElement);
    const emergencyOption = {
        backgroundColor: 'transparent',
        textStyle: {
            color: '#ffffff'
        },
        grid: {
            left: '15%',
            right: '10%',
            top: '10%',
            bottom: '10%'
        },
        xAxis: {
            type: 'category',
            data: ['轻度', '中度', '重度', '危重'],
            axisLabel: {
                color: '#ffffff',
                fontSize: 8
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#ffffff',
                fontSize: 8
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            }
        },
        series: [{
            data: [8, 7, 5, 3],
            type: 'bar',
            barWidth: '60%',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#ff6b6b' },
                    { offset: 1, color: '#f44336' }
                ])
            }
        }]
    };
    window.emergencyChart.setOption(emergencyOption);
    }

    // 手术数量环形图
    const surgeryElement = document.getElementById('surgeryChart');
    if (surgeryElement) {
        window.surgeryChart = echarts.init(surgeryElement);
    const surgeryOption = {
        backgroundColor: 'transparent',
        textStyle: {
            color: '#ffffff'
        },
        series: [{
            type: 'pie',
            radius: ['50%', '80%'],
            center: ['50%', '50%'],
            data: [
                { value: 8, name: '已完成', itemStyle: { color: '#4caf50' } },
                { value: 3, name: '进行中', itemStyle: { color: '#ff9800' } },
                { value: 1, name: '待开始', itemStyle: { color: '#2196f3' } }
            ],
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 5,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 255, 255, 0.5)'
                }
            }
        }]
    };
    window.surgeryChart.setOption(surgeryOption);
    }

    // 等待时间折线图
    const waitingTimeElement = document.getElementById('waitingTimeChart');
    if (waitingTimeElement) {
        console.log('初始化等待时间图表...');
        window.waitingTimeChart = echarts.init(waitingTimeElement);
    const waitingTimeOption = {
        backgroundColor: 'transparent',
        textStyle: {
            color: '#ffffff'
        },
        grid: {
            left: '15%',
            right: '15%',
            top: '15%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
            axisLabel: {
                color: '#ffffff',
                fontSize: 9
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 50,
            axisLabel: {
                color: '#ffffff',
                fontSize: 9
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    type: 'dashed'
                }
            }
        },
        series: [{
            data: [35, 28, 32, 25, 30, 28],
            type: 'line',
            smooth: true,
            lineStyle: {
                color: '#ff9800',
                width: 3
            },
            itemStyle: {
                color: '#ff9800',
                borderColor: '#ffffff',
                borderWidth: 2
            },
            symbol: 'circle',
            symbolSize: 6,
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(255, 152, 0, 0.3)' },
                    { offset: 1, color: 'rgba(255, 152, 0, 0.05)' }
                ])
            }
        }]
    };
    window.waitingTimeChart.setOption(waitingTimeOption);
    console.log('等待时间图表初始化完成');
    } else {
        console.error('等待时间图表容器未找到');
    }

    // 满意度雷达图
    const satisfactionElement = document.getElementById('satisfactionChart');
    if (satisfactionElement) {
        window.satisfactionChart = echarts.init(satisfactionElement);
    const satisfactionOption = {
        backgroundColor: 'transparent',
        textStyle: {
            color: '#ffffff'
        },
        radar: {
            indicator: [
                { name: '服务', max: 100 },
                { name: '质量', max: 100 },
                { name: '环境', max: 100 },
                { name: '等待', max: 100 }
            ],
            center: ['50%', '50%'],
            radius: '70%',
            axisName: {
                color: '#ffffff',
                fontSize: 8
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            },
            splitArea: {
                show: false
            }
        },
        series: [{
            type: 'radar',
            data: [{
                value: [96, 98, 94, 92],
                itemStyle: {
                    color: '#4caf50'
                },
                areaStyle: {
                    color: 'rgba(76, 175, 80, 0.2)'
                }
            }],
            symbol: 'circle',
            symbolSize: 4,
            lineStyle: {
                color: '#4caf50',
                width: 2
            }
        }]
    };
    window.satisfactionChart.setOption(satisfactionOption);
    }

    // 响应式处理
    window.addEventListener('resize', function() {
        // 延迟执行resize，确保布局完成
        setTimeout(function() {
            if (window.energyChart) window.energyChart.resize();
            if (window.patientFlowChart) window.patientFlowChart.resize();
            if (window.trafficChart) window.trafficChart.resize();
            if (window.qualityChart) window.qualityChart.resize();
            if (window.temperatureChart) window.temperatureChart.resize();
            if (window.humidityChart) window.humidityChart.resize();
            if (window.airQualityChart) window.airQualityChart.resize();
            if (window.powerChart && typeof window.powerChart.resize === 'function') window.powerChart.resize();
            if (window.networkChart) window.networkChart.resize();
            if (window.revenueChart) window.revenueChart.resize();
            if (window.equipmentStatusChart) window.equipmentStatusChart.resize();
            if (window.patientTrendChart) window.patientTrendChart.resize();
            if (window.bedUsageGauge) window.bedUsageGauge.resize();
            if (window.emergencyChart) window.emergencyChart.resize();
            if (window.surgeryChart) window.surgeryChart.resize();
            if (window.waitingTimeChart) window.waitingTimeChart.resize();
            if (window.satisfactionChart) window.satisfactionChart.resize();
        }, 100);
    });
    } catch (error) {
        console.error('图表初始化错误:', error);
    }
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
        console.log('开始绑定主题切换事件');
        const themeToggleBtn = document.getElementById('theme-toggle');
        console.log('找到主题切换按钮:', themeToggleBtn);
        
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                console.log('主题切换按钮被点击');
                this.toggleMode();
            });
            console.log('已绑定点击事件到主题切换按钮');
        } else {
            console.error('未找到主题切换按钮 (id: theme-toggle)');
        }
    }

    toggleMode() {
        console.log('开始切换主题模式，当前模式:', this.isDarkMode ? '夜间模式' : '白天模式');
        
        this.isDarkMode = !this.isDarkMode;
        console.log('切换后模式:', this.isDarkMode ? '夜间模式' : '白天模式');
        
        this.applyMode();
        
        // 保存到本地存储
        const modeValue = this.isDarkMode ? 'dark' : 'light';
        localStorage.setItem('dashboard-theme-mode', modeValue);
        console.log('已保存到本地存储:', modeValue);
        
        console.log('主题模式切换完成:', this.isDarkMode ? '夜间模式' : '白天模式');
    }

    applyMode() {
        const body = document.body;
        const themeToggleBtn = document.getElementById('theme-toggle');
        const themeIcon = themeToggleBtn?.querySelector('.theme-icon');
        const themeText = themeToggleBtn?.querySelector('.theme-text');

        console.log('应用主题模式:', this.isDarkMode ? '夜间模式' : '白天模式');

        if (this.isDarkMode) {
            body.classList.add('dark-mode');
            console.log('已添加dark-mode类到body');
            if (themeIcon) {
                themeIcon.textContent = '🌙';
                console.log('已更新图标为月亮');
            }
            if (themeText) {
                themeText.textContent = '夜间';
                console.log('已更新文字为夜间');
            }
            if (themeToggleBtn) {
                themeToggleBtn.classList.add('active');
                console.log('已添加active类到按钮');
            }
        } else {
            body.classList.remove('dark-mode');
            console.log('已移除dark-mode类从body');
            if (themeIcon) {
                themeIcon.textContent = '☀️';
                console.log('已更新图标为太阳');
            }
            if (themeText) {
                themeText.textContent = '白天';
                console.log('已更新文字为白天');
            }
            if (themeToggleBtn) {
                themeToggleBtn.classList.remove('active');
                console.log('已移除active类从按钮');
            }
        }

        // 更新图表颜色以适应主题模式
        if (window.colorThemeManager) {
            console.log('开始更新图表颜色');
            window.colorThemeManager.updateChartsForDarkMode(this.isDarkMode);
        } else {
            console.warn('colorThemeManager未初始化');
        }
    }
}

// 颜色主题管理
class ColorThemeManager {
    constructor() {
        this.currentTheme = 'light-blue';
        this.themes = {
            'light-blue': {
                name: '浅蓝色',
                primary: '#87CEEB',
                secondary: '#00ffff',
                accent: '#00e5ff'
            },
            'light-green': {
                name: '浅绿色',
                primary: '#98FB98',
                secondary: '#90EE90',
                accent: '#98FB98'
            },
            'light-purple': {
                name: '浅紫色',
                primary: '#DDA0DD',
                secondary: '#DA70D6',
                accent: '#DDA0DD'
            },
            'light-pink': {
                name: '浅粉色',
                primary: '#FFB6C1',
                secondary: '#FFC0CB',
                accent: '#FFB6C1'
            }
        };
        this.init();
    }

    init() {
        // 从本地存储加载保存的主题
        const savedTheme = localStorage.getItem('dashboard-theme');
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        }
        
        // 应用当前主题
        this.applyTheme(this.currentTheme);
        
        // 绑定事件监听器
        this.bindEvents();
    }

    bindEvents() {
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = e.currentTarget.getAttribute('data-theme');
                this.switchTheme(theme);
            });
        });
    }

    switchTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn('未知的主题:', themeName);
            return;
        }

        // 更新当前主题
        this.currentTheme = themeName;
        
        // 应用主题
        this.applyTheme(themeName);
        
        // 更新UI状态
        this.updateUI(themeName);
        
        // 保存到本地存储
        localStorage.setItem('dashboard-theme', themeName);
        
        console.log('主题已切换到:', this.themes[themeName].name);
    }

    applyTheme(themeName) {
        // 设置body的data-theme属性
        document.body.setAttribute('data-theme', themeName);
        
        // 更新图表颜色（如果图表已初始化）
        this.updateChartColors(themeName);
    }

    updateUI(themeName) {
        // 移除所有active类
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('active');
        });
        
        // 添加active类到当前选中的主题
        const activeOption = document.querySelector(`[data-theme="${themeName}"]`);
        if (activeOption) {
            activeOption.classList.add('active');
        }
    }

    updateChartColors(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        // 更新ECharts图表颜色
        const chartInstances = [
            'patientFlowChart', 'energyChart', 'trafficChart', 'qualityChart',
            'temperatureChart', 'humidityChart', 'airQualityChart', 'powerChart',
            'networkChart', 'revenueChart', 'equipmentStatusChart',
            'patientTrendChart', 'bedUsageGauge', 'emergencyChart', 'surgeryChart',
            'waitingTimeChart', 'satisfactionChart'
        ];

        chartInstances.forEach(chartName => {
            const chart = window[chartName];
            if (chart && typeof chart.setOption === 'function') {
                try {
                    // 根据主题更新图表颜色
                    this.updateChartOption(chart, theme, chartName);
                } catch (error) {
                    console.warn(`更新图表 ${chartName} 颜色失败:`, error);
                }
            }
        });
    }

    // 更新图表以适应夜间模式
    updateChartsForDarkMode(isDarkMode) {
        const chartInstances = [
            'patientFlowChart', 'energyChart', 'trafficChart', 'qualityChart',
            'temperatureChart', 'humidityChart', 'airQualityChart', 'powerChart',
            'networkChart', 'revenueChart', 'equipmentStatusChart',
            'patientTrendChart', 'bedUsageGauge', 'emergencyChart', 'surgeryChart',
            'waitingTimeChart', 'satisfactionChart'
        ];

        chartInstances.forEach(chartName => {
            const chart = window[chartName];
            if (chart && typeof chart.setOption === 'function') {
                try {
                    this.updateChartForDarkMode(chart, isDarkMode, chartName);
                } catch (error) {
                    console.warn(`更新图表 ${chartName} 夜间模式失败:`, error);
                }
            }
        });
    }

    updateChartForDarkMode(chart, isDarkMode, chartName) {
        const currentOption = chart.getOption();
        
        // 夜间模式的颜色配置
        const darkModeColors = {
            textColor: '#e0e0e0',
            gridColor: 'rgba(0, 100, 255, 0.1)',
            axisLineColor: 'rgba(0, 100, 255, 0.3)',
            primaryColor: '#00b4ff',
            secondaryColor: '#4caf50',
            warningColor: '#ffc107',
            errorColor: '#f44336'
        };

        // 白天模式的颜色配置
        const lightModeColors = {
            textColor: '#ffffff',
            gridColor: 'rgba(255, 255, 255, 0.1)',
            axisLineColor: '#ffffff',
            primaryColor: '#00ffff',
            secondaryColor: '#4caf50',
            warningColor: '#ff9800',
            errorColor: '#f44336'
        };

        const colors = isDarkMode ? darkModeColors : lightModeColors;

        // 更新文本颜色
        if (currentOption.textStyle) {
            currentOption.textStyle.color = colors.textColor;
        }

        // 更新网格颜色
        if (currentOption.grid?.splitLine) {
            currentOption.grid.splitLine.lineStyle.color = colors.gridColor;
        }

        // 更新坐标轴颜色
        if (currentOption.xAxis) {
            if (currentOption.xAxis.axisLabel) {
                currentOption.xAxis.axisLabel.color = colors.textColor;
            }
            if (currentOption.xAxis.axisLine) {
                currentOption.xAxis.axisLine.lineStyle.color = colors.axisLineColor;
            }
        }

        if (currentOption.yAxis) {
            if (currentOption.yAxis.axisLabel) {
                currentOption.yAxis.axisLabel.color = colors.textColor;
            }
            if (currentOption.yAxis.axisLine) {
                currentOption.yAxis.axisLine.lineStyle.color = colors.axisLineColor;
            }
            if (currentOption.yAxis.splitLine) {
                currentOption.yAxis.splitLine.lineStyle.color = colors.gridColor;
            }
        }

        // 更新系列颜色
        if (currentOption.series) {
            currentOption.series.forEach((series, index) => {
                if (series.itemStyle) {
                    series.itemStyle.color = colors.primaryColor;
                }
                if (series.lineStyle) {
                    series.lineStyle.color = colors.primaryColor;
                }
                if (series.areaStyle?.color) {
                    const alpha = isDarkMode ? '20' : '30';
                    series.areaStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: colors.primaryColor + alpha },
                        { offset: 1, color: colors.primaryColor + '05' }
                    ]);
                }
            });
        }

        chart.setOption(currentOption, true);
    }

    updateChartOption(chart, theme, chartName) {
        // 根据不同的图表类型应用不同的颜色方案
        const colorScheme = this.getColorScheme(theme);
        
        // 这里可以根据具体图表类型进行更精细的颜色控制
        // 由于图表配置比较复杂，这里提供一个通用的颜色更新方法
        const currentOption = chart.getOption();
        
        // 更新系列颜色
        if (currentOption.series) {
            currentOption.series.forEach(series => {
                if (series.itemStyle) {
                    series.itemStyle.color = colorScheme.primary;
                }
                if (series.lineStyle) {
                    series.lineStyle.color = colorScheme.secondary;
                }
                if (series.areaStyle?.color) {
                    series.areaStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: colorScheme.primary + '30' },
                        { offset: 1, color: colorScheme.primary + '05' }
                    ]);
                }
            });
        }
        
        chart.setOption(currentOption, true);
    }

    getColorScheme(theme) {
        return {
            primary: theme.primary,
            secondary: theme.secondary,
            accent: theme.accent
        };
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('开始初始化医院数据看板...');
        
        // 初始化主题模式管理器
        window.themeModeManager = new ThemeModeManager();
        
        // 初始化颜色主题管理器
        window.colorThemeManager = new ColorThemeManager();
        
        // 检测是否为手机端
        isMobile = window.innerWidth <= 768;
        
        // 初始化手机端导航
        initMobileNavigation();
        
        // 初始化手机端快速操作
        initMobileQuickActions();
        
        // 监听窗口大小变化
        window.addEventListener('resize', function() {
            const newIsMobile = window.innerWidth <= 768;
            if (newIsMobile !== isMobile) {
                isMobile = newIsMobile;
                // 重新初始化手机端导航
                initMobileNavigation();
            }
        });
        
        // 初始化时间显示
        updateTime();
        setInterval(updateTime, 2000); // 优化：从1秒改为2秒以提升性能
        
        // 延迟初始化图表，确保DOM和ECharts库完全加载
        setTimeout(function() {
            // 检查ECharts是否可用
            if (typeof echarts === 'undefined') {
                console.log('ECharts 未加载，等待加载...');
                setTimeout(function() {
                    initCharts();
                }, 1000);
            } else {
                initCharts();
            }
            
            // 额外检查等待时间图表
            setTimeout(function() {
                if (!window.waitingTimeChart) {
                    console.log('等待时间图表未初始化，尝试重新初始化...');
                    reinitWaitingTimeChart();
                } else {
                    console.log('等待时间图表已成功初始化');
                    // 测试图表是否能正常显示
                    window.waitingTimeChart.resize();
                }
            }, 500);
        }, 200);
        
        // 定期更新数据 - 优化：减少更新频率以提升性能
        setInterval(updateData, 10000); // 从5秒改为10秒
        setInterval(updateSystemStatus, 20000); // 从10秒改为20秒
        setInterval(updateMonitoringData, 8000); // 从3秒改为8秒
        setInterval(addNewAlert, 30000); // 从15秒改为30秒
        
        // 初始数据更新
        updateData();
        updateSystemStatus();
        updateMonitoringData();
        
        // 页面卸载时清理资源
        window.addEventListener('beforeunload', cleanup);
        window.addEventListener('unload', cleanup);
        
        // 确保所有元素可见
        ensureElementsVisible();
        
        // 初始化视频监控模态框
        initVideoModal();
        
        // 初始化车辆管理模态框
        initVehicleModal();
        
        console.log('医院数据看板初始化完成');
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

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    if (e.key === 'F11') {
        e.preventDefault();
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
});

// 全屏提示
function showFullscreenTip() {
    const tip = document.createElement('div');
    tip.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: #00e5ff;
        padding: 10px 15px;
        border-radius: 5px;
        border: 1px solid #00e5ff;
        font-size: 14px;
        z-index: 1000;
        /* 移除动画效果 */
    `;
    tip.textContent = '按F11键进入全屏模式';
    document.body.appendChild(tip);
    
    setTimeout(() => {
        document.body.removeChild(tip);
    }, 3000);
}


// 页面加载后显示提示
setTimeout(showFullscreenTip, 2000);

// 视频监控模态框功能
function initVideoModal() {
    // 创建模态框HTML结构
    createVideoModalHTML();
    
    // 添加点击事件监听器
    const securitySystemCard = document.querySelector('.security-system');
    if (securitySystemCard) {
        securitySystemCard.style.cursor = 'pointer';
        securitySystemCard.addEventListener('click', function() {
            showVideoModal();
        });
    }
    
    // 添加关闭按钮事件监听器
    const closeBtn = document.getElementById('video-modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideVideoModal);
    }
    
    // 添加ESC键关闭功能
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('video-modal');
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            hideVideoModal();
        }
    });
}

function createVideoModalHTML() {
    // 检查是否已经存在模态框
    if (document.getElementById('video-modal')) {
        return;
    }
    
    const modalHTML = `
        <div id="video-modal" class="video-modal" style="display: none;">
            <div class="video-modal-content">
                <div class="video-modal-header">
                    <h2>视频安防监控系统</h2>
                    <button id="video-modal-close" class="video-modal-close">&times;</button>
                </div>
                <div class="video-modal-body">
                    <div class="video-stats">
                        <div class="video-stat-item">
                            <span class="video-stat-label">在线摄像头</span>
                            <span class="video-stat-value" id="online-cameras">156</span>
                        </div>
                        <div class="video-stat-item">
                            <span class="video-stat-label">录像存储</span>
                            <span class="video-stat-value" id="storage-usage">85%</span>
                        </div>
                        <div class="video-stat-item">
                            <span class="video-stat-label">系统状态</span>
                            <span class="video-stat-value online" id="system-status">正常</span>
                        </div>
                    </div>
                    <div class="video-search-container">
                        <div class="search-box">
                            <input type="text" id="camera-search" placeholder="搜索摄像头位置或编号..." />
                            <div class="search-icon">🔍</div>
                        </div>
                        <div class="search-results-info">
                            <span id="search-results-count">显示 24 个摄像头</span>
                        </div>
                    </div>
                    <div class="video-grid-container">
                        <div class="video-grid" id="video-grid">
                            <!-- 摄像头画面将在这里动态生成 -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 生成摄像头画面
    generateCameraFeeds();
}

// 全局摄像头数据
let allCameras = [];
let filteredCameras = [];

function generateCameraFeeds() {
    const videoGrid = document.getElementById('video-grid');
    if (!videoGrid) return;
    
    // 清空现有内容
    videoGrid.innerHTML = '';
    
    // 扩展摄像头数据
    const cameraLocations = [
        '门诊大厅', '急诊科', '手术室', 'ICU病房', '药房', '收费处',
        '停车场入口', '停车场出口', '电梯间', '楼梯间', '走廊A', '走廊B',
        '医生办公室', '护士站', '药库', '设备间', '食堂', '会议室',
        '住院部入口', '住院部出口', '检验科', '放射科', '血库', '太平间',
        '儿科门诊', '妇产科', '骨科门诊', '心内科', '神经科', '眼科',
        '耳鼻喉科', '皮肤科', '口腔科', '康复科', '中医科', '心理科',
        '影像科', '检验科', '病理科', '药剂科', '营养科', '护理部',
        '行政楼1F', '行政楼2F', '行政楼3F', '行政楼4F', '行政楼5F', '行政楼6F',
        '住院部1F', '住院部2F', '住院部3F', '住院部4F', '住院部5F', '住院部6F',
        '住院部7F', '住院部8F', '住院部9F', '住院部10F', '住院部11F', '住院部12F',
        '地下车库B1', '地下车库B2', '地下车库B3', '设备机房', '配电室', '空调机房',
        '消防控制室', '监控中心', '网络机房', 'UPS机房', '发电机房', '水泵房',
        '锅炉房', '洗衣房', '垃圾房', '污水处理', '绿化区A', '绿化区B',
        '绿化区C', '绿化区D', '停车场A区', '停车场B区', '停车场C区', '停车场D区',
        '员工宿舍1', '员工宿舍2', '员工宿舍3', '员工宿舍4', '员工食堂', '员工活动室',
        '图书馆', '会议室A', '会议室B', '会议室C', '会议室D', '会议室E',
        '培训室1', '培训室2', '培训室3', '培训室4', '培训室5', '培训室6',
        '实验室1', '实验室2', '实验室3', '实验室4', '实验室5', '实验室6',
        '手术室1', '手术室2', '手术室3', '手术室4', '手术室5', '手术室6',
        '手术室7', '手术室8', '手术室9', '手术室10', '手术室11', '手术室12',
        'ICU病房1', 'ICU病房2', 'ICU病房3', 'ICU病房4', 'ICU病房5', 'ICU病房6',
        'ICU病房7', 'ICU病房8', 'ICU病房9', 'ICU病房10', 'ICU病房11', 'ICU病房12',
        '普通病房1', '普通病房2', '普通病房3', '普通病房4', '普通病房5', '普通病房6',
        '普通病房7', '普通病房8', '普通病房9', '普通病房10', '普通病房11', '普通病房12',
        '普通病房13', '普通病房14', '普通病房15', '普通病房16', '普通病房17', '普通病房18',
        '普通病房19', '普通病房20', '普通病房21', '普通病房22', '普通病房23', '普通病房24'
    ];
    
    // 生成156个摄像头画面
    allCameras = [];
    for (let i = 0; i < 156; i++) {
        const camera = {
            id: i + 1,
            location: cameraLocations[i] || `区域${i + 1}`,
            status: Math.random() > 0.05 ? 'online' : 'offline', // 95%在线率
            floor: Math.floor(i / 24) + 1,
            zone: String.fromCharCode(65 + (i % 26)) // A-Z区域
        };
        allCameras.push(camera);
    }
    
    // 初始显示所有摄像头
    filteredCameras = [...allCameras];
    renderCameraFeeds();
    
    // 初始化搜索功能
    initCameraSearch();
}

function renderCameraFeeds() {
    const videoGrid = document.getElementById('video-grid');
    if (!videoGrid) return;
    
    // 清空现有内容
    videoGrid.innerHTML = '';
    
    // 渲染过滤后的摄像头
    filteredCameras.forEach(camera => {
        const cameraFeed = document.createElement('div');
        cameraFeed.className = 'camera-feed';
        cameraFeed.setAttribute('data-camera-id', camera.id);
        cameraFeed.setAttribute('data-location', camera.location);
        cameraFeed.innerHTML = `
            <div class="camera-header">
                <span class="camera-id">摄像头 ${String(camera.id).padStart(3, '0')}</span>
                <span class="camera-status ${camera.status}">●</span>
            </div>
            <div class="camera-video">
                <div class="camera-placeholder">
                    <div class="camera-icon">📹</div>
                    <div class="camera-location">${camera.location}</div>
                    <div class="camera-info">
                        <div class="camera-floor">${camera.floor}楼</div>
                        <div class="camera-zone">${camera.zone}区</div>
                    </div>
                    <div class="camera-time">${new Date().toLocaleTimeString()}</div>
                </div>
            </div>
        `;
        videoGrid.appendChild(cameraFeed);
    });
    
    // 更新搜索结果计数
    updateSearchResultsCount();
}

function initCameraSearch() {
    const searchInput = document.getElementById('camera-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // 显示所有摄像头
            filteredCameras = [...allCameras];
        } else {
            // 过滤摄像头
            filteredCameras = allCameras.filter(camera => {
                return camera.location.toLowerCase().includes(searchTerm) ||
                       camera.id.toString().includes(searchTerm) ||
                       camera.floor.toString().includes(searchTerm) ||
                       camera.zone.toLowerCase().includes(searchTerm);
            });
        }
        
        // 重新渲染摄像头
        renderCameraFeeds();
    });
}

function updateSearchResultsCount() {
    const countElement = document.getElementById('search-results-count');
    if (countElement) {
        countElement.textContent = `显示 ${filteredCameras.length} 个摄像头`;
    }
}

function showVideoModal() {
    showModal('video-modal', updateVideoModalData, centerVideoWindow, initVideoWindowDrag, startVideoModalUpdates);
}

function hideVideoModal() {
    hideModal('video-modal', stopVideoModalUpdates);
}

// 通用模态框显示函数
function showModal(modalId, updateDataFunction, centerFunction, initDragFunction, startUpdatesFunction, additionalSetup) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // 更新实时数据
        if (updateDataFunction) updateDataFunction();
        
        // 显示窗口
        modal.style.display = 'block';
        
        // 等待DOM更新后居中显示窗口
        setTimeout(() => {
            if (centerFunction) centerFunction();
            
            // 添加淡入动画
            modal.classList.add('show');
            
            // 初始化拖动功能
            if (initDragFunction) initDragFunction();
            
            // 执行额外设置
            if (additionalSetup) additionalSetup();
        }, 50);
        
        // 开始实时更新
        if (startUpdatesFunction) startUpdatesFunction();
    }
}

// 通用模态框隐藏函数
function hideModal(modalId, stopUpdatesFunction, additionalCleanup) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            if (stopUpdatesFunction) stopUpdatesFunction();
            if (additionalCleanup) additionalCleanup();
        }, 300);
    }
}

// 居中视频窗口
// 通用窗口居中函数
function centerModalWindow(modalId, contentSelector) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const content = modal.querySelector(contentSelector);
        if (content) {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const contentWidth = content.offsetWidth;
            const contentHeight = content.offsetHeight;
            
            const left = (windowWidth - contentWidth) / 2;
            const top = (windowHeight - contentHeight) / 2;
            
            // 确保位置是有效的数值
            const finalLeft = Math.max(0, Math.round(left));
            const finalTop = Math.max(0, Math.round(top));
            
            content.style.left = finalLeft + 'px';
            content.style.top = finalTop + 'px';
            content.style.transform = 'none';
            
            console.log(`${modalId}窗口居中: ${finalLeft}, ${finalTop}, 尺寸: ${contentWidth}x${contentHeight}`);
        }
    }
}

function centerVideoWindow() {
    centerModalWindow('video-modal', '.video-modal-content');
}

function updateVideoModalData() {
    // 更新在线摄像头数量
    const onlineCamerasEl = document.getElementById('online-cameras');
    if (onlineCamerasEl) {
        const onlineCount = allCameras.filter(camera => camera.status === 'online').length;
        onlineCamerasEl.textContent = onlineCount;
    }
    
    // 更新存储使用率
    const storageUsageEl = document.getElementById('storage-usage');
    if (storageUsageEl) {
        const usage = (Math.random() * 10 + 80).toFixed(1); // 80-90之间
        storageUsageEl.textContent = usage + '%';
    }
    
    // 更新摄像头时间
    const cameraTimes = document.querySelectorAll('.camera-time');
    cameraTimes.forEach(timeEl => {
        timeEl.textContent = new Date().toLocaleTimeString();
    });
    
    // 随机更新一些摄像头的状态
    allCameras.forEach(camera => {
        if (Math.random() < 0.01) { // 1%概率改变状态
            camera.status = camera.status === 'online' ? 'offline' : 'online';
        }
    });
    
    // 如果当前有搜索过滤，重新渲染
    const searchInput = document.getElementById('camera-search');
    if (searchInput && searchInput.value.trim() !== '') {
        renderCameraFeeds();
    }
}

let videoModalUpdateInterval;

function startVideoModalUpdates() {
    // 每5秒更新一次数据
    videoModalUpdateInterval = setInterval(updateVideoModalData, 5000);
}

function stopVideoModalUpdates() {
    if (videoModalUpdateInterval) {
        clearInterval(videoModalUpdateInterval);
        videoModalUpdateInterval = null;
    }
}

// 通用窗口拖拽功能
function initModalWindowDrag(modalId, contentSelector, headerSelector) {
    const modal = document.getElementById(modalId);
    const content = modal.querySelector(contentSelector);
    const header = modal.querySelector(headerSelector);
    
    if (!content || !header) return;
    
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    // 获取当前窗口位置
    function getCurrentPosition() {
        const rect = content.getBoundingClientRect();
        return {
            x: rect.left,
            y: rect.top
        };
    }
    
    // 鼠标按下事件
    header.addEventListener('mousedown', dragStart);
    
    // 鼠标移动事件
    document.addEventListener('mousemove', drag);
    
    // 鼠标释放事件
    document.addEventListener('mouseup', dragEnd);
    
    // 触摸事件支持
    header.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', dragEnd);
    
    function dragStart(e) {
        // 获取当前窗口位置
        const currentPos = getCurrentPosition();
        xOffset = currentPos.x;
        yOffset = currentPos.y;
        
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
        
        if (e.target === header || header.contains(e.target)) {
            isDragging = true;
            header.style.cursor = 'grabbing';
            e.preventDefault();
        }
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            
            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }
            
            // 限制拖动范围
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const contentWidth = content.offsetWidth;
            const contentHeight = content.offsetHeight;
            
            const minX = 0;
            const maxX = windowWidth - contentWidth;
            const minY = 0;
            const maxY = windowHeight - contentHeight;
            
            const constrainedX = Math.max(minX, Math.min(maxX, currentX));
            const constrainedY = Math.max(minY, Math.min(maxY, currentY));
            
            content.style.left = constrainedX + 'px';
            content.style.top = constrainedY + 'px';
            content.style.transform = 'none';
            
            // 更新偏移量
            xOffset = constrainedX;
            yOffset = constrainedY;
        }
    }
    
    function dragEnd(e) {
        if (isDragging) {
            isDragging = false;
            header.style.cursor = 'grab';
        }
    }
}

// 视频窗口拖动功能
function initVideoWindowDrag() {
    initModalWindowDrag('video-modal', '.video-modal-content', '.video-modal-header');
}

// 车辆管理模态框功能
function initVehicleModal() {
    // 创建模态框HTML结构
    createVehicleModalHTML();
    
    // 添加点击事件监听器
    const vehicleSystemCard = document.querySelector('.vehicle-system');
    if (vehicleSystemCard) {
        vehicleSystemCard.style.cursor = 'pointer';
        vehicleSystemCard.addEventListener('click', function() {
            showVehicleModal();
        });
    }
    
    // 添加关闭按钮事件监听器
    const closeBtn = document.getElementById('vehicle-modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideVehicleModal);
    }
    
    // 添加ESC键关闭功能
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('vehicle-modal');
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            hideVehicleModal();
        }
    });
}

function createVehicleModalHTML() {
    // 检查是否已经存在模态框
    if (document.getElementById('vehicle-modal')) {
        return;
    }
    
    const modalHTML = `
        <div id="vehicle-modal" class="vehicle-modal" style="display: none;">
            <div class="vehicle-modal-content">
                <div class="vehicle-modal-header">
                    <h2>停车场管理系统</h2>
                    <button id="vehicle-modal-close" class="vehicle-modal-close">&times;</button>
                </div>
                <div class="vehicle-modal-body">
                    <div class="vehicle-stats">
                        <div class="vehicle-stat-item">
                            <span class="vehicle-stat-label">总车位</span>
                            <span class="vehicle-stat-value" id="total-parking-spots">245</span>
                        </div>
                        <div class="vehicle-stat-item">
                            <span class="vehicle-stat-label">已占用</span>
                            <span class="vehicle-stat-value" id="occupied-spots">191</span>
                        </div>
                        <div class="vehicle-stat-item">
                            <span class="vehicle-stat-label">使用率</span>
                            <span class="vehicle-stat-value" id="usage-rate">78%</span>
                        </div>
                        <div class="vehicle-stat-item">
                            <span class="vehicle-stat-label">空余车位</span>
                            <span class="vehicle-stat-value" id="available-spots">54</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// 全局停车场数据
let parkingData = {
    totalSpots: 245,
    occupiedSpots: 191,
    availableSpots: 54,
    usageRate: 78,
    dailyRevenue: 12580,
    hourlyFlow: [45, 52, 38, 41, 48, 55, 62, 58, 49, 43, 39, 35],
    vehicleTypes: {
        'VIP': 15,
        '普通': 120,
        '临时': 56
    }
};


function showVehicleModal() {
    showModal('vehicle-modal', updateVehicleModalData, centerVehicleWindow, initVehicleWindowDrag, startVehicleModalUpdates, 
        () => window.addEventListener('resize', handleVehicleModalResize));
}

function handleVehicleModalResize() {
    // 窗口大小变化处理
}

function hideVehicleModal() {
    hideModal('vehicle-modal', stopVehicleModalUpdates, 
        () => window.removeEventListener('resize', handleVehicleModalResize));
}

// 居中车辆管理窗口
function centerVehicleWindow() {
    centerModalWindow('vehicle-modal', '.vehicle-modal-content');
}

function updateVehicleModalData() {
    // 随机更新停车场数据
    const variation = Math.floor(Math.random() * 6) - 3; // -3 到 +3 的变化
    parkingData.occupiedSpots = Math.max(0, Math.min(245, parkingData.occupiedSpots + variation));
    parkingData.availableSpots = parkingData.totalSpots - parkingData.occupiedSpots;
    parkingData.usageRate = Math.round((parkingData.occupiedSpots / parkingData.totalSpots) * 100);
    
    // 更新收费金额
    const revenueVariation = Math.floor(Math.random() * 2000) - 1000; // -1000 到 +1000 的变化
    parkingData.dailyRevenue = Math.max(5000, parkingData.dailyRevenue + revenueVariation);
    
    // 更新小时流量数据
    parkingData.hourlyFlow = parkingData.hourlyFlow.map(value => {
        const change = Math.floor(Math.random() * 6) - 3;
        return Math.max(0, value + change);
    });
    
    // 更新车辆类型分布
    const typeVariation = Math.floor(Math.random() * 4) - 2;
    parkingData.vehicleTypes['普通'] = Math.max(0, parkingData.vehicleTypes['普通'] + typeVariation);
    parkingData.vehicleTypes['临时'] = Math.max(0, parkingData.vehicleTypes['临时'] - typeVariation);
    
    // 更新显示
    const totalSpotsEl = document.getElementById('total-parking-spots');
    const occupiedSpotsEl = document.getElementById('occupied-spots');
    const availableSpotsEl = document.getElementById('available-spots');
    const usageRateEl = document.getElementById('usage-rate');
    
    if (totalSpotsEl) totalSpotsEl.textContent = parkingData.totalSpots;
    if (occupiedSpotsEl) occupiedSpotsEl.textContent = parkingData.occupiedSpots;
    if (availableSpotsEl) availableSpotsEl.textContent = parkingData.availableSpots;
    if (usageRateEl) usageRateEl.textContent = parkingData.usageRate + '%';
    
}


let vehicleModalUpdateInterval;

function startVehicleModalUpdates() {
    // 每10秒更新一次数据
    vehicleModalUpdateInterval = setInterval(updateVehicleModalData, 10000);
}

function stopVehicleModalUpdates() {
    if (vehicleModalUpdateInterval) {
        clearInterval(vehicleModalUpdateInterval);
        vehicleModalUpdateInterval = null;
    }
}

// 车辆管理窗口拖动功能
function initVehicleWindowDrag() {
    initModalWindowDrag('vehicle-modal', '.vehicle-modal-content', '.vehicle-modal-header');
}
