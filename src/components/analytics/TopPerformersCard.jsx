import { Award, Trophy } from 'lucide-react';
import Card from '../common/Card';

const formatRupees = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

/**
 * TopPerformersCard Component
 * Leaderboard ranking active sales executives based on their total Won revenue values.
 */
const TopPerformersCard = ({ data = [] }) => {
  // Take top 5 performers
  const topReps = data.slice(0, 5);

  const trophyColors = [
    'text-amber-500 fill-amber-500/10', // 1st
    'text-slate-400 fill-slate-400/10', // 2nd
    'text-amber-700 fill-amber-700/10', // 3rd
  ];

  return (
    <Card className="hoverable flex flex-col justify-between h-full animate-in fade-in duration-300" hoverable>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Top Sales Performers</h3>
            <p className="text-xs text-muted font-normal mt-0.5">Ranking sales reps by aggregate Won deal contract values.</p>
          </div>
          <span className="p-2.5 rounded-xl shrink-0 bg-primary/10 text-primary">
            <Trophy className="w-4.5 h-4.5 stroke-[2]" />
          </span>
        </div>

        {/* Rep Ranking List */}
        {topReps.length > 0 ? (
          <div className="space-y-3.5 mt-2 select-none">
            {topReps.map((rep, index) => {
              const rank = index + 1;
              const hasTrophy = rank <= 3;
              return (
                <div
                  key={rep.name}
                  className="flex items-center justify-between p-2 rounded-xl border border-gray-100/50 dark:border-gray-800/40 bg-gray-50/50 dark:bg-gray-900/40"
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge / Trophy */}
                    <div className="w-7 h-7 flex items-center justify-center font-bold text-xs shrink-0 rounded-lg">
                      {hasTrophy ? (
                        <Award className={`w-5 h-5 ${trophyColors[index]}`} />
                      ) : (
                        <span className="text-gray-400 font-semibold">{rank}</span>
                      )}
                    </div>

                    <div>
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
                        {rep.name}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                        {rep.count} deal{rep.count === 1 ? '' : 's'} won
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-black text-gray-900 dark:text-white">
                    {formatRupees(rep.revenue)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center text-xs text-muted select-none">
            No finalized sales performance metrics logged yet.
          </div>
        )}
      </div>

      <div className="text-[10px] text-gray-400 dark:text-gray-500 border-t border-gray-100/60 dark:border-gray-700/50 pt-3 mt-4 select-none">
        Updates automatically upon sales status revisions to "Won".
      </div>
    </Card>
  );
};

export default TopPerformersCard;
