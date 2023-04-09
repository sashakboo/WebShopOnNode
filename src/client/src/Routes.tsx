import { Routes , Route, Navigate, redirect } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FilteredProducts from './components/FilteredProducts';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';

export const useRoutes = (isAuthenticated: boolean) => {
    if (!isAuthenticated) {
        console.log(isAuthenticated)
        return (
            <Routes>
                <Route path="/auth" element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/auth" />}/>
            </Routes>
        )    
    }

    console.log(isAuthenticated)
    return (
        <Routes>
            <Route path="/filter/cat/:id" element={<FilteredProducts />}/>
            <Route path="/auth" element={<Navigate to="/" />} />
            <Route path="/basket" element={<CheckoutPage />}></Route>
            <Route path="/admin" element={<AdminPage />}></Route>
            <Route path="/" element={<FilteredProducts />}/>
            <Route path="*" element={<Navigate to="/" />}/>
        </Routes>
    )
    
}