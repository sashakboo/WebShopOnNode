import fs from 'fs';
import { Router } from "express";
import { CreateProduct, GetProduct, GetProducts, UpdateProduct, UpdateProductIcon } from "../services/products.js";
import { Request, Response } from 'express';
import Auth from "../middleware/auth.middleware.js";
import { ICreatedProduct, IUpdatedProduct } from "../models.js";

interface ICreatedProductRequest extends Request {
  body: ICreatedProduct
}

interface IUpdatedProductRequest extends Request {
  body: IUpdatedProduct
}

const productsRouter = Router();

productsRouter.get('/', Auth, async (req: Request, res: Response) => {
  try {
    const filteredProducts = await GetProducts(null, true);
    res.json(filteredProducts);          
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

productsRouter.get('/admin', Auth, async (req: Request, res: Response) => {
  try {
    const filteredProducts = await GetProducts(null, null);
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

productsRouter.post('/create', Auth, async (req: ICreatedProductRequest, res: Response) => {
  try {
    const product = req.body;
    const productId = await CreateProduct(product);
    if (productId == null) {
      res.status(400).json({ message: 'Что-то пошло не так, попробуйте снова' });
      return;
    }
    if (product.iconPath != null) {
      await UpdateProductIcon(productId, product.iconPath);
      fs.unlink(product.iconPath, () => {});
    }
    const updatedProduct = await GetProduct(productId);
    res.json(updatedProduct);  
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

productsRouter.post('/update', Auth, async (req: IUpdatedProductRequest, res: Response) => {
  try {      
    const product = req.body;
    await UpdateProduct(product);
    if (product.iconPath != null) {
      await UpdateProductIcon(product.id, product.iconPath);
      fs.unlink(product.iconPath, () => {});
    }
    const updatedProduct = await GetProduct(product.id);
    res.json(updatedProduct);  
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

export default productsRouter;