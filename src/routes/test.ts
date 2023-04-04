import { Router } from "express";

const router = Router();

router.get('/test', async (req, res) => {
    console.log('test');
    try {
      res.json({
        Result: "Success"
      });          
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
  });

  export default router;