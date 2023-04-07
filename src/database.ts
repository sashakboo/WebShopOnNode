import pkg from 'pg';
import config from 'config';
import { IProduct } from './models.js';

const DATABASE_URL = config.get<string>('DATABASE_URL') || '';
const { Client } = pkg;

export async function GetProducts(categoryId: number | null): Promise<Array<IProduct>> {
    const client = new Client(DATABASE_URL);

    await client.connect();
    try {
        let commandText = 'SELECT ' +
          'p.id, p.title, c.id as categoryId, c.title as categoryTitle, p.price, convert_from(p.icon, \'UTF8\') as icon ' + 
          'FROM public.products as p inner join public.productscategory c on p.category = c.id';
        if (categoryId != null){
            commandText += ' where category = $1::int';
        }
        const args = categoryId != null ? [categoryId] : [];
        const results = await client.query(commandText, [...args]);
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
    } catch (err) {
        console.error("error executing query:", err);
        throw err;
    } finally {
        client.end();
    }
}

export function TestDBConnect(connectionString: string){
    const client = new Client(connectionString);

    (async () => {
    await client.connect();
    try {
        const results = await client.query("SELECT NOW()");
    } catch (err) {
        console.error("error executing query:", err);
        throw err;
    } finally {
        client.end();
    }
    })();
}