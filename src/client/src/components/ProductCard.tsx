import { Link } from "react-router-dom";
import { IProduct } from "../models";
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
            await request(apiUrl, 'POST', null, { Authorization: `Bearer ${auth.token}` });  
            props.addToBasketCallback(product); 
        } catch (e) { }
    }

    return (
        
        <div className="card" style={{maxWidth: '18rem'}}>
            <img src={`data:image/png;base64,${props.product.icon}`} className="card-img-top" alt={props.product.title} />
            <div className="card-body">
                <h5 className="card-title">{props.product.title}</h5>
                <Link to={`/filter/cat/${props.product.category.id}`} className="card-link ">
                    <p>{props.product.category.title}</p>
                </Link>
                <button className="btn btn-primary" type="submit" disabled={loading} onClick={() => addToBasket(props.product)}>
                    Купить
                </button>
            </div>
        </div>

    )
}