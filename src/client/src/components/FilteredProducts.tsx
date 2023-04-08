import { useCallback, useContext, useEffect, useState } from "react";
import FilterPanel from "./FilterPanel";
import Pagination from "./Pagination";
import { ICategory, IProduct } from "../types/product";
import Products from "./Products";
import { useParams } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import { NotifyContext } from "../context/NotifyContext";

export default function FilteredProducts() {
    const [ productList, setProducts ] = useState<Array<IProduct>>([]);

    const { request } = useHttp();
    const auth = useContext(AuthContext);
    const categoryId = parseInt(useParams().id ?? '');

    const fetchProducts = async () => {
        try {
            const apiUrl = Number.isNaN(categoryId) ? '/api/products' : `/api/products/${categoryId}`;
            const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${auth.token}` });
            const data = response as Array<IProduct>;
            setProducts(data);    
        } catch (e) { }
      }

    useEffect(() => {
        fetchProducts();
    }, [categoryId]);

    const { changeBasketCount } = useContext(NotifyContext);

    const addToBasket = async (product: IProduct) => {
        try {
            const apiUrl = `/api/basket/add/${product.id}`;
            const response = await request(apiUrl, 'POST', null, { Authorization: `Bearer ${auth.token}` });  
            changeBasketCount(1); 
        } catch (e) { }
    }


    return (
        <div>
            <FilterPanel />
            <Products products={[...productList]} addToBasket={addToBasket} />
            <Pagination/>
        </div>
    )
}