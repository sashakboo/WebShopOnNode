import { Link, NavLink } from "react-router-dom";
import brand from '../resources/brand.jpg'

interface INavBarProps {
    isAdmin: boolean
}

export default function NavBar(props: INavBarProps) {
    const isAdmin = props.isAdmin;
    const adminPage = isAdmin 
        ? (<li className="nav-item">
            <a className="nav-link" href="/admin">ЛК</a>
        </li>)
        : null;

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
                    {adminPage}                    
                    </ul>
                    {/* Left links */}      
                
                    {/* Right elements */}
                    <div className="d-flex align-items-center">
                        {/* Icon */}
                        <a className="nav-link me-3" href="#">
                        <i className="fas fa-shopping-cart"></i>
                        <span className="badge rounded-pill badge-notification bg-danger">1</span>
                        </a>
                        <Link to="/auth" className="border rounded px-2 nav-link">
                            <i className="fab fa-github me-2"></i>Войти
                        </Link>
                    </div>
                    {/* Right elements */}
                
                </div>
                {/* Container wrapper */}
            </nav>
            {/* Navbar */}  
        </div>
    );
}