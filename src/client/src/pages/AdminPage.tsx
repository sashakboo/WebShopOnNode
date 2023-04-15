import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { EditableTable, IEditableTableProps, InputTypes } from "../components/EditableTable";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import { ICategory, ICreatedProduct, IOrder, IOrderState, IProduct, IUpdateOrderState, IUpdatedProduct, IUser } from "../models";
import { Loader } from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

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
    'categories': { id: 'categories', title: 'Категории товаров' },
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
    const isActiveSelectItems = [ { id: 1, title: 'Да' }, { id: 0, title: 'Нет' } ];
    tableProps = {
      columnsIds: [ 'id', 'email', 'role', 'password', 'active' ],
      columnsTitle: [ 'ID', 'Email', 'Роль', 'Пароль', 'Вкл'],
      inputTypes: [ null, null, InputTypes.text, InputTypes.text, InputTypes.select ],
      selectItems: [ null, null, null, null, isActiveSelectItems ],
      values: users.map((u) => {
        return [ u.id, u.email, u.role, '', u.active ? 'Да' : 'Нет' ]
      }),
      sourceObjs: [ ...users ],
      canAddNew: false,
      updateItem: async (sourceObj, form) => {
        const user = sourceObj as IUser;
        const newUser: IUser = { 
          ...user, 
          password: (form.get('password') as string ?? user.password), 
          role: (form.get('role') as string ?? user.role),
          active: form.get('active') != null ? form.get('active') == 1 : user.active
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
      const apiUrl = '/api/users/update';
      const response = await request(apiUrl, 'POST', JSON.stringify(user), { Authorization: `Bearer ${auth.token}` });
      return response as IUser;
    }
  }

  if (activeTab.id === 'products') {
    const createIcon = async(file: File) => {
      const apiUrl = `/api/files/createicon`;
      const formData = new FormData();
      formData.append('icon', file);
      const response = await request(apiUrl, 'POST', formData, { Authorization: `Bearer ${auth.token}` });
      return response.filePath as string;
    }
  
    const updateProduct = async (product: IUpdatedProduct) => {
      const apiUrl = '/api/products/update';
      const response = await request(apiUrl, 'POST', JSON.stringify(product), { Authorization: `Bearer ${auth.token}` });
      return response as IProduct;
    }

    const createProduct = async (product: ICreatedProduct) => {
      const apiUrl = '/api/products/create';
      const response = await request(apiUrl, 'POST', JSON.stringify(product), { Authorization: `Bearer ${auth.token}` });
      return response as IProduct;
    }

    const updateProductHandler = async (sourceObj: object, form: Map<string, any>) => {
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
        isActive: form.get('isactive') == null ? product.isActive : form.get('isactive') == 1 ?? false
      }

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
    const updateOrderState = async (order: IUpdateOrderState) => {
      await request('/api/orders/changestate', 'POST', JSON.stringify(order), { Authorization: `Bearer ${auth.token}` });
      setOrders([...orders.map(o => {
        if (o.id == order.orderId){
          return {
            ...o,
            state: orderStates.find(s => s.id == order.state)?.title ?? o.state
          }
        }
        return o;
      })])
    }

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
      canAddNew: false,
      updateItem: async (sourceObj, form) => {
        const order = sourceObj as IOrder;
        const updatedOrderState = {
          orderId: order.id,
          state: form.get('state') as number
        }
        await updateOrderState(updatedOrderState);
      },
      addNewItem: () => {}
    } 
  }

  if (activeTab.id === 'categories') {
    const createCategory = async (title: string) => {
      const response = await request(`/api/categories/create/${title}`, 'POST', null, { Authorization: `Bearer ${auth.token}` });
      const category = response as ICategory;
      setCategories([ category, ...categories ]);
    }

    const updateCategory = async (category: ICategory) => {
      const response = await request(`/api/categories/update`, 'POST', JSON.stringify(category), { Authorization: `Bearer ${auth.token}` });
      const updatedCategory = response as ICategory;
      setCategories(categories.map(p => {
        if (p.id === updatedCategory?.id)
          return updatedCategory;

        return p;
      }));
    }

    const isActiveSelectItems = [ { id: 1, title: 'Да' }, { id: 0, title: 'Нет' } ];
    tableProps = {
      columnsIds: [ 'id', 'title', 'active' ],
      columnsTitle: [ 'ID', 'Наименование', 'Вкл' ],
      inputTypes: [ null, InputTypes.text, InputTypes.select ],
      selectItems: [ null, null, isActiveSelectItems ],
      values: categories.map((p) => {
        return [ p.id, p.title, p.active ? 'Да' : 'Нет' ]
      }),
      sourceObjs: [ ...categories ],
      canAddNew: true,
      updateItem: async (sourceObj, form) => {
        const sourceCategory = sourceObj as ICategory;
        const category = {
          ...sourceCategory,
          title: form.get('title') ?? sourceCategory.title,
          active: form.get('active') == 1
        }
        await updateCategory(category);
      },
      addNewItem: async (form) => {
        await createCategory(form.get('title'));
      }
    } 
  }  

  return (
    <div className="container-fluid">
      <ul className="nav nav-tabs">
        {tabsElement}
      </ul>
      { error != null && <ErrorMessage message={error} close={clearError}/> }
      {loading && <Loader />}
        <EditableTable {...tableProps}/>
    </div>
  )
}