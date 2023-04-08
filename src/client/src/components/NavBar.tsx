import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import brand from '../resources/brand.jpg'
import basket from '../resources/basket.png'
import { useHttp } from '../hooks/http.hook';

export default function NavBar() {
    const { request } = useHttp();
    const { token, userId, logout } = useContext(AuthContext);
    const isAuthenticated = !!token;
    
    const [ isAdmin, setIsAdmin] = useState(false);
    const fetchUserRole = async () => {
        try {
            if (!isAuthenticated || Number.isNaN(userId))
              return;

            const apiUrl = `/api/auth/role/${userId as number}`;
            const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${token}` });
            const data = response as any;
            setIsAdmin(data.role === 'admin');    
        } catch (e) { }
      }

    useEffect(() => {
        fetchUserRole();
    }, [token]);

    return (
        <div className="fixed-top">
            {/* Navbar */}
            <nav className="navbar fixed-top navbar-expand navbar-light bg-white">
                {/* Container wrapper */}
                <div className="container">    

                    {/* Collapsible wrapper */}
                      
                    {/* Navbar brand */}
                    <a className="navbar-brand mt-2 mt-sm-0" href="#">
                    <img
                        src={brand}
                        height="45"
                        alt="Logo"
                        loading="lazy"
                    />
                    </a>
                    {/* Left links */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item active">
                        <Link className="nav-link " to="/">Домой</Link>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/about">О магазине</a>
                    </li>
                    {
                    isAdmin 
                        ? (<li className="nav-item">
                            <a className="nav-link" href="/admin">ЛК</a>
                        </li>)
                        : null
                    }                    
                    </ul>
                    {/* Left links */}      
                
                    {/* Right elements */}
                    <div className="d-flex align-items-center">
                        {/* Icon */}
                        <a className="nav-link me-3" href="#">
                        <img className="fas fa-shopping-cart" src={basket} />
                        <span className="badge rounded-pill badge-notification bg-danger">1</span>
                        </a>
                        {isAuthenticated
                            ? (<Link to="/auth" className="border rounded px-2 nav-link" onClick={logout}>
                                <i className="fab me-2"></i>Выйти
                            </Link>)
                            : (<Link to="/auth" className="border rounded px-2 nav-link">
                                    <i className="fab me-2"></i>Войти
                            </Link>)}
                        
                    </div>
                    {/* Right elements */}
                
                </div>
                {/* Container wrapper */}
            </nav>
            {/* Navbar */}  
        </div>
    );
}