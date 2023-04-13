import { useContext, useEffect, useState } from 'react';
import { useHttp } from "../hooks/http.hook"
import { IBasketProduct, ICreatedOrder, IProduct } from "../types/models";
import { AuthContext } from '../context/AuthContext';
import { NotifyContext } from '../context/NotifyContext';
import { Link } from 'react-router-dom';
import { Loader } from '../components/Loader';

export default function CheckoutPage() {
    const [ basketItems, setBasketItems ] = useState<Array<IBasketProduct>>([]);
    const [ orderDone, setOrderDone ] = useState(false);

    const { loading, request } = useHttp();
    const auth = useContext(AuthContext);

    const fetchProducts = async () => {
        try {
            const apiUrl = `/api/basket`;
            const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${auth.token}` });
            const data = response as Array<IBasketProduct>;
            setBasketItems(data);    
        } catch (e) { }
      }

    useEffect(() => {
        fetchProducts();
    }, []);

    const { changeBasketCount, resetBasketCount } = useContext(NotifyContext);

    const removeFromBasket = async (product: IBasketProduct) => {
        try {
            changeBasketCount(-1); 
            const apiUrl = `/api/basket/delete/${product.id}`;
            await request(apiUrl, 'POST', null, { Authorization: `Bearer ${auth.token}` });  
            setBasketItems(basketItems.filter(x => x.id !== product.id));
        } catch (e) { }
    }

    const createOrder = async () => {
        const apiUrl = '/api/orders/create';
        const createdOrder: ICreatedOrder = {
            products: basketItems.map(p => ({ id: p.productId, orderPrice: p.price, basketItemId: p.id }))
        };
        await request(apiUrl, 'POST', JSON.stringify(createdOrder), { Authorization: `Bearer ${auth.token}` });  
        setBasketItems([]);
        resetBasketCount();
        setOrderDone(true);
    }

    if (orderDone){
        return (
            <div className="container">
                <Link to="/">Вернуться к покупкам</Link>
            </div>
        )
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
                <button className="btn btn-primary" type="button" onClick={createOrder}>Заказать</button>
                </div>
                {/*/.Card*/}
            </div>
            {/*Grid column*/}

            {/*Grid column*/}
            <div className="col-md-4 mb-4">
                {/* Heading */}
                <h4 className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted">Заказ</span>
                </h4>
                {loading && <Loader />}

                {/* Cart */}
                <ul className="list-group mb-3">
                    {
                        basketItems.map((p, i) => {
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
                        <strong>{basketItems.reduce((acc:number, p) => acc + (p.price as number), 0)} р.</strong>
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