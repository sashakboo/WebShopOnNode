import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { useRoutes } from './Routes';
import { BrowserRouter, Route, Router } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/auth.hook';

import './App.css';

function App() {
  const { token, login, logout, userId, ready } = useAuth();
  const isAuthenticated = !!token;  
  const routes = useRoutes(isAuthenticated);

  return (
    <BrowserRouter>
      <div className="container-fluid">
        <main>
            <AuthContext.Provider value={{
              token, login, logout, userId, isAuthenticated
            }}>
            <NavBar />
            <div className="container-fluid">
              {routes}
            </div>
            </AuthContext.Provider>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
