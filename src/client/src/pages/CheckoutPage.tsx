import { useContext, useEffect, useState } from 'react';
import { useHttp } from "../hooks/http.hook"
import { IBasketProduct, IProduct } from "../types/models";
import { AuthContext } from '../context/AuthContext';
import { NotifyContext } from '../context/NotifyContext';

export default function CheckoutPage() {
    const [ productList, setProducts ] = useState<Array<IBasketProduct>>([]);

    const { loading, request } = useHttp();
    const auth = useContext(AuthContext);

    const fetchProducts = async () => {
        try {
            const apiUrl = `/api/basket`;
            const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${auth.token}` });
            const data = response as Array<IBasketProduct>;
            setProducts(data);    
        } catch (e) { }
      }

    useEffect(() => {
        fetchProducts();
    }, []);

    const { changeBasketCount } = useContext(NotifyContext);

    const removeFromBasket = async (product: IBasketProduct) => {
        try {
            changeBasketCount(-1); 
            const apiUrl = `/api/basket/delete/${product.id}`;
            await request(apiUrl, 'POST', null, { Authorization: `Bearer ${auth.token}` });  
            setProducts(productList.filter(x => x.id !== product.id));
        } catch (e) { }
    }

    return (
    <div className="container">
        <h2 className="text-center">Оформление заказа</h2>
        <div className="row">
            <div className="col-md-8 mb-4">
                <div className="card p-4">
                    <h5>Данные получателя</h5>
                    <div className="row mb-3">
                        <div className="col-md-6 mb-2">
                            <div className="form-outline">
                                <input type="text" id="typeText" className="form-control" />
                                <label className="form-label" htmlFor="typeText">Имя</label>
                            </div>
                        </div>
                        <div className="col-md-6 mb-2">
                            <div className="form-outline">
                                <input type="text" id="typeText" className="form-control" />
                                <label className="form-label" htmlFor="typeText">Фамилия</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-outline">
                        <input type="text" id="typeText" className="form-control" />
                        <label className="form-label" htmlFor="typeText">Адрес</label>
                    </div>

                    <hr />

                    <h5>Данные карты</h5>
                    <div className="row mb-3">
                        <div className="col-md-6 mb-2">
                            <div className="form-outline">
                                <input type="text" id="typeText" className="form-control" />
                                <label className="form-label" htmlFor="typeText">Имя владельца</label>
                            </div>
                        </div>
                        <div className="col-md-6 mb-2">
                            <div className="form-outline">
                                <input type="text" id="typeText" className="form-control" />
                                <label className="form-label" htmlFor="typeText">Номер</label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <div className="form-outline">
                                <input type="text" id="typeText" className="form-control" />
                                <label className="form-label" htmlFor="typeText">Срок</label>                                
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="form-outline">
                            <input type="text" id="typeText" className="form-control" />
                                <label className="form-label" htmlFor="typeText">CVV</label> 
                                
                            </div>
                        </div>
                    </div>
                    <hr className="mb-4" />                    
                <button className="btn btn-primary" type="button">Заказать</button>
                </div>
                {/*/.Card*/}
            </div>
            {/*Grid column*/}

            {/*Grid column*/}
            <div className="col-md-4 mb-4">
                {/* Heading */}
                <h4 className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted">Заказ</span>
                    <span className="badge rounded-pill badge-primary">3</span>
                </h4>

                {/* Cart */}
                <ul className="list-group mb-3">
                    {
                        productList.map((p, i) => {
                            return (
                            <li className="list-group-item d-flex justify-content-between" key={`${p.id}-${i}`}>
                                <div>
                                    <h6 className="my-0">{p.title}</h6>
                                    <small className="text-muted">{p.categoryTitle}</small>
                                </div>
                                <div className="col-md-4 float-right">
                                    <span className="text-muted">{p.price} р.</span>
                                    <button className="btn btn-outline-danger btn-sm" disabled={loading} onClick={() => removeFromBasket(p)}>Удалить</button>
                                </div>
                            </li>)
                        })
                    }  
                    <li className="list-group-item d-flex justify-content-between" key={"total"}>
                        <span>Итого</span>
                        <strong>{productList.reduce((acc:number, p) => acc + (p.price as number), 0)} р.</strong>
                    </li>
                </ul>
                {/* Cart */}
            </div>
            {/*Grid column*/}
        </div>
        {/*Grid row*/}
    </div>
    )
}