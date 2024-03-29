
import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRouter from './routers/productRouter.js';
import userRouter from "./routers/userRouter.js";
import orderRouter from './routers/orderRouter.js';

const port = process.env.PORT || 4000;

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use('/api/users', userRouter);

app.use('/api/products', productRouter);

app.use('/api/orders', orderRouter);

app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

app.get("/", (req,res) => {
    res.send("server is ready")
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  const path = require("path");
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(port, () => {
    console.log(`Server is running at Port ${port}`);
});