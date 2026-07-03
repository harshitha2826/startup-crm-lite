import { FunnelChart, Funnel, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { STATUS_COLORS } from '../../constants/analyticsColors';
import Card from '../common/Card';

/**
 * Custom Tooltip for Funnel metrics.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/90 backdrop-blur-md border border-border/80 p-3 rounded-xl shadow-xl text-xs space-y-1">
        <p className="font-bold text-foreground">{data.name}</p>
        <p className="text-gray-500 dark:text-gray-400">Leads: <span className="font-bold text-foreground">{data.value}</span></p>
        <p className="text-gray-500 dark:text-gray-400">Funnel Conversion: <span className="font-bold text-success">{data.conversionRate}%</span></p>
        {data.name !== 'New' && (
          <p className="text-gray-500 dark:text-gray-400">Stage Drop-off: <span className="font-bold text-danger">{data.dropOffRate}%</span></p>
        )}
      </div>
    );
  }
  return null;
};

/**
 * FunnelChartCard Component
 * Uses Recharts FunnelChart to display progressive sales stages conversion and drop-offs.
 */
const FunnelChartCard = ({ data = [] }) => {
  // Format data for Recharts Funnel
  const chartData = data.map((item) => ({
    value: item.count,
    name: item.name,
    conversionRate: item.conversionRate,
    dropOffRate: item.dropOffRate,
    fill: STATUS_COLORS[item.name] || '#94A3B8'
  }));

  return (
    <Card className="flex flex-col h-full hoverable" hoverable>
      <div className="mb-2">
        <h3 className="text-sm font-bold text-foreground">Sales Funnel Analysis</h3>
        <p className="text-xs text-muted">Progression metrics, drop-offs, and conversions across CRM stages.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-6 items-center mt-4">
        {/* Recharts Funnel Visual representation */}
        <div className="md:col-span-3 h-[250px] flex items-center justify-center relative select-none">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart margin={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Tooltip content={<CustomTooltip />} />
              <Funnel
                dataKey="value"
                data={chartData}
                isAnimationActive
                animationDuration={900}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        {/* Sidebar Conversion Rate & Drop-off List breakdown */}
        <div className="md:col-span-2 space-y-3.5">
          {data.map((item, index) => {
            const color = STATUS_COLORS[item.name] || '#94A3B8';
            return (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-bold">{item.count}</span>
                </div>
                
                {/* Visual progression bar */}
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.conversionRate}%`,
                      backgroundColor: color
                    }}
                  />
                </div>

                {/* Subtext info */}
                <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                  <span>Conv: {item.conversionRate}%</span>
                  {index > 0 && (
                    <span className="text-danger">Drop: -{item.dropOffRate}%</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default FunnelChartCard;
