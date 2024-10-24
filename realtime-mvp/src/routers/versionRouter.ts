import express, { Router, Request, Response, NextFunction } from 'express';
import { version } from '../../package.json';
import CustomError from '../common/customError';

const versionRouter: Router = express.Router();

versionRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const versionObject = {
      version,
    };

    try {
      res.send(versionObject);
    } catch (error) {
      throw new CustomError(error, 503);
    }
  } catch (error) {
    next(error);
  }
});

export default versionRouter;
