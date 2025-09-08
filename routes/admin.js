import express from 'express'
export const adminRouter = express.Router()
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose, { mongo } from 'mongoose'

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


adminRouter.get('/', async(req,res) => {

    try{

        await mongoose.connect(dbURL)
        const total_products = await products.find().countDocuments() 
        const total_orders = await orders.find().countDocuments()
        const registered_users = await users.find().countDocuments()
        const total_revenew = await orders.aggregate([
            {$group:{
                _id:null, 
                sum:{$sum:"$total"}
            }},
        ])

        console.log(total_revenew);
        
        
        res.render('adminDashBoard',{
            total_revenew:total_revenew[0].sum,
            registered_users:registered_users,
            total_orders:total_orders,
            total_products:total_products,
        })
    }
    catch(err){
        console.log(err);
    }
})



// ==================================[products]


adminRouter.get('/products',checkAdmin, async(req,res)=>{

    const category = req.query.category || undefined
    const id = req.query.id || undefined
    console.log(id, category);

    await mongoose.connect(dbURL)


    if(category != undefined){

        if(category === 'all'){
     
            const allProducts = await products.find()
             res.render('adminProducts',{
                products:allProducts,
                category:category,
                id:''
             })
        }
        else{
           
             const allProducts = await products.find({category:category})
            
             res.render('adminProducts',{
                products:allProducts,
                category:category,
                id:''
             })
        }

    
    }

    else if(id != undefined){
     const allProducts = await products.find({_id:id})
    
     res.render('adminProducts',{
        products:allProducts,
        category:'',
        id:id
     })
    
    }

    else{
     const allProducts = await products.find()
    
     res.render('adminProducts',{
        products:allProducts,
        category:'',
        id:'id'
     })        
    }

})





adminRouter.post('/products/add',checkAdmin, async(req,res) => {

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


adminRouter.delete('/products/delete',checkAdmin, async(req,res) => {
    
    const product_id = req.body.pro_id
    
   await mongoose.connect(dbURL);
   const deleted = await products.deleteOne({_id:product_id})

   console.log(deleted);

   res.json({
    message:'deleted'
   })
   
})


adminRouter.put('/products/update',checkAdmin,async(req,res)=>{
    
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

// ==============================================[orders]==============================================
//  importing orders collection 
import { orders } from './cart.js'
import { users } from './signup.js'


adminRouter.get('/orders',checkAdmin,(req,res)=>{
    res.render('ordersA',{
        username:'username'
    })
})

adminRouter.get('/orders/:username',checkAdmin, async(req,res)=>{
     const user_id = req.params.username;
    try{
       
            await mongoose.connect(dbURL )
            const orderArray = await orders.find({user_id:user_id})
            res.render('adminOrders',{
                orders:orderArray,
                username:user_id,
            })
        }
        catch(err){
          console.log(err);
        }
})


// order details for crud 

adminRouter.get('/order/details/:id',checkAdmin, async(req,res)=>{
    const order_id = req.params.id;
    try{
        await mongoose.connect(dbURL);
        const data = await orders.findOne({_id:order_id})
        res.render('adminOrderCrud',{
            details:data,
        })
    }
    catch(err){
        console.log(err);
        
    }
})


// ===================[crud]===>


    //  status updations 
    adminRouter.put('/order/:id/status',checkAdmin, async(req,res)=>{
        const order_id = req.params.id;
        const statusInp = req.body.status;

        try{
            await mongoose.connect(dbURL);
            const updt = await orders.updateOne({_id:order_id},{$set:{status:statusInp}})
            console.log('ok');
            res.json(
                {Status:statusInp}
            )
        }
        catch(err){
            console.log(err);
        }
    })


    // order deletion
    adminRouter.delete('/order/delete/:id',checkAdmin,async(req,res)=>{
        const order_id = req.params.id;
        try{
            await mongoose.connect(dbURL);
            const dlt =  await orders.deleteOne({_id:order_id});

            console.log(dlt);
            
            res.json({
                msg:'deleted'
            })
        }
        catch(err){
            console.log(err);
            
        }
    })



    // ==========================================[ USERS DIRECTORY ]==========================================

    adminRouter.get('/users', async (req,res) =>{

        await mongoose.connect(dbURL);
        const allusers = await users.find()

        console.log(allusers);
        
        res.render('allUsers',{
            users:allusers
        })
    })