import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

/**
 * Custom Tooltip with glassmorphism style.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/90 backdrop-blur-md border border-border/80 p-2.5 rounded-xl shadow-xl text-xs">
        <p className="font-bold text-foreground mb-0.5">{data.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-muted font-medium">New Leads:</span>
          <span className="font-extrabold text-foreground">{data.count} Leads</span>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * BarChartCard Component
 * Displays monthly incoming lead intakes over a rolling 6-month period.
 */
const BarChartCard = ({ data = [] }) => {
  return (
    <Card className="flex flex-col h-full hoverable" hoverable>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-foreground">Monthly Lead Growth</h3>
        <p className="text-xs text-muted">Number of new prospects created over the last 6 months.</p>
      </div>

      <div className="flex-1 min-h-[260px] flex items-center justify-center mt-2 select-none">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
            <XAxis
              dataKey="name"
              stroke="var(--muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={8}
            />
            <YAxis
              stroke="var(--muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              dx={-8}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--border)', opacity: 0.2 }} />
            <Bar
              dataKey="count"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              animationBegin={150}
              animationDuration={850}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default BarChartCard;
