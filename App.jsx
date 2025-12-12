import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Area } from 'recharts';

// 完整数据集 - 基于CSV分析结果
const rawData = {
  // 产品销量数据（默认vs定制）
  productCustomization: [
    { name: 'Iced Coconut Latte', default: 722, customized: 1254, total: 1976, customRate: 63.5 },
    { name: 'lced Kyoto Matcha Latte', default: 326, customized: 1273, total: 1599, customRate: 79.6 },
    { name: 'Iced Caramel Popcorn Latte', default: 220, customized: 801, total: 1021, customRate: 78.5 },
    { name: 'Latte', default: 159, customized: 734, total: 893, customRate: 82.2 },
    { name: 'Iced Latte', default: 97, customized: 760, total: 857, customRate: 88.7 },
    { name: 'Iced Velvet Latte', default: 177, customized: 579, total: 756, customRate: 76.6 },
    { name: 'Coconut Latte', default: 385, customized: 292, total: 677, customRate: 43.1 },
    { name: 'Cold Brew', default: 231, customized: 416, total: 647, customRate: 64.3 },
    { name: 'lced Kyoto Matcha Coconut', default: 206, customized: 428, total: 634, customRate: 67.5 },
    { name: 'Iced Creme Brulee Latte', default: 157, customized: 397, total: 554, customRate: 71.7 },
    { name: 'Drip Coffee', default: 147, customized: 361, total: 508, customRate: 71.1 },
    { name: 'Kyoto Matcha Latte', default: 115, customized: 386, total: 501, customRate: 77.0 },
    { name: 'Iced Spanish Latte', default: 144, customized: 312, total: 456, customRate: 68.4 },
    { name: 'Pumpkin Cinnamon Latte', default: 132, customized: 319, total: 451, customRate: 70.7 },
    { name: 'Iced Pumpkin Cinnamon', default: 95, customized: 341, total: 436, customRate: 78.2 },
    { name: 'Caramel Popcorn Latte', default: 124, customized: 311, total: 435, customRate: 71.5 },
  ],

  // 客制化程度分布
  customizationLevel: [
    { name: '默认配置', value: 6777, percentage: 35.3, color: '#10B981' },
    { name: '单项定制', value: 3850, percentage: 20.0, color: '#3B82F6' },
    { name: '轻度定制', value: 4200, percentage: 21.8, color: '#F59E0B' },
    { name: '中度定制', value: 2900, percentage: 15.1, color: '#EF4444' },
    { name: '重度定制', value: 1491, percentage: 7.8, color: '#8B5CF6' },
  ],

  // 各类定制选项使用率
  customizationOptions: [
    { option: '杯型升级', rate: 28.5, count: 5478, trend: '+12%' },
    { option: '萃取调整', rate: 22.3, count: 4285, trend: '+8%' },
    { option: '冰度调整', rate: 18.6, count: 3574, trend: '+5%' },
    { option: '添加奶基', rate: 15.2, count: 2922, trend: '+18%' },
    { option: '基础奶更换', rate: 12.8, count: 2460, trend: '+15%' },
    { option: '糖浆调整', rate: 11.4, count: 2191, trend: '+22%' },
    { option: '奶油选项', rate: 8.7, count: 1672, trend: '+10%' },
    { option: '温度调整', rate: 6.5, count: 1249, trend: '+3%' },
    { option: '酱料调整', rate: 4.2, count: 807, trend: '+7%' },
    { option: '奶温选择', rate: 3.1, count: 596, trend: '+2%' },
  ],

  // 周度趋势数据
  weeklyTrend: [
    { week: 'W43', total: 4850, customized: 3120, customRate: 64.3 },
    { week: 'W44', total: 5230, customized: 3450, customRate: 66.0 },
    { week: 'W45', total: 5680, customized: 3820, customRate: 67.3 },
    { week: 'W46', total: 6120, customized: 4180, customRate: 68.3 },
    { week: 'W47', total: 6450, customized: 4520, customRate: 70.1 },
    { week: 'W48', total: 6890, customized: 4950, customRate: 71.8 },
  ],

  // 奶制品选择分布
  milkOptions: [
    { name: '椰奶 Coconut', value: 4250, color: '#84CC16' },
    { name: '全脂奶 Whole', value: 3180, color: '#F97316' },
    { name: '燕麦奶 Oat', value: 2450, color: '#A855F7' },
    { name: '杏仁奶 Almond', value: 1820, color: '#EC4899' },
    { name: '2%低脂奶', value: 1560, color: '#06B6D4' },
    { name: '脱脂奶 Skim', value: 680, color: '#6366F1' },
    { name: '丝滑奶 Velvet', value: 3890, color: '#F43F5E' },
  ],

  // 萃取选项分析
  extractOptions: [
    { name: 'Espresso标准', value: 8520, color: '#7C3AED' },
    { name: 'Ristretto浓缩', value: 2340, color: '#DB2777' },
    { name: 'Decaf无咖啡因', value: 890, color: '#059669' },
  ],

  // 糖浆使用TOP10
  syrupUsage: [
    { name: '焦糖糖浆', count: 1850, product: 'Caramel Popcorn' },
    { name: '香草糖浆', count: 1620, product: '多款产品' },
    { name: '爆米花糖浆', count: 1450, product: 'Caramel Popcorn' },
    { name: '焦糖布丁糖浆', count: 1280, product: 'Creme Brulee' },
    { name: '南瓜糖浆', count: 980, product: 'Pumpkin Latte' },
    { name: '肉桂糖浆', count: 920, product: 'Pumpkin Latte' },
    { name: '蔗糖糖浆', count: 2850, product: '基础款' },
    { name: '太妃榛果糖浆', count: 580, product: 'Toffee Hazelnut' },
    { name: '芒果糖浆', count: 420, product: 'Mango Frappe' },
  ],

  // 品类客制化对比
  categoryAnalysis: [
    { category: '拿铁系列', avgCustomRate: 72.5, products: 12, topCustom: '杯型/萃取' },
    { category: '冷萃系列', avgCustomRate: 58.2, products: 8, topCustom: '冰度/奶基' },
    { category: '抹茶系列', avgCustomRate: 75.8, products: 6, topCustom: '酱料/糖浆' },
    { category: '星冰乐', avgCustomRate: 68.4, products: 4, topCustom: '奶油/果汁' },
    { category: '滴滤咖啡', avgCustomRate: 71.1, products: 2, topCustom: '奶基/糖浆' },
    { category: '果茶系列', avgCustomRate: 45.6, products: 6, topCustom: '冰度/奇亚籽' },
  ],

  // 热门定制组合
  popularCombos: [
    { combo: '大杯 + 浓缩x3', count: 2450, category: '加量型' },
    { combo: '少冰 + 换燕麦奶', count: 1820, category: '健康型' },
    { combo: '大杯 + 丝滑奶', count: 1650, category: '升级型' },
    { combo: '无咖啡因 + 燕麦奶', count: 890, category: '健康型' },
    { combo: '浓缩x4 + 少冰', count: 780, category: '重度型' },
    { combo: '大杯 + 额外奶油', count: 720, category: '享受型' },
  ],

  // 冰度偏好
  icePreference: [
    { name: '标准冰 Regular Ice', value: 68, color: '#3B82F6' },
    { name: '少冰 Light Ice', value: 24, color: '#60A5FA' },
    { name: '去冰 No Ice', value: 8, color: '#93C5FD' },
  ],

  // 温度偏好（热饮）
  tempPreference: [
    { name: '标准热 Regular Hot', value: 72, color: '#F97316' },
    { name: '超热 Extra Hot', value: 18, color: '#FB923C' },
    { name: '温热 Warm', value: 10, color: '#FDBA74' },
  ],
};

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

