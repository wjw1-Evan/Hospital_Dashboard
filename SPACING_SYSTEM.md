# 莫兰迪风格医院数据看板 - 间距系统

## 概述

本文档描述了莫兰迪风格医院数据看板的统一间距系统，基于8px网格系统设计，确保界面的一致性和可维护性。

## 间距变量系统

### 基础间距变量

```css
/* 间距系统 - 基于8px网格系统 */
--morandi-spacing-0: 0px;        /* 无间距 */
--morandi-spacing-1: 4px;        /* 最小间距 */
--morandi-spacing-2: 8px;        /* 小间距 */
--morandi-spacing-3: 12px;       /* 中小间距 */
--morandi-spacing-4: 16px;       /* 中等间距 */
--morandi-spacing-5: 20px;       /* 中大间距 */
--morandi-spacing-6: 24px;       /* 大间距 */
--morandi-spacing-8: 32px;       /* 超大间距 */
--morandi-spacing-10: 40px;      /* 特大间距 */
--morandi-spacing-12: 48px;      /* 最大间距 */
```

### 语义化间距别名

```css
/* 语义化间距别名 - 保持向后兼容 */
--morandi-spacing-xs: var(--morandi-spacing-1);    /* 4px */
--morandi-spacing-sm: var(--morandi-spacing-2);    /* 8px */
--morandi-spacing-md: var(--morandi-spacing-3);    /* 12px */
--morandi-spacing-lg: var(--morandi-spacing-4);    /* 16px */
--morandi-spacing-xl: var(--morandi-spacing-6);    /* 24px */
--morandi-spacing-2xl: var(--morandi-spacing-8);   /* 32px */
```

### 组件特定间距

```css
/* 组件特定间距 */
--morandi-spacing-card: var(--morandi-spacing-4);     /* 卡片内边距 */
--morandi-spacing-section: var(--morandi-spacing-6);  /* 区域间距 */
--morandi-spacing-grid: var(--morandi-spacing-3);     /* 网格间距 */
--morandi-spacing-list: var(--morandi-spacing-2);     /* 列表项间距 */
--morandi-spacing-button: var(--morandi-spacing-2);   /* 按钮内边距 */
--morandi-spacing-input: var(--morandi-spacing-2);    /* 输入框内边距 */
```

## 间距使用指南

### 1. 头部区域
- **头部容器内边距**: `var(--morandi-spacing-4) var(--morandi-spacing-6)`
- **头部控制元素间距**: `var(--morandi-spacing-4)`
- **时间显示内边距**: `var(--morandi-spacing-2) var(--morandi-spacing-3)`

### 2. 主要内容区域
- **主容器内边距**: `var(--morandi-spacing-4)`
- **区域间距**: `var(--morandi-spacing-section)`
- **卡片内边距**: `var(--morandi-spacing-card)`

### 3. 左侧区域
- **区域间距**: `var(--morandi-spacing-section)`
- **指标网格间距**: `var(--morandi-spacing-grid)`
- **列表项间距**: `var(--morandi-spacing-list)`

### 4. 中间区域
- **区域间距**: `var(--morandi-spacing-section)`
- **图表网格间距**: `var(--morandi-spacing-grid)`
- **实时指标间距**: `var(--morandi-spacing-grid)`

### 5. 右侧区域
- **区域间距**: `var(--morandi-spacing-section)`
- **系统网格间距**: `var(--morandi-spacing-2)`
- **告警列表间距**: `var(--morandi-spacing-list)`

## 响应式间距

### 大屏幕 (1200px+)
- 使用完整的间距系统
- 保持所有组件的标准间距

### 中等屏幕 (768px - 1200px)
- 适当减少网格间距
- 保持卡片内边距不变

### 小屏幕 (< 768px)
- 进一步减少间距
- 优化触摸交互体验

### 超小屏幕 (< 480px)
- 最小化间距
- 确保内容可读性

## 最佳实践

### 1. 间距选择原则
- **内容间距**: 使用 `spacing-2` 到 `spacing-4`
- **组件间距**: 使用 `spacing-3` 到 `spacing-6`
- **区域间距**: 使用 `spacing-6` 到 `spacing-8`

### 2. 一致性原则
- 相同类型的元素使用相同的间距
- 相关元素使用较小的间距
- 不相关元素使用较大的间距

### 3. 可维护性
- 优先使用语义化间距变量
- 避免硬编码数值
- 保持间距系统的层次结构

## 更新记录

- **2024-01-XX**: 创建统一的间距系统
- **2024-01-XX**: 应用间距变量到所有组件
- **2024-01-XX**: 优化响应式间距

## 注意事项

1. 所有间距都基于8px网格系统，确保视觉一致性
2. 语义化变量名便于理解和维护
3. 组件特定间距变量提供更精确的控制
4. 响应式设计确保在不同设备上的良好体验
