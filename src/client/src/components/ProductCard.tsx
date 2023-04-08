import { Link } from "react-router-dom";
import { IProduct } from "../types/product";


export default function ProductCard(props: IProduct) {
    return (
        <div className="card">
            <div className="bg-image hover-zoom ripple ripple-surface ripple-surface-light" data-mdb-ripple-color="light">
                <img src={`data:image/png;base64,${props.icon}`}
                    className="w-100" />
                {/*
                <a href="#!">
                    <div className="mask">
                    <div className="d-flex justify-content-start align-items-end h-100">
                        <h5><span className="badge bg-dark ms-2">{props.tag}</span></h5>
                    </div>
                    </div>
                    <div className="hover-overlay">
                    <div className="mask" style={{backgroundColor: `rgba(251, 251, 251, 0.15)`}}></div>
                    </div>
                </a>
                */}
            </div>
            <div className="card-body">
                <Link to={`/product/${props.id}`} className="text-reset">
                    <h5 className="card-title mb-2">{props.title}</h5>
                </Link>
                <Link to={`/filter/cat/${props.category.id}`} className="text-reset ">
                    <p>{props.category.title}</p>
                </Link>
                <h6 className="mb-3 price">{props.price} р.</h6>
            </div>
        </div>
    )
}