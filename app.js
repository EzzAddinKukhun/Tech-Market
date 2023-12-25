const express = require ('express'); 
const app = express (); 
const PORT = 8000;
const userRoute = require ('./routes/User');
app.use('/user', userRoute); 
app.use (express.json()); 

app.listen (PORT, ()=>{
    console.log ("server is running!")
}) 



