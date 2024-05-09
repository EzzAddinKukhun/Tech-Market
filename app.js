const express = require ('express');
require('dotenv').config();  
const app = express (); 
const PORT = 8000;
const userRoute = require ('./routes/User');
const adminRoute = require('./routes/AdminRouter')
const productsRouter = require('./routes/ProductsRouter')
const webRouter = require ('./routes/webRouter'); 

const cors = require('cors'); 
app.use(cors()); 
app.use('/user', userRoute); 
app.use('/products', productsRouter); 
app.use('/admin', adminRoute); 
app.use ('/', webRouter);
app.use("/ProfilePicture", express.static('PersonalImgs'));
app.use("/ProductPicture", express.static('ProductsImgs'));
// app.use(express.static(__dirname + '/PersonalImgs'));

console.log (__dirname)

app.listen (PORT, ()=>{
    console.log ("server is running!");
}) 



