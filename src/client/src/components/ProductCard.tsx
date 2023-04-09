import { Link } from "react-router-dom";
import { IProduct } from "../types/models";
import { useHttp } from "../hooks/http.hook";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export interface IProductCardProps {
    product: IProduct,
    addToBasketCallback: (product: IProduct) => void;
}

export default function ProductCard(props: IProductCardProps) {
    const auth = useContext(AuthContext);
    const { loading, request } = useHttp();
    const addToBasket = async (product: IProduct) => {
        try {
            const apiUrl = `/api/basket/add/${product.id}`;
            const response = await request(apiUrl, 'POST', null, { Authorization: `Bearer ${auth.token}` });  
            props.addToBasketCallback(product); 
        } catch (e) { }
    }

    return (
        <div className="card">
            <div className="bg-image hover-zoom ripple ripple-surface ripple-surface-light" data-mdb-ripple-color="light">
                <img className="w-100" src={`data:image/png;base64,${props.product.icon}`} />
            </div>
            <div className="card-body">
                <h5 className="card-title mb-2">{props.product.title}</h5>
                <Link to={`/filter/cat/${props.product.category.id}`} className="text-reset ">
                    <p>{props.product.category.title}</p>
                </Link>
                <h6 className="mb-3 price">{props.product.price} р.</h6>
                <button className="btn btn-primary" type="submit" disabled={loading} onClick={() => addToBasket(props.product)}>
                    Купить
                </button>
            </div>
        </div>
    )
}