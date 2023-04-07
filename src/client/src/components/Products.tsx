import ProductCard from "./ProductCard";
import { IProduct } from "../types/product";

export interface IProductsProps {
    products: Array<IProduct>
}

export default function Products(props: IProductsProps) {
    return (
        <div>
            <section>
                <div className="text-center">
                    <div className="row">
                        {
                            props.products.map(p => {
                                return (
                                    <div className="col-lg-3 col-md-6 mb-4" key={p.id}>
                                        <ProductCard { ...p } />
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