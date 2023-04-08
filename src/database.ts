import pkg, { QueryResult } from 'pg';
import config from 'config';
import { IProduct, IUser } from './models.js';

const DATABASE_URL = config.get<string>('DATABASE_URL') || '';
const { Client } = pkg;

export async function GetUser(email: string): Promise<IUser | null> {
    const commandText = 'SELECT id, email, password from public.users where email = $1::varchar';
    const params = [ email ];
    const result = await executeCommand(commandText, params);
    if (result.rowCount === 1) {
        return Promise.resolve(
            {
                id: result.rows[0]['id'],
                email: result.rows[0]['email'],
                password: result.rows[0]['password']
            });
    }
    return null;
}

export async function CreateUser(email: string, passwordHash: string): Promise<IUser | null> {
    const commandText = 'insert into users (email, password) values ($1::string, $2::string);';
    const params = [ email, passwordHash ];
    const result = await executeCommand(commandText, params);
    return await GetUser(email);
}

export async function GetUserRole(id: number): Promise<string> {
    const commandText = 'SELECT role FROM public.users where id = $1::int';
    const params = [ id ];
    const result = await executeCommand(commandText, params);
    if (result.rowCount === 1){
        return result.rows[0]['role'];
    }
    return '';
}

export async function GetProducts(categoryId: number | null, isActive: boolean): Promise<Array<IProduct>> {
    let commandText = 'SELECT ' +
      'p.id, p.title, c.id as categoryId, c.title as categoryTitle, p.price, convert_from(p.icon, \'UTF8\') as icon ' + 
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
            id: r["id"],
            category : {
                id: r["categoryId"],
                title: r["categoryTitle"]
            },
            title: r["title"],
            price: r["price"],
            tag: '',
            icon: r['icon']
        }
        return product;
    });
    return Promise.resolve(products);
}

export async function GetBasketProducts(userId: number): Promise<Array<IProduct>> {
    const commandText = 'select p.id, p.title, c.id as categoryId, c.title as categoryTitle, p.price, convert_from(p.icon, \'UTF8\') as icon ' + 
      'from public.basket b ' + 
      'inner join public.products p on p.id = b.product '+ 
      'inner join public.productscategory c on p.category = c.id ' + 
      'where b.customer = $1::int';
    const params = [ userId ];
    const results = await executeCommand(commandText, params);
    const products = results.rows.map(r => {
        const product: IProduct = {
            id: r["id"],
            category : {
                id: r["categoryId"],
                title: r["categoryTitle"]
            },
            title: r["title"],
            price: r["price"],
            tag: '',
            icon: r['icon']
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
    const commandText = 'insert into public.basket (product, customer) values ($1::int, $2::int)';
    const params = [ productId, userId ];
    await executeCommand(commandText, params);
}

export function TestDBConnect(connectionString: string){
    const client = new Client(connectionString);

    (async () => {
    await client.connect();
    try {
        const results = await client.query("SELECT NOW()");
        console.log('connected to db');
    } catch (err) {
        console.error("error executing query:", err);
        throw err;
    } finally {
        client.end();
    }
    })();
}

async function executeCommand(commandText: string, params: Array<any>): Promise<QueryResult> {
    const client = new Client(DATABASE_URL);

    await client.connect();
    try {
        return await client.query(commandText, [...params]);
    } catch (err) {
        console.error("error executing query:", err);
        throw err;
    } finally {
        await client.end();
    }
}