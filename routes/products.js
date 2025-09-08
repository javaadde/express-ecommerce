import express from 'express';
export const productRouter = express.Router()
import mongoose, { Schema } from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';

// imposrting session and json

productRouter.use(express.json())
productRouter.use(express.urlencoded({extended:true}))
productRouter.use(session(
       {
                 secret: 'your_secret_key',
                 resave: false,
                 saveUninitialized: false,
                 store: MongoStore.create({ mongoUrl: 'mongodb://localhost/MyUsers' })
       }
))

// db uri
import dotenv from 'dotenv';
dotenv.config()
const dbURL = process.env.dbURL

// schemas

import {users} from './signup.js'
const proSchema = new Schema({
    _id:String,
    name:String,
    price:Number,
    category:String,
    url:String,
})

export const products = mongoose.model('products',proSchema)

// ___________________________________________________________________________________

import { carts } from './cart.js';

// ===================================================================================

productRouter.get('/', async(req,res)=>{

    await mongoose.connect(dbURL);
    console.log('connected');

    const allProducts = await products.find()
    
   

    res.render('products',{
        products:allProducts
    })

})

// ===================================================================================
// ==========================[ products by categories  ]==============================
// ===================================================================================

productRouter.get('/:name', async(req,res)=>{
    const category_name  =  req.params.name


    await mongoose.connect(dbURL);

    const allProducts = await products.find({category:category_name});

    console.log(category_name);
    
    res.render('products',{
        products:allProducts
    })
    
})


// ===================================================================================
// ==========================[ add to cart  ]==============================
// ===================================================================================

productRouter.put('/addtocart/:id', async(req,res) => {

    const user_id = req.session.data.username
    const product_id = req.params.id
   

    try{

    await mongoose.connect(dbURL);
    //  updating users carts

    const proDetails = await products.findOne({_id:product_id})
    const updated = await carts.updateOne({_id:user_id} , {$addToSet:{items:{
        product_id:proDetails._id,
        name:proDetails.name,
        price:proDetails.price,
        quantity:1,
        url:proDetails.url,
    }}}) 

      
      if (updated.modifiedCount > 0) {
          res.json({
            message:'item added to cart'
          })
      }

      else if(updated.modifiedCount === 0){
        res.json({
            message:'item is allready in the cart'
        })
      }

      else{
        throw new Error('error during the updation')
      }

    }
    catch(err){
       res.json(
        {messsage:'error occured during adding to the cart'}
       )
    }

    
    


})