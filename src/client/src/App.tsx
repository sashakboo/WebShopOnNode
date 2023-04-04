import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [token, setToken] = useState('');
  useEffect(() => {
     async function getToken() {
        const response = await fetch('/express_backend');
        const body = JSON.stringify(await response.json());
        setToken(body);
     }
     getToken();
  }, [])  

  return (
    <div>
      Shop
    </div>
  );
}

export default App;
