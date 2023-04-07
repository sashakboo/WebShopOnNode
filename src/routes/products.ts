import { Router } from "express";
import { IProduct } from "../models.js";
import { GetProducts } from "../database.js";

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
    console.log('get products');
    try {        
      const filteredProducts = await GetProducts(null);
      res.json(filteredProducts);          
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
  });

productsRouter.get('/:catId', async (req, res) => {
    console.log('get products', req.params.catId);
    try {      
      const catId: number = parseInt(req.params.catId);
      if (Number.isNaN(catId))
      {
        res.status(400);
      }
      const filteredProducts = await GetProducts(catId);
      res.json(filteredProducts);          
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
  });

export default productsRouter;