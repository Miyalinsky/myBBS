import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from './services/authService';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';
import ThreadList from './components/ThreadList';
import ThreadForm from './components/ThreadForm';
import ThreadDetail from './components/ThreadDetail';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <div>
          {/* <h2>Welcome, {user.email}</h2> */}
          <Logout />
          <Routes>
            <Route path="/" element={<><ThreadForm userId={user.uid} /><ThreadList /></>} />
            <Route path="/thread/:threadId" element={<ThreadDetail userId={user.uid} />} />
          </Routes>
        </div>
      ) : (
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default App;
