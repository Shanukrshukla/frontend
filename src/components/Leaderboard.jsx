import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { toast } from 'react-toastify';

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchFlatmates = async () => {
      try {
        const res = await api.get('/leaderboard');
        setFlatmates(res.data.filter(u => u._id !== user._id));
        if (res.data.length) setFormData({ ...formData, against: res.data.find(u => u._id !== user._id)?._id || '' });
      } catch (err) {
        toast.error('Failed to load flatmates');
      }
    };
    fetchFlatmates();
  }, [user._id]);
  
  return (
    <div className="container">
      <h1>Leaderboard</h1>
      {users.map((user, index) => (
        <div key={user._id}>
          <p>{index + 1}. {user.name}: {user.karmaPoints} points {index === 0 && '(Best Flatmate)'}</p>
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;