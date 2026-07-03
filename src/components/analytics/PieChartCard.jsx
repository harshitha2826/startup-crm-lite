import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import Card from '../common/Card';

/**
 * Custom active shape for Recharts Pie.
 * Expands the hovered slice radially for visual prominence.
 */
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

/**
 * Custom Tooltip with glassmorphism styling.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/90 backdrop-blur-md border border-border/80 p-2.5 rounded-xl shadow-xl text-xs">
        <p className="font-bold text-foreground mb-0.5">{data.name}</p>
        <div className="flex flex-col gap-1 mt-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: data.color }} />
            <span className="text-muted font-medium">Leads:</span>
            <span className="font-bold text-foreground">{data.value}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 invisible shrink-0" />
            <span className="text-muted font-medium">Share:</span>
            <span className="font-bold text-foreground">{data.percentage}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * Custom Legend renderer.
 */
const renderCustomLegend = (props) => {
  const { payload } = props;
  if (!payload) return null;

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2 px-2">
      {payload.map((entry, index) => {
        const { value, color, payload: sliceData } = entry;
        const count = sliceData?.value || 0;
        const percentage = sliceData?.percentage || 0;
        return (
          <div key={`legend-${index}`} className="flex items-center justify-between text-xs py-0.5 border-b border-gray-100/50 dark:border-gray-800/30">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span className="font-medium text-gray-600 dark:text-gray-400">{value}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900 dark:text-white">{count}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">({percentage}%)</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * PieChartCard Component
 * Doughnut chart displaying lead distribution counts and ratios per lifecycle stage.
 */
const PieChartCard = ({ data = [] }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const totalLeads = data.reduce((sum, item) => sum + item.value, 0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <Card className="flex flex-col h-full hoverable" hoverable>
      <div className="mb-2">
        <h3 className="text-sm font-bold text-foreground">Lead Distribution</h3>
        <p className="text-xs text-muted">Lifecycle shares across the active customer funnel.</p>
      </div>

      <div className="flex-1 min-h-[260px] flex items-center justify-center relative mt-2 select-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              animationBegin={100}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--card)" strokeWidth={2} />
              ))}
            </Pie>
            
            {/* Center labels showing aggregate count */}
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
              <tspan x="50%" dy="-6" className="text-xl font-bold fill-gray-900 dark:fill-white">
                {totalLeads}
              </tspan>
              <tspan x="50%" dy="18" className="text-[10px] uppercase tracking-wider font-semibold fill-gray-400 dark:fill-gray-500">
                Total Leads
              </tspan>
            </text>

            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderCustomLegend} verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PieChartCard;
