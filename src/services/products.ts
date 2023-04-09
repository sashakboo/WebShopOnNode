import { executeCommand } from "../database/database.js";
import { IProduct, IBasketProduct, ICreatedProduct, ICategory, IUpdatedProduct } from "../models.js";

export async function GetCategories(): Promise<Array<ICategory>> {
  const commandText = 'select id, title from productscategory';
  const results = await executeCommand(commandText, []);
  return results.rows.map(r => {
    return {
      id: parseInt(r['id']),
      title: r['title']
    } as ICategory;
  });
}

export async function GetProducts(categoryId: number | null, isActive: boolean): Promise<Array<IProduct>> {
  let commandText = 'SELECT ' +
    'p.id, p.title, c.id as categoryid, c.title as categorytitle, p.price, convert_from(p.icon, \'UTF8\') as icon ' + 
    'FROM public.products as p inner join public.productscategory c on p.category = c.id ' +
    'where active = $1::boolean';
  let params: Array<any> = [ isActive ]
  if (categoryId != null){
    commandText += ' and category = $2::int';
    params = [ ...params, categoryId ];
  }
  const results = await executeCommand(commandText, params);
  const products = results.rows.map(r => {
      const product: IProduct = {
          id: parseInt(r["id"]),
          category : {
              id: parseInt(r["categoryid"]),
              title: r["categorytitle"]
          },
          title: r["title"],
          price: parseInt(r["price"]),
          tag: '',
          icon: r['icon']
      }
      return product;
  });
  return Promise.resolve(products);
}

export async function GetBasketProducts(userId: number): Promise<Array<IBasketProduct>> {
  const commandText = 'select b.id, p.id as productid, p.title, c.title as categorytitle, p.price ' + 
    'from public.basket b ' + 
    'inner join public.products p on p.id = b.product '+ 
    'inner join public.productscategory c on p.category = c.id ' + 
    'where b.customer = $1::int';
  const params = [ userId ];
  const results = await executeCommand(commandText, params);
  const products = results.rows.map(r => {
      const product: IBasketProduct = {
          id: parseInt(r["id"]),
          title: r["title"],
          categoryTitle: r["categorytitle"],
          price: parseInt(r["price"]),
          productId: parseInt(r["productid"])
      }
      return product;
  });
  return Promise.resolve(products);
}

export async function GetBasketCount(userId: number): Promise<number> {
  const commandText = 'select count(id) as count from public.basket where customer = $1::int';
  const params = [ userId ];
  const results = await executeCommand(commandText, params);
  if (results.rowCount !== 1)
    return Promise.resolve(0);

  const count = results.rows[0]['count'] as number
  return Promise.resolve(count);
}

export async function AddToBasket(productId: number, userId: number): Promise<void> {
  const commandText = 'insert into public.basket (product, customer) values ($1::int, $2::int) RETURNING id';
  const params = [ productId, userId ];
  const results = await executeCommand(commandText, params);
  if (results.rowCount === 1)
  {
    console.log('new basket item', results.rows[0]['id']);
  }
}

export async function RemoveFromBasket(productId: number, userId: number): Promise<void> {
  const commandText = 'delete from public.basket where id = $1::int and customer = $2::int';
  const params = [ productId, userId ];
  await executeCommand(commandText, params);
}

export async function CreateProduct(product: ICreatedProduct) {
  const commandText = 'insert into public.products (title, category, price, active) ' + 
    'values ($1::string, $2::int, $3::numeric, $4::boolean)';
  const params = [ product.title, product.categoryId, product.price, product.isActive ];
  await executeCommand(commandText, params);
}

export async function UpdateProdcut(product: IUpdatedProduct) {
  const commandText = 'update public.products set category = $1::int, title = $2::string, price = $3::numeric where id = $4::int';
  const params = [ product.categoryId, product.title, product.price, product.id ];
  await executeCommand(commandText, params);

}