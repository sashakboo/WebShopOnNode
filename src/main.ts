import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import config from 'config';
import bodyParser from 'body-parser';
import { TestDBConnect } from './database.js';
import productsRouter from './routes/products.routes.js';
import authRouter from './routes/auth.routes.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const PORT = config.get<number>('port') || 5000;
const DATABASE_URL = config.get<string>('DATABASE_URL') || '';

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/products', productsRouter)
app.use('/api/auth', authRouter);

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(
      __dirname, 'client', 'index.html'));
  });
}

app.listen(PORT,  () => console.log(`App has been started on port ${PORT}`));
TestDBConnect(DATABASE_URL);
