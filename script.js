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
function updateDetailedMetrics() {
    // 收入情况
    const dailyRevenue = Math.floor(Math.random() * 500000) + 2000000;
    const revenueComparison = (Math.random() * 20 - 5).toFixed(1);
    
    const dailyRevenueEl = document.getElementById('daily-revenue');
    const revenueComparisonElement = document.getElementById('revenue-comparison');
    
    if (dailyRevenueEl) dailyRevenueEl.textContent = '¥' + dailyRevenue.toLocaleString();
    if (revenueComparisonElement) {
        revenueComparisonElement.textContent = (revenueComparison > 0 ? '+' : '') + revenueComparison + '%';
        revenueComparisonElement.className = 'comparison-value ' + (revenueComparison > 0 ? 'up' : 'down');
    }
    
    // 患者流量统计 - 检查元素是否存在
    const todayPatients = Math.floor(Math.random() * 300) + 1000;
    const patientComparison = (Math.random() * 15 - 5).toFixed(1);
    
    const todayPatientsEl = document.getElementById('today-patients');
    const patientComparisonEl = document.getElementById('patient-comparison');
    
    if (todayPatientsEl) todayPatientsEl.textContent = todayPatients.toLocaleString();
    if (patientComparisonEl) {
        patientComparisonEl.textContent = (patientComparison > 0 ? '+' : '') + patientComparison + '%';
        patientComparisonEl.className = 'patient-value ' + (patientComparison > 0 ? 'up' : 'down');
    }
    
    // 更新患者流量趋势图表数据
    if (patientFlowChart && typeof patientFlowChart.setOption === 'function') {
        const currentData = [45, 23, 156, 234, 189, 78].map(val => val + Math.floor(Math.random() * 20 - 10));
        const lastYearData = [38, 45, 142, 198, 165, 89].map(val => val + Math.floor(Math.random() * 15 - 8));
        const lastMonthData = [42, 28, 148, 215, 172, 85].map(val => val + Math.floor(Math.random() * 18 - 9));
        
        patientFlowChart.setOption({
            series: [
                { data: currentData },
                { data: lastYearData },
                { data: lastMonthData }
            ]
        });
    }
    
    // 医护人员 - 检查元素是否存在
    const staffOnDuty = Math.floor(Math.random() * 100) + 1200;
    const attendanceRate = (Math.random() * 5 + 95).toFixed(1);
    
    const staffOnDutyEl = document.getElementById('staff-on-duty');
    const attendanceRateEl = document.getElementById('attendance-rate');
    
    if (staffOnDutyEl) staffOnDutyEl.textContent = staffOnDuty.toLocaleString();
    if (attendanceRateEl) attendanceRateEl.textContent = attendanceRate + '%';
    
    // 药品库存 - 检查元素是否存在
    const medicationStock = Math.floor(Math.random() * 20) + 80;
    const outOfStock = Math.floor(Math.random() * 20) + 5;
    
    const medicationStockEl = document.getElementById('medication-stock');
    const outOfStockElement = document.getElementById('out-of-stock');
    
    if (medicationStockEl) medicationStockEl.textContent = medicationStock + '%';
    if (outOfStockElement) {
        outOfStockElement.textContent = outOfStock + '种';
        outOfStockElement.className = 'comparison-value ' + (outOfStock > 15 ? 'warning' : 'normal');
    }
    
    // 工作效率 - 检查元素是否存在
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
        hospitalLoadStatus.textContent = hospitalLoad > 85 ? '高负荷' : hospitalLoad > 70 ? '正常' : '低负荷';
        hospitalLoadStatus.className = hospitalLoad > 85 ? 'comparison-value warning' : 'comparison-value normal';
    }
    
    if (powerStatus) {
        const powerValue = parseFloat(powerConsumption);
        powerStatus.textContent = powerValue > 50 ? '高功耗' : powerValue > 35 ? '正常' : '低功耗';
        powerStatus.className = powerValue > 50 ? 'comparison-value warning' : 'comparison-value normal';
    }
    
    // 更新能源统计
    const dailyPower = Math.floor(Math.random() * 200) + 1200;
    const powerComparison = (Math.random() * 10 - 5).toFixed(1);
    
    const dailyPowerEl = document.getElementById('daily-power');
    const comparisonElement = document.getElementById('power-comparison');
    
    if (dailyPowerEl) dailyPowerEl.textContent = dailyPower.toLocaleString() + ' kWh';
    if (comparisonElement) {
        comparisonElement.textContent = powerComparison + '%';
        comparisonElement.className = powerComparison > 0 ? 'energy-value up' : 'energy-value down';
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
    let patientFlowChart = null;
    if (patientFlowElement) {
        patientFlowChart = echarts.init(patientFlowElement);
    }
    const patientFlowOption = {
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
    if (patientFlowChart) {
        patientFlowChart.setOption(patientFlowOption);
    }

    // 患者流量趋势图表日月切换功能
    const toggleButtons = document.querySelectorAll('.chart-toggle .toggle-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的active类
            this.classList.add('active');
            
            // 获取切换的周期
            const period = this.getAttribute('data-period');
            
            // 更新图表数据
            if (patientFlowChart) {
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
                    const monthData = Array.from({length: 30}, () => Math.floor(Math.random() * 100) + 50);
                    const lastMonthData = Array.from({length: 30}, () => Math.floor(Math.random() * 100) + 45);
                    const lastYearData = Array.from({length: 30}, () => Math.floor(Math.random() * 100) + 40);
                    
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
                            data: Array.from({length: 30}, (_, i) => `${i + 1}日`),
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
                patientFlowChart.setOption(newOption, true);
            }
        });
    });

    // 能源消耗图表
    const energyElement = document.getElementById('energyChart');
    let energyChart = null;
    if (energyElement) {
        energyChart = echarts.init(energyElement);
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
    if (energyChart) {
        energyChart.setOption(energyOption);
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
            
            // 更新图表数据
            if (energyChart) {
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
                energyChart.setOption(newOption, true);
            }
        });
    });

    // 交通流量图表
    const trafficElement = document.getElementById('trafficChart');
    let trafficChart = null;
    if (trafficElement) {
        trafficChart = echarts.init(trafficElement);
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
    if (trafficChart) {
        trafficChart.setOption(trafficOption);
    }

    // 医疗质量指标图表
    const qualityElement = document.getElementById('qualityChart');
    let qualityChart = null;
    if (qualityElement) {
        qualityChart = echarts.init(qualityElement);
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
    if (qualityChart) {
        qualityChart.setOption(qualityOption);
    }

    // 温度监控图表
    const temperatureElement = document.getElementById('temperatureChart');
    let temperatureChart = null;
    if (temperatureElement) {
        temperatureChart = echarts.init(temperatureElement);
    }
    const temperatureOption = {
        backgroundColor: 'transparent',
        series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            
            center: ['50%', '85%'],
            radius: '140%',
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
    if (temperatureChart) {
        temperatureChart.setOption(temperatureOption);
    }

    // 湿度监控图表
    const humidityElement = document.getElementById('humidityChart');
    let humidityChart = null;
    if (humidityElement) {
        humidityChart = echarts.init(humidityElement);
    }
    const humidityOption = {
        backgroundColor: 'transparent',
        series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            center: ['50%', '85%'],
            radius: '140%',
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
    if (humidityChart) {
        humidityChart.setOption(humidityOption);
    }

    // 空气质量监控图表
    const airQualityElement = document.getElementById('airQualityChart');
    let airQualityChart = null;
    if (airQualityElement) {
        airQualityChart = echarts.init(airQualityElement);
    }
    const airQualityOption = {
        backgroundColor: 'transparent',
        series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            center: ['50%', '85%'],
            radius: '140%',
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
    if (airQualityChart) {
        airQualityChart.setOption(airQualityOption);
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
            radius: '140%', 
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
    let networkChart = null;
    if (networkElement) {
        networkChart = echarts.init(networkElement);
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
    if (networkChart) {
        networkChart.setOption(networkOption);
    }

    // 收入分析饼图
    const revenueElement = document.getElementById('revenueChart');
    let revenueChart = null;
    if (revenueElement) {
        revenueChart = echarts.init(revenueElement);
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
    if (revenueChart) {
        revenueChart.setOption(revenueOption);
    }

    // 设备状态图表
    const equipmentStatusElement = document.getElementById('equipmentStatusChart');
    let equipmentStatusChart = null;
    if (equipmentStatusElement) {
        equipmentStatusChart = echarts.init(equipmentStatusElement);
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
    if (equipmentStatusChart) {
        equipmentStatusChart.setOption(equipmentStatusOption);
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
            if (energyChart) energyChart.resize();
            if (patientFlowChart) patientFlowChart.resize();
            if (trafficChart) trafficChart.resize();
            if (qualityChart) qualityChart.resize();
            if (temperatureChart) temperatureChart.resize();
            if (humidityChart) humidityChart.resize();
            if (airQualityChart) airQualityChart.resize();
            if (window.powerChart && typeof window.powerChart.resize === 'function') window.powerChart.resize();
            if (networkChart) networkChart.resize();
            if (revenueChart) revenueChart.resize();
            if (equipmentStatusChart) equipmentStatusChart.resize();
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
                if (series.areaStyle && series.areaStyle.color) {
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
        
        // 初始化颜色主题管理器
        window.colorThemeManager = new ColorThemeManager();
        
        // 初始化时间显示
        updateTime();
        setInterval(updateTime, 1000);
        
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
        
        // 定期更新数据
        setInterval(updateData, 5000);
        setInterval(updateSystemStatus, 10000);
        setInterval(updateMonitoringData, 3000);
        setInterval(addNewAlert, 15000);
        
        // 初始数据更新
        updateData();
        updateSystemStatus();
        updateMonitoringData();
        
        // 确保所有元素可见
        ensureElementsVisible();
        
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

// CSS动画
// 移除动画样式
// const style = document.createElement('style');
// style.textContent = `
//     @keyframes fadeInOut {
//         0% { opacity: 0; transform: translateX(100%); }
//         20% { opacity: 1; transform: translateX(0); }
//         80% { opacity: 1; transform: translateX(0); }
//         100% { opacity: 0; transform: translateX(100%); }
//     }
// `;
// document.head.appendChild(style);

// 页面加载后显示提示
setTimeout(showFullscreenTip, 2000);
