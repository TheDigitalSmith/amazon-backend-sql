const express = require('express');
const app = express();
const dotenv = require('dotenv');

const productsService = require ('./src/services/products/index');
dotenv.config();

app.use(express.json());

app.use('/products', productsService);
app.listen(process.env.PORT,()=>{
    console.log(`Your server is launched at PORT ${process.env.PORT}`);
})