import {Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Filecomplaints from './components/FileComlaint';
import complaintsDetails from './components/ComplainDetails';
import Leaderboard from './components/Leaderboard';
import Stats from './components/Stats';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/file-complaints" element={<PrivateRoute><Filecomplaints /></PrivateRoute>} />
        <Route path="/complaints/:id" element={<PrivateRoute><complaintsDetails /></PrivateRoute>} />
        <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
        <Route path="/stats" element={<PrivateRoute><Stats /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>
  );
}

export default App;