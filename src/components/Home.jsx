import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Home() {
  const { user, token } = useContext(AuthContext); // Add token here
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!token) {
        toast.error('Please log in to view complaints');
        return;
      }
      try {
        console.log('Token being sent:', token); // Debug
        const res = await api.get('/complaints');
        setComplaints(res.data);
      } catch (err) {
        console.error('Error fetching complaints:', err.response?.data);
        toast.error(err.response?.data.message || 'Failed to load complaints');
      }
    };
    fetchComplaints();
  }, [token]); // Depend on token

  const handleVote = async (id, voteType) => {
    try {
      console.log('Sending vote request:', { id, voteType }); // Debugging log
      const res = await api.post(`/votes/${id}/vote`, { voteType });
      console.log('Vote response:', res); // Debugging log
      setComplaints(complaints.map(c => 
        c._id === id ? { ...c, upvoteCount: res.data.upvoteCount, downvoteCount: res.data.downvoteCount } : c
      ));
    } catch (err) {
      console.error('Error voting:', err); // Debugging log
      toast.error(err.response?.data.message || 'Failed to vote');
    }
  };

  const handleResolve = async (id) => {
    try {
      const res = await api.put(`/complaints/${id}/resolve`);
      setComplaints(complaints.map(c => (c._id === id ? res.data : c)));
    } catch (err) {
      toast.error(err.response?.data.message || 'Failed to resolve');
    }
  };

  return (
    <div className="container">
      <h1>Active Complaints</h1>
      <Link to="/file-complaint">File a Complaint</Link>
      {complaints.map(complaint => (
        <div key={complaint._id} className="complaint">
          <Link to={`/complaint/${complaint._id}`}><h3>{complaint.title}</h3></Link>
          <p>{complaint.description}</p>
          <p>By: {complaint.createdBy.name} | Against: {complaint.against.name}</p>
          <p>Severity: {complaint.severityLevel} | Type: {complaint.complaintType}</p>
          <p>Upvotes: {complaint.upvoteCount} | Downvotes: {complaint.downvoteCount}</p>
          {user?._id !== complaint.createdBy._id && user?._id !== complaint.against._id && (
            <>
              <button onClick={() => handleVote(complaint._id, 'up')}>Upvote</button>
              <button onClick={() => handleVote(complaint._id, 'down')}>Downvote</button>
            </>
          )}
          {user?._id === complaint.createdBy._id && !complaint.resolved && (
            <button onClick={() => handleResolve(complaint._id)}>Resolve</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Home;