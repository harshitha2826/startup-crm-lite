import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

const formatRupeesShort = (num) => {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}k`;
  return `₹${num}`;
};

const formatRupeesFull = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/90 backdrop-blur-md border border-border/80 p-2.5 rounded-xl shadow-xl text-xs">
        <p className="font-bold text-foreground mb-0.5">{data.name} Revenue</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-success" />
          <span className="text-muted font-medium">Won:</span>
          <span className="font-extrabold text-success">{formatRupeesFull(data.revenue)}</span>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * RevenueChartCard Component
 * Area chart displaying monthly closed Won revenues.
 */
const RevenueChartCard = ({ data = [] }) => {
  return (
    <Card className="flex flex-col h-full hoverable" hoverable>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-foreground">Revenue Analytics</h3>
        <p className="text-xs text-muted">Chronological trends of closed Won deal values.</p>
      </div>

      <div className="flex-1 min-h-[260px] flex items-center justify-center mt-2 select-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--success)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
              tickFormatter={formatRupeesShort}
              dx={-8}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--success)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              animationBegin={250}
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueChartCard;
