import express from 'express';
export const cartRouter = express.Router();

import dotenv from 'dotenv';
dotenv.config();

import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose, { model } from 'mongoose';
import { body } from 'express-validator';

cartRouter.use(express.json())
cartRouter.use(express.urlencoded({extended:true}))

cartRouter.use(session(
    {
         secret: 'your_secret_key',
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({ mongoUrl: 'mongodb://localhost/MyUsers' })
    }
))

// ============================================================================================================
// ======================================[ CArt Schema]========================================================
// ============================================================================================================

const dbURL = process.env.dbURL;

export const cartSchema = mongoose.Schema({
    _id:String,
    items:Array,
    subtotal:Number,
})

export const carts = mongoose.model('carts',cartSchema) 

// ============================================================================================================


cartRouter.get('/',async(req,res)=>{

    if(req.session && req.session.data){

        if( req.session.data.role === 'admin' ){
         return  res.render('404')
        }

    const cartId = req.session.data.username;
    
    await mongoose.connect(dbURL)
    const cartData = await carts.findOne({_id:cartId})

    
    res.render('cart',{
        items:cartData.items,
        subtotal:0,
    })

   }else{
    res.render('login')
   }
})



// ===========================================================
// =====================[deleting cart items]=================
// ===========================================================




cartRouter.delete('/delete/:id', async(req,res)=>{
    const product_id = req.params.id
    const user_id = req.session.data.username;

    console.log(product_id);
    
    try{

    await mongoose.connect(dbURL)
    const updated = await carts.updateOne({_id:user_id}, {$pull:{items:{product_id:product_id}}})

    
     if(updated.modifiedCount > 0){
        res.json({
            message:'deleted the item'
        })
     }
    }

    catch(err){
        console.log(err);
    }

    
    
})





// ========================================================================
// =====================[increase and decrease cart items]=================
// ========================================================================



cartRouter.patch('/quantity/:operation', async(req,res)=> {

    
     const user_id = req.session.data.username;
     const product_id = req.body.product_id
     const operation = req.params.operation

     try{

     await mongoose.connect(dbURL)
     if(operation === 'increase'){
         const updated = await carts.updateOne(
            {_id:user_id, "items.product_id":product_id},
            {$inc:{"items.$.quantity":1}}
         )

         if (updated.modifiedCount === 1) {
            res.json({
                message:'incresed'
            })
         }
     }else if(operation === 'decrease'){
        
           const updated = await carts.updateOne(
            {_id:user_id, "items.product_id":product_id},
            {$inc:{"items.$.quantity":-1}}
         )

         if (updated.modifiedCount === 1) {
            res.json({
                message:'decresed'
            })
         }
     }
     else{
         res.json({
            message:'error occured during the updation'
         })
     }

    }

    catch(err){
        console.error(err);
    }
})




// ========================================================================
// ===========================[ placing order ]============================
// ========================================================================



// ======================================[ order Schema ]========================================================

  const orderSchema =  mongoose.Schema({
      user_id:String,
      items:Array,
      total:Number,
      status:{type:String, default:'Placed'},
      date:{type:Date, default:Date.now},
      address:Object,
  })

export  const orders = mongoose.model('orders',orderSchema);

// ============================================================================================================



cartRouter.post('/order', async(req,res) => {

console.log('request came in');

   try{
    
   await mongoose.connect(dbURL);

   const subtotal =  req.body.total
   const address =  req.body.address
   const user_id =  req.session.data.username

   // finding the user's cart taking the subtotal and items

   const cartData = await carts.findOne({_id:user_id});
   console.log(cartData);
   
   // storing order data 

   const inserted = await orders.insertOne({
     user_id:user_id,
     items:cartData.items,
     total:subtotal,
     address:address,
   })

   console.log('inserted',inserted);

   res.json({
     message:'inserted sucessfully'
   })

  }

  catch(err){
    console.error(err);
  }
   
   
  
})


// ======================================[ cart clearing ]========================================================

cartRouter.patch('/clear', async(req,res) =>{
   const user_id = req.session.data.username
   
   try{
    await mongoose.connect(dbURL);

    const updated = await carts.updateOne({_id:user_id}, {$unset:{items:""}});

    // console.log('cart cleared', updated);

    res.json({
        message:'cart is cleared'
    })
    

   }
   catch(err){
    console.log(err);
    
   }
})