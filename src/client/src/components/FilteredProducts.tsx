import { useCallback, useEffect, useState } from "react";
import FilterPanel from "./FilterPanel";
import Pagination from "./Pagination";
import { ICategory, IProduct } from "../types/product";
import Products from "./Products";
import { useParams } from "react-router-dom";

export default function FilteredProducts() {
    const [ productList, setProducts ] = useState<Array<IProduct>>([]);

    const categoryId = parseInt(useParams().id ?? '');
    console.log(categoryId);

    const fetchProducts = async () => {
        try {
            const apiUrl = Number.isNaN(categoryId) ? '/api/products' : `/api/products/${categoryId}`;
            const response = await fetch(apiUrl);
            const data = await response.json() as Array<IProduct>;
            console.log('fetch products', categoryId);
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