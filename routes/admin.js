import express from 'express'
export const adminRouter = express.Router()
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'

// importing products collection
import { products } from './products.js'
const dbURL = 'mongodb://localhost:27017/MyUsers'

adminRouter.use(express.json())
adminRouter.use(express.urlencoded({extended:true}))

adminRouter.use(session(
    {
         secret: 'your_secret_key',
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({ mongoUrl: 'mongodb://localhost/MyUsers' })
    }
))



adminRouter.get('/products',checkAdmin, async(req,res)=>{
    await mongoose.connect(dbURL)
    const allProducts = await products.find()

     res.render('adminProducts',{
        products:allProducts,
     })
})

adminRouter.post('/products/add', async(req,res) => {

    await mongoose.connect(dbURL);

    try{

    const inserted = await products.insertOne(req.body);

    console.log(inserted);

        res.json({
            message:'inserted success fully'
        })

    }

    catch(err){

        if(err.code === 11000){
         return    res.json({
                message:'the product_id is allready exists'
            })
        }
        
            console.error(err);
      

    }

})


adminRouter.delete('/products/delete', async(req,res) => {
    
    const product_id = req.body.pro_id
    
   await mongoose.connect(dbURL);
   const deleted = await products.deleteOne({_id:product_id})

   console.log(deleted);

   res.json({
    message:'deleted'
   })
   
})


adminRouter.put('/products/update',async(req,res)=>{
    
    const pro = req.body;
    const _id = req.body.id
   
    delete pro.id ;

    console.log(pro);
    

    await mongoose.connect(dbURL);

    try{
       const message =  await products.updateOne({_id:_id},{$set:
           pro
       })

       if(message.acknowledged === true){
        res.json({
            message: 'updated sucessfully'
        })
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



function checkAdmin(req,res,next){

    try{

    if(req.session.data.role === 'admin'){
      return next()
    }

    res.render('404')

    }
    catch(err){
        res.render('404')
    }
}


