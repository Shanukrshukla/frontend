import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function FileComplaint() {
  const [flatmates, setFlatmates] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    complaintType: 'Noise',
    severityLevel: 'Mild',
    against: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlatmates = async () => {
      try {
        const res = await api.get('/leaderboard'); // Using leaderboard as a proxy to get flatmates
        setFlatmates(res.data);
        if (res.data.length) setFormData({ ...formData, against: res.data[0]._id });
      } catch (err) {
        toast.error('Failed to load flatmates');
      }
    };
    fetchFlatmates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', formData);
      toast.success('Complaint filed successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data.message || 'Failed to file complaint');
    }
  };

  return (
    <div className="container">
      <h2>File a Complaint</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={formData.against}
          onChange={(e) => setFormData({ ...formData, against: e.target.value })}
        >
          {flatmates.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
        <select
          value={formData.complaintType}
          onChange={(e) => setFormData({ ...formData, complaintType: e.target.value })}
        >
          <option value="Noise">Noise</option>
          <option value="Cleanliness">Cleanliness</option>
          <option value="Bills">Bills</option>
          <option value="Pets">Pets</option>
          <option value="Other">Other</option>
        </select>
        <select
          value={formData.severityLevel}
          onChange={(e) => setFormData({ ...formData, severityLevel: e.target.value })}
        >
          <option value="Mild">Mild</option>
          <option value="Annoying">Annoying</option>
          <option value="Major">Major</option>
          <option value="Nuclear">Nuclear</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default FileComplaint;