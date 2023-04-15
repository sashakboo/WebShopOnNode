import ProductCard from "./ProductCard";
import { IProduct } from "../types/models";

export interface IProductsProps {
    products: Array<IProduct>
    addToBasketCallback: (product: IProduct) => void
}

export default function Products(props: IProductsProps) {
    return (
        <div className="container">
            <section>
                <div className="text-center">
                    <div className="row">
                        {
                            props.products.map(p => {
                                return (
                                    <div className="col-lg-3 col-md-6 mb-4" key={p.id}>
                                        <ProductCard product={p} addToBasketCallback={props.addToBasketCallback} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </section>
        </div>
    )
}