import express, { Response, Request } from 'express';

const serviceRoutes = express.Router();

serviceRoutes.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    status: "success",
    message: "Some information about the running service"
  });
});

export default serviceRoutes;