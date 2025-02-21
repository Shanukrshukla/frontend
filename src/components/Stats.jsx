import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { toast } from 'react-toastify';

function Stats() {
  const [stats, setStats] = useState({ mostComplained: { name: 'None', count: 0 }, topTypes: [] });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats');
        setStats(res.data);
      } catch (err) {
        toast.error('Failed to load stats');
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container">
      <h1>Flat Stats</h1>
      <p>Most Complained User: {stats.mostComplained.name} ({stats.mostComplained.count} complaints)</p>
      <h2>Top complaints Types</h2>
      {stats.topTypes.map(type => (
        <p key={type._id}>{type._id}: {type.count}</p>
      ))}
    </div>
  );
}

export default Stats;