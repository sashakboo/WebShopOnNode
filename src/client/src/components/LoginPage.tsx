import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';

export default function LoginPage() {
    const [ activeTab, setTab ] = useState('login');
    const activateTab = (tab: string) => {
        if (tab !== activeTab && tab === 'login' || tab === 'register'){
            setTab(tab);
        }
    }

    const auth = useContext(AuthContext);
    const {loading, request, error, clearError} = useHttp();
    const [form, setForm] = useState({
      email: '',
      password: ''
    });

    const changeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setForm({ ...form, [event.currentTarget.name]: event.currentTarget.value });
        console.log(form);
    }

    const registerHandler = async () => {
        try {
          const data = await request('/api/auth/register', 'POST', JSON.stringify({...form}));
        } catch (e) {
          
        }
      }
    
      const loginHandler = async () => {
        try {
          const data = await request('/api/auth/login', 'POST', JSON.stringify({...form}));
          auth.login(data.token, data.userId);
        } catch (e) {
          
        }
      }
    
    

    const isLogin = activeTab === 'login';

    return (
        <div className="container" style={{maxWidth: `500px`}}>
            {/* Pills navs */}
            <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                <li className="nav-item" role="presentation">
                    <a className={`nav-link ${isLogin ? "active" : ""}`} id="tab-login" data-mdb-toggle="pill" href="#pills-login" role="tab"
                    aria-controls="pills-login" aria-selected={isLogin} onClick={() => activateTab('login')}>Вход</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className={`nav-link ${!isLogin ? "active" : ""}`} id="tab-register" data-mdb-toggle="pill" href="#pills-register" role="tab"
                    aria-controls="pills-register" aria-selected={!isLogin} onClick={() => activateTab('register')}>Регистрация</a>
                </li>
            </ul>
            {/* Pills navs */}

            {/* Pills content */}
            <div className="tab-content">
                <div className={`tab-pane fade ${isLogin ? "show active" : ""}`} id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                    <form>
                        {/* Email input */}
                        <div className="form-outline mb-4">
                            <input 
                                placeholder="Введите email" 
                                id="email" 
                                type="text"
                                name="email" 
                                className="form-control"
                                value={form.email}
                                onChange={changeHandler} />  
                            <label className="form-label" htmlFor="loginName">Email</label>
                        </div>

                        {/* Password input */}
                        <div className="form-outline mb-4">
                            <input 
                                placeholder="Введите пароль" 
                                id="password" 
                                type="password"
                                name="password"
                                className="form-control" 
                                value={form.password}
                                onChange={changeHandler} />
                            <label className="form-label" htmlFor="loginPassword">Пароль</label>
                        </div>

                        {/* Submit button */}
                        <button 
                            className="btn btn-primary btn-block mb-4" 
                            onClick={loginHandler}
                            disabled={loading}>
                            Войти
                         </button>
                    </form>
                </div>
                <div className={`tab-pane fade ${!isLogin ? "show active" : ""}`} id="pills-register" role="tabpanel" aria-labelledby="tab-register">
                    <form>
                        {/* Name input */}
                        <div className="form-outline mb-4">
                            <input type="text" id="registerName" className="form-control" />
                            <label className="form-label" htmlFor="registerName">Имя</label>
                        </div>

                        {/* Username input */}
                        <div className="form-outline mb-4">
                            <input type="text" id="registerUsername" className="form-control" />
                            <label className="form-label" htmlFor="registerUsername">Фамилия</label>
                        </div>

                        {/* Email input */}
                        <div className="form-outline mb-4">
                            <input type="email" id="registerEmail" className="form-control" />
                            <label className="form-label" htmlFor="registerEmail">Email</label>
                        </div>

                        {/* Password input */}
                        <div className="form-outline mb-4">
                            <input type="password" id="registerPassword" className="form-control" />
                            <label className="form-label" htmlFor="registerPassword">Пароль</label>
                        </div>

                        {/* Repeat Password input */}
                        <div className="form-outline mb-4">
                            <input type="password" id="registerRepeatPassword" className="form-control" />
                            <label className="form-label" htmlFor="registerRepeatPassword">Повторите пароль</label>
                        </div>

                        {/* Submit button */}
                        <button 
                            className="btn btn-primary btn-block mb-3"
                            onClick={registerHandler}  
                            disabled={loading} >
                            Регистрация
                        </button>
                    </form>
                </div>
            </div>
            {/* Pills content */}  

        </div>
    )
}