import  dotenv from 'dotenv';
import express from 'express';
import connectdb from './config/dbconnect.js'
import cors from 'cors';
import router from './routes/Userroutes.js'
dotenv.config();//by this we can easily accessible all the variable from .env file which can access by process now
const app=express();
const port=process.env.PORT;//accessing env file variable using process 
const Databaseurl=process.env.DATABASE_URL
app.use(cors());//applying cors policy so that in future in we dont get error while connecting to Frontend

connectdb(Databaseurl)//connect database
app.use(express.json());//for json
app.listen(port,()=>{
    console.log("Jai Hind")
});
app.use('/api/user',router)//for connecting router or load router