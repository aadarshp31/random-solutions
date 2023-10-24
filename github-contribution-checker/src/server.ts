import express, { Response } from 'express';
import serviceRoutes from './Routes/ServiceRoutes';

const app = express();

app.use(express.json());

// check status route 
app.get('/', (req, res: Response) => {
  return res.status(200).json({
    status: "success",
    message: "API is running"
  })
});

// Routes
app.use('/services', serviceRoutes);

export default app;