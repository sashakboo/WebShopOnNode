import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { useRoutes } from './Routes';
import { BrowserRouter, Route, Router } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/auth.hook';

import './App.css';
import { NotifyContext } from './context/NotifyContext';
import { useNotify } from './hooks/notify.hook';
import { useEffect } from 'react';
import { useHttp } from './hooks/http.hook';

function App() {
  const { token, login, logout, userId, ready } = useAuth();
  const isAuthenticated = !!token;  
  const routes = useRoutes(isAuthenticated);
  const { basketCount, changeBasketCount } = useNotify(); 
  const { request } = useHttp();
  const getBasketCount = async () => {
    try {
      if (isAuthenticated && basketCount === 0) {
        const apiUrl = '/api/basket/count';
        const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${token}` });
        const data = parseInt(response);
        if (!Number.isNaN(data))
          changeBasketCount(data); 
      }   
    } catch (e) { }
  } 
  useEffect(() => { getBasketCount(); }, [getBasketCount]);

  return (
    <BrowserRouter>
      <div className="container-fluid">
        <main>
            <AuthContext.Provider value={{
              token, login, logout, userId, isAuthenticated
            }}>
              <NotifyContext.Provider value={{basketCount, changeBasketCount}}>
                  <NavBar />
                  <div className="container-fluid">
                    {routes}
                  </div>
              </NotifyContext.Provider>
            </AuthContext.Provider>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
