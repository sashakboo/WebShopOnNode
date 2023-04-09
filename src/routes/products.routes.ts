import { Router } from "express";
import { GetProducts, UpdateProdcut } from "../services/products.js";
import { Request, Response } from 'express';
import Auth from "../middleware/auth.middleware.js";
import { IUpdatedProduct } from "../models.js";

const productsRouter = Router();

productsRouter.get('/', Auth, async (req: Request, res: Response) => {
    try {        
      const filteredProducts = await GetProducts(null, true);
      res.json(filteredProducts);          
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
  });

productsRouter.get('/:catId', Auth, async (req: Request, res:Response) => {
    try {      
      const catId: number = parseInt(req.params.catId);
      if (Number.isNaN(catId))
      {
        res.status(400);
      }
      const filteredProducts = await GetProducts(catId, true);
      res.json(filteredProducts);          
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
  });

interface IUpdatedProductRequest extends Request {
  body: IUpdatedProduct
}

productsRouter.post('/update', Auth, async (req: IUpdatedProductRequest, res: Response) => {
  try {      
    const product = req.body;
    await UpdateProdcut(product);
    res.status(200).json('Продукт обновлен');  
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
})

export default productsRouter;