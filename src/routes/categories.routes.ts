import { Router } from "express";
import { GetCategories } from "../services/products";
import { Request, Response } from 'express';
import Auth from "../middleware/auth.middleware";

const categoriesRouter = Router();

categoriesRouter.get('/', Auth, async (req: Request, res: Response) => {
 try {        
    const categories = await GetCategories();
    res.json(categories);          
 } catch (e) {
   res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
 }
})

export default categoriesRouter;