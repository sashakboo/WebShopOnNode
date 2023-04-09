import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import config from 'config';
import bodyParser from 'body-parser';
import productsRouter from './routes/products.routes.js';
import authRouter from './routes/auth.routes.js';
import basketRouter from './routes/basket.routes.js';
import usersRouter from './routes/users.routes.js';
import categoriesRouter from './routes/categories.routes.js';
import filesRouter from './routes/files.routes.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const PORT = config.get<number>('port') || 5000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/products', productsRouter)
app.use('/api/auth', authRouter);
app.use('/api/basket', basketRouter);
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/files', filesRouter)

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(
      __dirname, 'client', 'index.html'));
  });
}

app.listen(PORT,  () => console.log(`App has been started on port ${PORT}`));
