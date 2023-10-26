import express, { Response, Request } from 'express';
import Service from '../services/Service';

const app = express.Router();

app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    status: "success",
    message: "Some information about the running service"
  });
});

app.post('/start', (req, res) => {
  const body: { interval: number } = req.body;

  clearInterval(Service.intervalRef);
  Service.StartService(body.interval);
  console.info('Service started successfully');

  res.status(201).json({
    status: "success",
    message: "Service started successfully"
  })
});

app.post('/stop', (req, res) => {
  clearInterval(Service.intervalRef);
  console.info('Service stopped successfully');

  res.status(200).json({
    status: "success",
    message: "Service stopped successfully"
  })
});

const serviceRoutes = app;

export default serviceRoutes;