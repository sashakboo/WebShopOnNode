import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { EditableTable, IEditableTableProps, InputTypes } from "../components/EditableTable";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import { ICategory, IProduct, IUpdatedProduct, IUser } from "../types/models";

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
  const [ categories, setCategories ] = useState<Array<ICategory>>([]);
  const { request, error, clearError } = useHttp();
  const auth = useContext(AuthContext);

  let tableProps: IEditableTableProps = {
    columnsIds: [],
    columnsTitle: [],
    inputTypes: [],
    selectItems: [],
    values: [],
    sourceObjs: [],
    canDisable: false,
    updateItemCallback: (sourceObj, form) => { }
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
      const apiUrl = '/api/products';
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
      canDisable: false,
      updateItemCallback: (sourceObj, form) => {
        const user = sourceObj as IUser;
        const newUser: IUser = { 
          ...user, 
          password: (form.get('password') as string ?? user.password), 
          role: (form.get('role') as string ?? user.role) 
        };
        updateUser(newUser)
        console.log('updated', newUser)
      }
    }
  
    const updateUser = async (user: IUser) => {
      try {
        const apiUrl = '/api/users/update';
        const response = await request(apiUrl, 'POST', JSON.stringify({ id: user.id, password: user.password, role: user.role }), { Authorization: `Bearer ${auth.token}` });
      } catch (e) { }
    }
  }

  if (activeTab.id === 'products') {
    const categorySelectItems = categories.map(c => ({ id: c.id, title: c.title }));
    tableProps = {
      columnsIds: [ 'id', 'category', 'title', 'price', 'icon' ],
      columnsTitle: [ 'ID', 'Категория', 'Имя', 'Цена', 'Фото' ],
      inputTypes: [ null, InputTypes.select, InputTypes.text, InputTypes.number, InputTypes.image ],
      selectItems: [ null, categorySelectItems, null, null, null ],
      values: products.map((p) => {
        return [ p.id, p.category.title, p.title, p.price, p.icon ]
      }),
      sourceObjs: [ ...products ],
      canDisable: false,
      updateItemCallback: async (sourceObj, form) => {
        const product = sourceObj as IProduct;
        const updatedProduct: IUpdatedProduct = {
          id: product.id,
          categoryId: form.get('category') as number ?? product.category.id,
          title: form.get('title') as string ?? product.title,
          price: form.get('price') as number ?? product.price
        }

        const icon = form.get('icon') as File;
        await updateProduct(updatedProduct);
        if (icon != null) {
          await updateIcon(product.id, icon);
        }
      }
    }

    const updateIcon = async(productId: number, file: File) => {
      try {
        const apiUrl = `/api/products/updateicon/${productId}`;
        const formData = new FormData();
        formData.append('icon', file);
        await request(apiUrl, 'POST', formData, { Authorization: `Bearer ${auth.token}` });
      } catch (error) { }
    }
  
    const updateProduct = async (product: IUpdatedProduct) => {
      try {
        const apiUrl = '/api/products/update';
        await request(apiUrl, 'POST', JSON.stringify(product), { Authorization: `Bearer ${auth.token}` });
      } catch (error) { }
    }
  }
  

  return (
    <div className="container-fluid">
      <ul className="nav nav-tabs">
        {tabsElement}
        <EditableTable {...tableProps}/>
      </ul>
    </div>
  )
}