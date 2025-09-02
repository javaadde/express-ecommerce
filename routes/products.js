import express from 'express';
export const productRouter = express.Router()
import mongoose, { Schema } from 'mongoose';


// importing mongoose url and schema
import {dbURL , users} from './signup.js'
const proSchema = new Schema({
    _id:String,
    name:String,
    price:Number,
    category:String,
    url:String,
})

export const products = mongoose.model('products',proSchema)

productRouter.get('/', async(req,res)=>{
    await mongoose.connect(dbURL)
    console.log('connected');

    const allProducts = await products.find()
    
    // res.json({
    //     products:allProducts
    // })

    res.render('products',{
        products:allProducts
    })
})