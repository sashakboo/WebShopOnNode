import { Router } from "express";
import { GetProducts, UpdateProdcut } from "../services/products.js";
import { Request, Response } from 'express';
import multer from 'multer';
import Auth from "../middleware/auth.middleware.js";
import { IUpdatedProduct } from "../models.js";
import * as fs from 'fs';
import * as path from 'path';
import { executeCommand } from "../database/database.js";

const productsRouter = Router();
const upload = multer({ dest: './uploads/' })

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

productsRouter.post('/updateicon/:productId', upload.single('icon'), async (req: Request, res: Response) => {
  try {    
    const productId = parseInt(req.params.productId);
    if (Number.isNaN(productId)){
      res.status(400);
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    const sampleFile = req.file as Express.Multer.File;
    console.log(sampleFile)

    fs.readFile(sampleFile.path, 'base64', async function(err, imgData) {
      // convert binary data to base64 encoded string
      const commandText = 'update public.products set icon = convert_to($1::string, \'UTF8\') where id = $2::int';
      await executeCommand(commandText, [imgData, productId]);
    });

    fs.unlink(sampleFile.path, (err) => {
      console.log(err);
    });

    res.status(200).json('Продукт обновлен');    
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
})

export default productsRouter;