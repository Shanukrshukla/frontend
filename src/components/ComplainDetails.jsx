import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { toast } from 'react-toastify';

function complaintsDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [complaints, setcomplaints] = useState(null);
  const [punishment, setPunishment] = useState('');

  useEffect(() => {
    const fetchcomplaints = async () => {
      try {
        const res = await api.get(`/complaints/${id}`);
        setcomplaints(res.data);
        if (res.data.upvoteCount >= 10) {
          const punishRes = await api.get(`/complaints/${id}/punishment`);
          setPunishment(punishRes.data.punishment);
        }
      } catch (err) {
        toast.error('Failed to load complaints');
      }
    };
    fetchcomplaints();
  }, [id]);

  const handleVote = async (voteType) => {
    try {
      const res = await api.post(`/votes/${id}/vote`, { voteType });
      setcomplaints({ ...complaints, upvoteCount: res.data.upvoteCount, downvoteCount: res.data.downvoteCount });
      if (res.data.upvoteCount >= 10 && !punishment) {
        const punishRes = await api.get(`/complaints/${id}/punishment`);
        setPunishment(punishRes.data.punishment);
      }
    } catch (err) {
      toast.error(err.response?.data.message || 'Failed to vote');
    }
  };

  const handleResolve = async () => {
    try {
      const res = await api.put(`/complaints/${id}/resolve`);
      setcomplaints(res.data);
    } catch (err) {
      toast.error(err.response?.data.message || 'Failed to resolve');
    }
  };

  if (!complaints) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>{complaints.title}</h2>
      <p>{complaints.description}</p>
      <p>By: {complaints.createdBy.name} | Against: {complaints.against.name}</p>
      <p>Severity: {complaints.severityLevel} | Type: {complaints.complaintsType}</p>
      <p>Upvotes: {complaints.upvoteCount} | Downvotes: {complaints.downvoteCount}</p>
      {complaints.resolved && <p>Resolved on: {new Date(complaints.resolutionDate).toLocaleDateString()}</p>}
      {punishment && <p><strong>Punishment:</strong> {punishment}</p>}
      {user._id !== complaints.createdBy._id && user._id !== complaints.against._id && (
        <>
          <button onClick={() => handleVote('up')}>Upvote</button>
          <button onClick={() => handleVote('down')}>Downvote</button>
        </>
      )}
      {user._id === complaints.createdBy._id && !complaints.resolved && (
        <button onClick={handleResolve}>Resolve</button>
      )}
    </div>
  );
}

export default complaintsDetails;