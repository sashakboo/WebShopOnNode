import { Router } from "express";
import { GetProducts } from "../database.js";
import { Request, Response } from 'express';
import Auth from "../middleware/auth.middleware.js";

const productsRouter = Router();

productsRouter.get('/', Auth, async (req: Request, res: Response) => {
    try {        
      const filteredProducts = await GetProducts(null, true);
      res.json(filteredProducts);          
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
  });

productsRouter.get('/:catId', async (req: Request, res:Response) => {
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

export default productsRouter;