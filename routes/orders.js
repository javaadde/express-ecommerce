import express, { urlencoded } from 'express'
export const ordersRouter = express.Router()
import mongoose from 'mongoose';



// =======================[usigs]=================================
// session
import MongoStore from 'connect-mongo';
import session from 'express-session';
ordersRouter.use(session(
       {
                 secret: 'your_secret_key',
                 resave: false,
                 saveUninitialized: false,
                 store: MongoStore.create({ mongoUrl: 'mongodb://localhost/MyUsers' })
       })
    )



//  json and url endcoding
ordersRouter.use(express.json())
ordersRouter.use(express.urlencoded({extended:true}))  

// db url
import dotenv from 'dotenv'
dotenv.config()
const dburi =  process.env.dbURL  

// orders collection
import {orders} from './cart.js';

// ====================
// ==========================
// ==================================


ordersRouter.get('/', async(req,res)=>{  

    if(req.session.data.role === 'admin'){
      return  res.render('404')
    }

    const user_id = req.session.data.username;

    try{
   
        await mongoose.connect(dburi)
        const orderArray = await orders.find({user_id:user_id})
        res.render('orders',{
            orders:orderArray,
        })
    }
    catch(err){
      console.log(err);
    }
})

ordersRouter.get('/details/:id', async(req,res)=>{
    const order_id = req.params.id;
    try{
        await mongoose.connect(dburi);
        const data = await orders.findOne({_id:order_id})
        res.render('orderDetails',{
            details:data,
        })
    }
    catch(err){
        console.log(err);
        
    }
})