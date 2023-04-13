import { useContext, useEffect, useState } from "react";
import FilterPanel from "./FilterPanel";
import Pagination from "./Pagination";
import { IProduct } from "../types/models";
import Products from "./Products";
import { useParams } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import { NotifyContext } from "../context/NotifyContext";
import { Loader } from "./Loader";

export default function FilteredProducts() {
    const [ productList, setProducts ] = useState<Array<IProduct>>([]);

    const { request, loading } = useHttp();
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

    const addToBasketHandler = async (product: IProduct) => {
        try {
            changeBasketCount(1); 
        } catch (e) { }
    }

    return (
        <div>

            {loading && <Loader />}
            <FilterPanel />
            <Products products={[...productList]} addToBasketCallback={addToBasketHandler} />
            <Pagination/>
        </div>
    )
}