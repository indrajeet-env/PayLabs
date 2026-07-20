// creates an express app instance
import express from "express";

import paymentRoutes from './src/routes/payment.routes.js'

const app = express();

app.use(express.json());

app.use("/api/payments", paymentRoutes);

export default app;