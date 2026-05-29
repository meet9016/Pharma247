import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Protected = ({ children }) => {
  const [token, setToken] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      history.push('/');
    } else {
      setToken(storedToken);
    }
  }, [history]);

  if (!token) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
};

export default Protected;
