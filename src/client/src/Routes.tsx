import { Routes , Route, Navigate, redirect } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FilteredProducts from './components/FilteredProducts';
import ProductPage from './pages/ProductPage';

export const useRoutes = (isAuthenticated: boolean) => {
    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/auth" element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/auth" />}/>
            </Routes>
        )    
    }

    return (
        <Routes>
            <Route path="/filter/cat/:id" element={<FilteredProducts />}/>
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/auth" element={<Navigate to="/" />} />
            <Route path="/" element={<FilteredProducts />}/>
            <Route path="*" element={<Navigate to="/" />}/>
        </Routes>
    )
    
}