import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
          <span className="w-2 h-2 rounded-full bg-success" />
          <span className="text-muted font-medium">Conversion Rate:</span>
          <span className="font-extrabold text-success">{data.rate}%</span>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * LineChartCard Component
 * Displays monthly lead conversion trends.
 */
const LineChartCard = ({ data = [] }) => {
  return (
    <Card className="flex flex-col h-full hoverable" hoverable>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-foreground">Monthly Conversion Trend</h3>
        <p className="text-xs text-muted">The percentage of leads created in each cohort that successfully transitioned to 'Won'.</p>
      </div>

      <div className="flex-1 min-h-[260px] flex items-center justify-center mt-2 select-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              domain={[0, 100]}
              tickFormatter={(val) => `${val}%`}
              dx={-8}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="var(--success)"
              strokeWidth={3}
              activeDot={{ r: 6, stroke: 'var(--card)', strokeWidth: 2 }}
              dot={{ r: 4, stroke: 'var(--success)', strokeWidth: 2, fill: 'var(--card)' }}
              animationBegin={200}
              animationDuration={900}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default LineChartCard;
