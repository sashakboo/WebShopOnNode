import { Link } from "react-router-dom";
import { IProduct } from "../types/product";

export interface IProductCardProps {
    product: IProduct,
    addToBasket: (product: IProduct) => void;
}

export default function ProductCard(props: IProductCardProps) {
    return (
        <div className="card">
            <div className="bg-image hover-zoom ripple ripple-surface ripple-surface-light" data-mdb-ripple-color="light">
                <img className="w-100" src={`data:image/png;base64,${props.product.icon}`} />
            </div>
            <div className="card-body">
                <Link to={`/product/${props.product.id}`} className="text-reset">
                    <h5 className="card-title mb-2">{props.product.title}</h5>
                </Link>
                <Link to={`/filter/cat/${props.product.category.id}`} className="text-reset ">
                    <p>{props.product.category.title}</p>
                </Link>
                <h6 className="mb-3 price">{props.product.price} р.</h6>
                <button className="btn btn-primary" type="submit" onClick={() => props.addToBasket(props.product)}>
                    Купить
                </button>
            </div>
        </div>
    )
}