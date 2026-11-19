import type { Movement } from '@/types';
import { formatDateGroup } from '@/lib/format';
import MovementItem from './MovementItem';

interface MovementListProps {
  movements: Movement[];
}

export default function MovementList({ movements }: MovementListProps) {
  const grouped = movements.reduce<Record<string, Movement[]>>((acc, m) => {
    const key = formatDateGroup(m.data_movimentacao);
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  const dates = Object.keys(grouped);

  return (
    <div className="space-y-6">
      {dates.map((date) => (
        <div key={date}>
          <h2 className="section-title mb-3">{date}</h2>
          <ul className="space-y-2.5">
            {grouped[date].map((m) => (
              <MovementItem key={m.id} movement={m} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
