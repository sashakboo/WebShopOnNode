import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/test.js';
import config from 'config';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const PORT = config.get<number>('port') || 5000;

const app = express();

app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(
      __dirname, 'client', 'index.html'));
  });
}

app.listen(PORT,  () => console.log(`App has been started on port ${PORT}`));
