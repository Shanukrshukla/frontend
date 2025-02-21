import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { toast } from 'react-toastify';

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [complaintsBy, setcomplaintsBy] = useState([]);
  const [complaintsAgainst, setcomplaintsAgainst] = useState([]);

  useEffect(() => {
    const fetchcomplaints = async () => {
      try {
        const [byRes, againstRes] = await Promise.all([
          api.get('/complaints?createdBy=' + user._id),
          api.get('/complaints?against=' + user._id)
        ]);
        setcomplaintsBy(byRes.data);
        setcomplaintsAgainst(againstRes.data);
      } catch (err) {
        toast.error('Failed to load profile data');
      }
    };
    fetchcomplaints();
  }, [user]);

  return (
    <div className="container">
      <h1>Profile</h1>
      {user ? (
        <>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Karma Points: {user.karmaPoints}</p>
          <p>Badges: {user.badges.length ? user.badges.map(b => b.badgeType).join(', ') : 'None'}</p>
          <button onClick={logout}>Logout</button>
          <h2>complaints Filed</h2>
          {complaintsBy.map(c => <p key={c._id}>{c.title}</p>)}
          <h2>complaints Against</h2>
          {complaintsAgainst.map(c => <p key={c._id}>{c.title}</p>)}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;