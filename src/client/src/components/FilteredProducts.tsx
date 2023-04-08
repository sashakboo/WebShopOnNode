import { useCallback, useContext, useEffect, useState } from "react";
import FilterPanel from "./FilterPanel";
import Pagination from "./Pagination";
import { ICategory, IProduct } from "../types/product";
import Products from "./Products";
import { useParams } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";

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


    return (
        <div>
            <FilterPanel />
            <Products products={[...productList]} />
            <Pagination/>
        </div>
    )
}