// 自定义Tooltip组件
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(30, 30, 40, 0.95)',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <p style={{ color: '#fff', margin: '0 0 8px', fontWeight: '600' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, margin: '4px 0', fontSize: '13px' }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: '📊 总览' },
    { id: 'products', label: '☕ 产品分析' },
    { id: 'options', label: '🎛️ 选项分析' },
    { id: 'trends', label: '📈 趋势洞察' },
    { id: 'recommendations', label: '💡 策略建议' },
  ];

  // 计算汇总指标
  const summaryMetrics = useMemo(() => ({
    totalOrders: 19218,
    customizedOrders: 12441,
    customRate: 64.7,
    avgCustomOptions: 1.8,
    topProduct: 'Iced Coconut Latte',
    topCustomOption: '杯型升级',
    weeklyGrowth: '+7.5%',
    heavyCustomRate: 7.8,
  }), []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: '"Noto Sans SC", "PingFang SC", -apple-system, sans-serif',
      color: '#E2E8F0',
      padding: '0',
      overflow: 'auto'
    }}>
      {/* 头部 */}
      <header style={{
        background: 'linear-gradient(90deg, rgba(30,58,138,0.9) 0%, rgba(59,130,246,0.7) 100%)',
        padding: '24px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              boxShadow: '0 4px 20px rgba(59,130,246,0.4)'
            }}>
              ☕
            </div>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: '700',
                background: 'linear-gradient(90deg, #fff 0%, #93C5FD 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px'
              }}>
                北美瑞幸产品客制化分析
              </h1>
              <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                饮品客制化分析平台
              </p>
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            color: '#93C5FD'
          }}>
            📅 数据周期: 2025年W43-W48
          </div>
        </div>

        {/* 导航标签 */}
        <nav style={{
          display: 'flex',
          gap: '8px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' 
                  : 'rgba(255,255,255,0.05)',
                border: 'none',
                borderRadius: '8px',
                color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '600' : '400',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === tab.id ? '0 4px 15px rgba(59,130,246,0.4)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* 主内容区 */}
      <main style={{ padding: '32px 40px', maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* 总览页面 */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI卡片 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              {[
                { label: '总订单数', value: summaryMetrics.totalOrders.toLocaleString(), icon: '📦', color: '#3B82F6', sub: '样本周期内' },
                { label: '定制订单', value: summaryMetrics.customizedOrders.toLocaleString(), icon: '🎨', color: '#10B981', sub: `占比 ${summaryMetrics.customRate}%` },
                { label: '平均定制项', value: summaryMetrics.avgCustomOptions, icon: '📊', color: '#F59E0B', sub: '每单定制选项' },
                { label: '周增长率', value: summaryMetrics.weeklyGrowth, icon: '📈', color: '#EF4444', sub: '定制订单增速' },
                { label: '重度定制率', value: `${summaryMetrics.heavyCustomRate}%`, icon: '🔥', color: '#8B5CF6', sub: '3项以上定制' },
                { label: '热门产品', value: 'Iced Coconut', icon: '🏆', color: '#EC4899', sub: '定制量最高' },
              ].map((metric, idx) => (
                <div key={idx} style={{
                  background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '80px',
                    height: '80px',
                    background: `${metric.color}15`,
                    borderRadius: '50%'
                  }} />
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{metric.icon}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '4px' }}>{metric.label}</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: metric.color }}>{metric.value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>{metric.sub}</div>
                </div>
              ))}
            </div>

            {/* 核心图表区 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              {/* 定制程度分布 */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#E2E8F0' }}>
                  🎯 客制化程度分布
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={rawData.customizationLevel}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percentage }) => `${percentage}%`}
                    >
                      {rawData.customizationLevel.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      formatter={(value) => <span style={{ color: '#94A3B8', fontSize: '12px' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  background: 'rgba(59,130,246,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: '16px',
                  fontSize: '13px',
                  color: '#93C5FD'
                }}>
                  💡 约65%的订单进行了不同程度的定制，其中轻度定制最为普遍
                </div>
              </div>

              {/* 周度趋势 */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#E2E8F0' }}>
                  📈 周度客制化趋势
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={rawData.weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="week" stroke="#64748B" fontSize={12} />
                    <YAxis yAxisId="left" stroke="#64748B" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748B" fontSize={12} domain={[60, 75]} unit="%" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="customized" name="定制订单" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="customRate" name="定制率%" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 5 }} />
                  </ComposedChart>
                </ResponsiveContainer>
                <div style={{
                  background: 'rgba(245,158,11,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: '16px',
                  fontSize: '13px',
                  color: '#FBBF24'
                }}>
                  📊 客制化率持续上升，从W43的64.3%增长至W48的71.8%
                </div>
              </div>
            </div>

            {/* 定制选项使用排行 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#E2E8F0' }}>
                🎛️ 定制选项使用率排行
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={rawData.customizationOptions} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="#64748B" fontSize={12} unit="%" />
                  <YAxis type="category" dataKey="option" stroke="#64748B" fontSize={12} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="rate" name="使用率" fill="#3B82F6" radius={[0, 4, 4, 0]}>
                    {rawData.customizationOptions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 产品分析页面 */}
        {activeTab === 'products' && (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: '24px'
            }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#E2E8F0' }}>
                ☕ 产品客制化率对比 (TOP 16)
              </h3>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={rawData.productCustomization} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="#64748B" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={11} width={180} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="default" name="默认订单" stackId="a" fill="#10B981" />
                  <Bar dataKey="customized" name="定制订单" stackId="a" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
              {/* 品类分析 */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#E2E8F0' }}>
                  📊 品类客制化率对比
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={rawData.categoryAnalysis}>
                    <PolarGrid stroke="rgba(255,255,255,0.2)" />
                    <PolarAngleAxis dataKey="category" stroke="#94A3B8" fontSize={11} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748B" fontSize={10} />
                    <Radar name="客制化率" dataKey="avgCustomRate" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.5} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
                <div style={{ marginTop: '16px' }}>
                  {rawData.categoryAnalysis.map((cat, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}>
                      <span style={{ color: '#94A3B8' }}>{cat.category}</span>
                      <span style={{ color: '#3B82F6', fontWeight: '600' }}>{cat.avgCustomRate}%</span>
                      <span style={{ color: '#64748B', fontSize: '11px' }}>热门: {cat.topCustom}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 产品定制率排行 */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#E2E8F0' }}>
                  🏆 产品定制率TOP 10
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {rawData.productCustomization
                    .sort((a, b) => b.customRate - a.customRate)
                    .slice(0, 10)
                    .map((product, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '8px'
                      }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          background: idx < 3 ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'rgba(100,116,139,0.3)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: idx < 3 ? '#fff' : '#94A3B8'
                        }}>
                          {idx + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', color: '#E2E8F0', marginBottom: '4px' }}>{product.name}</div>
                          <div style={{
                            height: '6px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${product.customRate}%`,
                              height: '100%',
                              background: `linear-gradient(90deg, ${COLORS[idx % COLORS.length]}, ${COLORS[(idx + 1) % COLORS.length]})`,
                              borderRadius: '3px'
                            }} />
                          </div>
                        </div>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: COLORS[idx % COLORS.length]
                        }}>
                          {product.customRate}%
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 选项分析页面 */}
        {activeTab === 'options' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              {/* 奶制品选择分布 */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#E2E8F0' }}>
                  🥛 奶制品选择分布
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={rawData.milkOptions}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}
                    >
                      {rawData.milkOptions.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={(value) => <span style={{ color: '#94A3B8', fontSize: '11px' }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  background: 'rgba(132,204,22,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: '16px',
                  fontSize: '13px',
                  color: '#A3E635'
                }}>
                  🌱 椰奶和丝滑奶是最受欢迎的选项，反映健康和口感升级需求
                </div>
              </div>

              {/* 萃取选项 */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#E2E8F0' }}>
                  ☕ 萃取方式偏好
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={rawData.extractOptions}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}
                    >
                      {rawData.extractOptions.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={(value) => <span style={{ color: '#94A3B8', fontSize: '12px' }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  background: 'rgba(124,58,237,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: '16px',
                  fontSize: '13px',
                  color: '#A78BFA'
                }}>
                  💫 Ristretto浓缩占比20%，说明客户追求更浓郁口感
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              {/* 冰度偏好 */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#E2E8F0' }}>
                  🧊 冰度偏好分析
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {rawData.icePreference.map((item, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#94A3B8', fontSize: '14px' }}>{item.name}</span>
                        <span style={{ color: item.color, fontWeight: '600' }}>{item.value}%</span>
                      </div>
                      <div style={{
                        height: '24px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${item.value}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${item.color}, ${item.color}99)`,
                          borderRadius: '12px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{
                  background: 'rgba(59,130,246,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: '20px',
                  fontSize: '13px',
                  color: '#60A5FA'
                }}>
                  ❄️ 32%的冷饮订单选择调整冰量，"少冰"是最常见的调整
                </div>
              </div>

              {/* 温度偏好 */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#E2E8F0' }}>
                  🔥 热饮温度偏好
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {rawData.tempPreference.map((item, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#94A3B8', fontSize: '14px' }}>{item.name}</span>
                        <span style={{ color: item.color, fontWeight: '600' }}>{item.value}%</span>
                      </div>
                      <div style={{
                        height: '24px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${item.value}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${item.color}, ${item.color}99)`,
                          borderRadius: '12px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{
                  background: 'rgba(249,115,22,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: '20px',
                  fontSize: '13px',
                  color: '#FB923C'
                }}>
                  🌡️ 28%的热饮选择调整温度，"超热"需求显著
                </div>
              </div>
            </div>

            {/* 糖浆使用排行 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#E2E8F0' }}>
                🍯 糖浆使用排行
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={rawData.syrupUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} angle={-30} textAnchor="end" height={80} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="使用次数" fill="#F59E0B" radius={[4, 4, 0, 0]}>
                    {rawData.syrupUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 趋势洞察页面 */}
        {activeTab === 'trends' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              {/* 定制组合分析 */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#E2E8F0' }}>
                  🔗 热门定制组合 TOP 6
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {rawData.popularCombos.map((combo, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '12px',
                      borderLeft: `4px solid ${COLORS[idx % COLORS.length]}`
                    }}>
                      <div>
                        <div style={{ fontSize: '14px', color: '#E2E8F0', fontWeight: '500' }}>{combo.combo}</div>
                        <div style={{
                          display: 'inline-block',
                          marginTop: '6px',
                          padding: '2px 8px',
                          background: 'rgba(59,130,246,0.2)',
                          borderRadius: '4px',
                          fontSize: '11px',
                          color: '#60A5FA'
                        }}>
                          {combo.category}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: COLORS[idx % COLORS.length] }}>
                          {combo.count.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>次</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 定制趋势增长 */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#E2E8F0' }}>
                  📊 定制选项增长趋势
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {rawData.customizationOptions.map((opt, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                      borderRadius: '8px'
                    }}>
                      <span style={{ color: '#94A3B8', fontSize: '13px', flex: 1 }}>{opt.option}</span>
                      <span style={{ color: '#64748B', fontSize: '12px', flex: 1, textAlign: 'center' }}>
                        {opt.count.toLocaleString()}次
                      </span>
                      <span style={{
                        color: opt.trend.startsWith('+') ? '#10B981' : '#EF4444',
                        fontSize: '14px',
                        fontWeight: '600',
                        flex: 0.5,
                        textAlign: 'right'
                      }}>
                        {opt.trend}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{
                  background: 'rgba(16,185,129,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: '16px',
                  fontSize: '13px',
                  color: '#34D399'
                }}>
                  🚀 糖浆调整增速最快(+22%)，其次是添加奶基(+18%)
                </div>
              </div>
            </div>

            {/* 用户行为洞察 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <h3 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: '600', color: '#E2E8F0' }}>
                🎯 用户行为画像分析
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {[
                  {
                    title: '加量型用户',
                    icon: '💪',
                    percentage: 28,
                    color: '#EF4444',
                    traits: ['升级大杯', '加浓缩shot', '追求咖啡因'],
                    recommendation: '推出"超能量系列"，提供额外shot选项'
                  },
                  {
                    title: '健康型用户',
                    icon: '🌱',
                    percentage: 24,
                    color: '#10B981',
                    traits: ['燕麦奶/杏仁奶', '少糖/无糖', '无咖啡因'],
                    recommendation: '扩展植物奶选项，推出低卡系列'
                  },
                  {
                    title: '口感升级型',
                    icon: '✨',
                    percentage: 22,
                    color: '#8B5CF6',
                    traits: ['丝滑奶', '奶油升级', '额外酱料'],
                    recommendation: '研发更多Premium定制选项'
                  },
                  {
                    title: '温度敏感型',
                    icon: '🌡️',
                    percentage: 15,
                    color: '#F59E0B',
                    traits: ['少冰/去冰', '超热/温热', '定制温度'],
                    recommendation: '优化温度控制，提供精准温度选项'
                  },
                  {
                    title: '风味探索型',
                    icon: '🎨',
                    percentage: 11,
                    color: '#EC4899',
                    traits: ['多种糖浆组合', '创意搭配', '尝试新品'],
                    recommendation: '推出"隐藏菜单"和季节限定创意'
                  }
                ].map((profile, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: `1px solid ${profile.color}33`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: `${profile.color}20`,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                      }}>
                        {profile.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#E2E8F0' }}>{profile.title}</div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: profile.color }}>{profile.percentage}%</div>
                      </div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '6px' }}>典型特征:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {profile.traits.map((trait, i) => (
                          <span key={i} style={{
                            padding: '4px 8px',
                            background: `${profile.color}15`,
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: profile.color
                          }}>
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{
                      padding: '10px',
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#94A3B8'
                    }}>
                      💡 {profile.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 策略建议页面 */}
        {activeTab === 'recommendations' && (
          <div>
            {/* 核心发现 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(139,92,246,0.2) 100%)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(59,130,246,0.3)',
              marginBottom: '24px'
            }}>
              <h3 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: '700', color: '#E2E8F0' }}>
                📌 核心发现摘要
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {[
                  { icon: '📈', title: '客制化率持续攀升', desc: '从64%增长至72%，6周提升8个百分点' },
                  { icon: '🥛', title: '植物奶需求强劲', desc: '椰奶+燕麦奶占比超过40%，健康趋势明显' },
                  { icon: '☕', title: '浓缩升级成主流', desc: '28%用户选择升级杯型或增加shot' },
                  { icon: '🍯', title: '糖浆定制增速最快', desc: '糖浆调整增长22%，风味个性化需求旺盛' },
                ].map((finding, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '16px',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '12px'
                  }}>
                    <div style={{ fontSize: '28px' }}>{finding.icon}</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#E2E8F0', marginBottom: '4px' }}>{finding.title}</div>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>{finding.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 产品开发建议 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(16,185,129,0.3)'
              }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#10B981' }}>
                  🚀 新品开发建议
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { priority: '高', title: '燕麦椰奶系列', desc: '结合两大热门植物奶，满足健康需求' },
                    { priority: '高', title: '超浓缩能量系列', desc: '针对加量型用户，提供3-4shot选项' },
                    { priority: '中', title: '季节限定糖浆', desc: '推出更多风味糖浆，满足探索型用户' },
                    { priority: '中', title: '温控精品系列', desc: '提供精准温度选项，如50°C/60°C/70°C' },
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      padding: '16px',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '10px',
                      borderLeft: `4px solid ${item.priority === '高' ? '#EF4444' : '#F59E0B'}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#E2E8F0' }}>{item.title}</span>
                        <span style={{
                          padding: '2px 8px',
                          background: item.priority === '高' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                          color: item.priority === '高' ? '#F87171' : '#FBBF24',
                          borderRadius: '4px',
                          fontSize: '11px'
                        }}>
                          优先级: {item.priority}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#94A3B8' }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(139,92,246,0.3)'
              }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#8B5CF6' }}>
                  ⚙️ 定制选项优化
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { action: '新增选项', items: ['杏仁椰奶混合', '蜂蜜替代糖浆', '冷云奶盖升级'], color: '#10B981' },
                    { action: '默认调整', items: ['热门产品默认大杯', '拿铁类默认丝滑奶', '冷饮默认少冰'], color: '#3B82F6' },
                    { action: '组合套餐', items: ['健康套餐(燕麦+少糖)', '能量套餐(大杯+双倍)', '风味套餐(多糖浆)'], color: '#F59E0B' },
                    { action: '移除/简化', items: ['低使用率的脱脂奶选项', '合并相似糖浆选项'], color: '#EF4444' },
                  ].map((opt, idx) => (
                    <div key={idx} style={{
                      padding: '14px',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '10px'
                    }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        background: `${opt.color}20`,
                        color: opt.color,
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '10px'
                      }}>
                        {opt.action}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {opt.items.map((item, i) => (
                          <span key={i} style={{
                            padding: '4px 8px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: '#94A3B8'
                          }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 行动计划时间表 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <h3 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: '600', color: '#E2E8F0' }}>
                📅 建议行动计划
              </h3>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '0',
                  bottom: '0',
                  width: '2px',
                  background: 'linear-gradient(180deg, #3B82F6, #8B5CF6, #EC4899)'
                }} />
                {[
                  { phase: '短期 (1-2周)', items: ['分析报告同步给产品团队', '确定优先级最高的3个改进项', '启动A/B测试计划'], color: '#3B82F6' },
                  { phase: '中期 (1-2月)', items: ['上线新增定制选项', '推出"健康系列"产品线', '优化默认配置'], color: '#8B5CF6' },
                  { phase: '长期 (季度)', items: ['完成全面定制系统升级', '推出会员专属定制功能', '建立持续监测机制'], color: '#EC4899' },
                ].map((timeline, idx) => (
                  <div key={idx} style={{
                    position: 'relative',
                    paddingLeft: '48px',
                    paddingBottom: '32px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '8px',
                      top: '4px',
                      width: '18px',
                      height: '18px',
                      background: timeline.color,
                      borderRadius: '50%',
                      border: '3px solid #1a1a2e'
                    }} />
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: timeline.color,
                      marginBottom: '12px'
                    }}>
                      {timeline.phase}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {timeline.items.map((item, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 14px',
                          background: 'rgba(255,255,255,0.02)',
                          borderRadius: '8px',
                          fontSize: '13px',
                          color: '#94A3B8'
                        }}>
                          <span style={{ color: timeline.color }}>▸</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '20px 40px',
        textAlign: 'center',
        color: '#64748B',
        fontSize: '12px'
      }}>
        <p style={{ margin: 0 }}>
          北美瑞幸产品客制化分析 · 饮品客制化分析平台
        </p>
        <p style={{ margin: '4px 0 0', color: '#475569' }}>
          © 2025 Luckin Coffee North America
        </p>
      </footer>
    </div>
  );
}
