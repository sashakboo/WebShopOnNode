import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { EditableTable, IEditableTableProps, InputTypes } from "../components/EditableTable";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import { ICategory, ICreatedProduct, IOrder, IOrderState, IProduct, IUpdatedProduct, IUser } from "../types/models";
import { Loader } from "../components/Loader";

interface ITab {
  id: string, 
  title: string
}

interface ITabs {
  [id: string]: ITab
}

export default function AdminPage() {
  const tabs: ITabs = {
    'users': { id: 'users', title: 'Пользователи' },
    'products': { id: 'products', title: 'Товары' },
    'orders': { id: 'orders', title: 'Заказы' }
  }

  const [ activeTab, setActiveTab] = useState(tabs.users);
  const onChangeActive = (tab: ITab) => {
    setActiveTab({...tab})
  }

  const tabsElement = Object.entries(tabs).map(([key, value]) => {
    return (
      <li className="nav-item" key={key}>
          <Link className={`nav-link ${key === activeTab.id ? 'active' : ''}`} aria-current="page" to="" onClick={() => onChangeActive(value)}>{value.title}</Link>
      </li>
    )
  })

  const [ users, setUsers ] = useState<Array<IUser>>([]);
  const [ products, setProducts ] = useState<Array<IProduct>>([]);
  const [ orders, setOrders ] = useState<Array<IOrder>>([]);
  const [ orderStates, setOrderStates ] = useState<Array<IOrderState>>([]);
  const [ categories, setCategories ] = useState<Array<ICategory>>([]);
  const { request, error, clearError, loading } = useHttp();
  const auth = useContext(AuthContext);

  let tableProps: IEditableTableProps = {
    columnsIds: [],
    columnsTitle: [],
    inputTypes: [],
    selectItems: [],
    values: [],
    sourceObjs: [],
    canAddNew: false,
    updateItem: (sourceObj, form) => { },
    addNewItem: () => { }
  };

  useEffect(() => {
    error && alert(error);
    clearError();
  }, [error, clearError]);

  useEffect(() => {
    async function getUsers() {
      const apiUrl = '/api/users';
      const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${auth.token}` });
      const loadedUsers = response as Array<IUser>;
      setUsers([...loadedUsers]);
    }
    getUsers();
  }, []);

  useEffect(() => {
    async function getProducts() {
      const apiUrl = '/api/products/admin';
      const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${auth.token}` });
      const loadedProducts = response as Array<IProduct>;
      setProducts([...loadedProducts]);
    }
    getProducts();
  }, []);

  useEffect(() => {
    async function getCategories() {
      const apiUrl = '/api/categories';
      const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${auth.token}` });
      const loadedCategopries= response as Array<ICategory>;
      setCategories([...loadedCategopries]);
    }
    getCategories();
  }, []);

  useEffect(() => {
    async function getOrderStates() {
      const apiUrl = '/api/orders/states';
      const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${auth.token}` });
      const loadedOrderStates= response as Array<IOrderState>;
      setOrderStates([...loadedOrderStates]);
    }
    getOrderStates();
  }, []);

  useEffect(() => {
    async function getOrders() {
      const apiUrl = '/api/orders';
      const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${auth.token}` });
      const loadedOrders= response as Array<IOrder>;
      setOrders([...loadedOrders]);
    }
    getOrders();
  }, []);

  if (activeTab.id === 'users') {
    tableProps = {
      columnsIds: [ 'id', 'email', 'role', 'password' ],
      columnsTitle: [ 'ID', 'Email', 'Роль', 'Пароль'],
      inputTypes: [ null, null, InputTypes.text, InputTypes.text ],
      selectItems: [],
      values: users.map((u) => {
        return [ u.id, u.email, u.role, '' ]
      }),
      sourceObjs: [ ...users ],
      canAddNew: false,
      updateItem: async (sourceObj, form) => {
        const user = sourceObj as IUser;
        const newUser: IUser = { 
          ...user, 
          password: (form.get('password') as string ?? user.password), 
          role: (form.get('role') as string ?? user.role) 
        };
        const result = await updateUser(newUser);
        setUsers(users.map(u => {
          if (u.id === result?.id)
            return result;

          return u;
        }));
      },
      addNewItem: () => { }
    }
  
    const updateUser = async (user: IUser) => {
      try {
        const apiUrl = '/api/users/update';
        const response = await request(apiUrl, 'POST', JSON.stringify({ id: user.id, password: user.password, role: user.role }), { Authorization: `Bearer ${auth.token}` });
        return response as IUser;
      } catch (e) { }
    }
  }

  if (activeTab.id === 'products') {
    const createIcon = async(file: File) => {
      try {
        const apiUrl = `/api/files/createicon`;
        const formData = new FormData();
        formData.append('icon', file);
        const response = await request(apiUrl, 'POST', formData, { Authorization: `Bearer ${auth.token}` });
        return response.filePath as string;
      } catch (error) { }
    }
  
    const updateProduct = async (product: IUpdatedProduct) => {
      try {
        const apiUrl = '/api/products/update';
        const response = await request(apiUrl, 'POST', JSON.stringify(product), { Authorization: `Bearer ${auth.token}` });
        return response as IProduct;
      } catch (error) { }
    }

    const createProduct = async (product: ICreatedProduct) => {
      try {
        const apiUrl = '/api/products/create';
        const response = await request(apiUrl, 'POST', JSON.stringify(product), { Authorization: `Bearer ${auth.token}` });
        return response as IProduct;
      } catch (error) { }
    }

    const updateProductHandler = async (sourceObj: object, form: Map<string, any>) => {
      console.log(form)
      const icon = form.get('icon') as File;
      let iconPath = null;
      if (icon != null) {
        iconPath = await createIcon(icon);
      }
      const product = sourceObj as IProduct;
      const updatedProduct: IUpdatedProduct = {
        id: product.id,
        categoryId: form.get('category') as number ?? product.category.id,
        title: form.get('title') as string ?? product.title,
        price: form.get('price') as number ?? product.price,
        iconPath: iconPath ?? null,
        isActive: form.get('isactive') == 1 ?? true
      }
      console.log(form.get('isactive'))
      console.log(updatedProduct)

      const updateResult = await updateProduct(updatedProduct);
      setProducts(products.map(p => {
        if (p.id === updateResult?.id)
          return updateResult;

        return p;
      }));
    }

    const addProductHandler = async (form: Map<string, any>) => {
      const icon = form.get('icon') as File;
      let iconPath = null;
      if (icon != null) {
        iconPath = await createIcon(icon);
      }

      const newProduct: ICreatedProduct = {
        categoryId: form.get('category') as number,
        title: form.get('title') as string,
        price: form.get('price') as number,
        iconPath: iconPath ?? null,
        isActive: form.get('isactive') == 1 ? true : false
      }      
      const result = await createProduct(newProduct) as IProduct;
      setProducts([ result, ...products ]);
    }

    const categorySelectItems = categories.map(c => ({ id: c.id, title: c.title }));
    const isActiveSelectItems = [ { id: 1, title: 'Да' }, { id: 0, title: 'Нет' } ];
    tableProps = {
      columnsIds: [ 'id', 'category', 'title', 'price', 'isactive', 'icon' ],
      columnsTitle: [ 'ID', 'Категория', 'Имя', 'Цена', 'Вкл.', 'Фото'],
      inputTypes: [ null, InputTypes.select, InputTypes.text, InputTypes.number, InputTypes.select, InputTypes.image ],
      selectItems: [ null, categorySelectItems, null, null, isActiveSelectItems, null ],
      values: products.map((p) => {
        return [ p.id, p.category.title, p.title, p.price, p.isActive ? 'Да' : 'Нет', p.icon]
      }),
      sourceObjs: [ ...products ],
      canAddNew: true,
      updateItem: updateProductHandler,
      addNewItem: addProductHandler
    }
  }

  if (activeTab.id === 'orders') {
    const stateSelectItems = orderStates.map(c => ({ id: c.id, title: c.title }));
    tableProps = {
      columnsIds: [ 'id', 'created', 'customerEmail', 'state', 'itemsCount', 'totalCost' ],
      columnsTitle: [ 'ID', 'Создано', 'Email', 'Состояние', 'Кол-во позиций', 'Сумма' ],
      inputTypes: [ null, null, null, InputTypes.select, null, null ],
      selectItems: [ null, null, null, stateSelectItems, null, null ],
      values: orders.map((p) => {
        return [ p.id, new Date(p.created).toLocaleDateString(), p.customerEmail, p.state, p.itemsCount, p.totalCost]
      }),
      sourceObjs: [ ...orders ],
      canAddNew: true,
      updateItem: () => {},
      addNewItem: () => {}
    } 
  }
  

  return (
    <div className="container-fluid">
      <ul className="nav nav-tabs">
        {tabsElement}
      </ul>
      {loading && <Loader />}
        <EditableTable {...tableProps}/>
    </div>
  )
}