import { useState } from "react";
import { ICategory } from "../types/models";
import { Link, NavLink, useParams } from "react-router-dom";

export default function FilterPanel() {
    const categories: Array<ICategory> = [
        { id: 1, title: "Рубашки"},
        { id: 2, title: "Спорт"},
        { id: 3, title: "Верхняя одежда"},
    ];

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand navbar-dark shadow" style={{backgroundColor: `#607D8B`}}>
                {/* Container wrapper */}
                <div className="container-fluid">
                    {/* Navbar brand */}
                    <a className="navbar-brand" href="#">Категория:</a>
                    {/* Collapsible wrapper */}
                    <div className="collapse navbar-collapse" id="navbarSupportedContent2">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {/* Link */}
                            <li className="nav-item acitve" key={0}>
                                <Link className="nav-link text-white" to="/filter/cat/all">Все</Link>
                            </li>
                            {categories.map(c => {
                                return (
                                    <li className="nav-item" key={c.id}>
                                        <Link className="nav-link text-white" to={`/filter/cat/${c.id}`}>{c.title}</Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                {/* Container wrapper */}
            </nav>
            {/* Navbar */}
        </div>
    )
}