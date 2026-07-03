import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SOURCE_COLORS } from '../../constants/analyticsColors';
import Card from '../common/Card';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/90 backdrop-blur-md border border-border/80 p-2.5 rounded-xl shadow-xl text-xs">
        <p className="font-bold text-foreground mb-0.5">{data.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SOURCE_COLORS[data.name] || '#3B82F6' }} />
          <span className="text-muted font-medium">Total Leads:</span>
          <span className="font-extrabold text-foreground">{data.count} Leads</span>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * LeadSourceChart Component
 * Horizontal Bar Chart displaying lead volumes per acquisition source channel.
 */
const LeadSourceChart = ({ data = [] }) => {
  return (
    <Card className="flex flex-col h-full hoverable" hoverable>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-foreground">Marketing Lead Sources</h3>
        <p className="text-xs text-muted">Distribution performance sorted by highest performing channels.</p>
      </div>

      <div className="flex-1 min-h-[260px] flex items-center justify-center mt-2 select-none">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.4} />
            <XAxis
              type="number"
              stroke="var(--muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              dy={6}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="var(--muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={-6}
              width={75}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--border)', opacity: 0.15 }} />
            <Bar
              dataKey="count"
              radius={[0, 4, 4, 0]}
              maxBarSize={20}
              animationBegin={300}
              animationDuration={900}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={SOURCE_COLORS[entry.name] || 'var(--primary)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default LeadSourceChart;
