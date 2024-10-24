import express, { Router, Request, Response, NextFunction } from 'express';

import CustomError from '../common/customError';

const baseRouter: Router = express.Router();

baseRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
    };

    try {
      res.send(healthcheck);
    } catch (error) {
      healthcheck.message = error;
      throw new CustomError(error, 503);
    }
  } catch (error) {
    next(error);
  }
});

export default baseRouter;
