import express from 'express'
export const signUpRouter = express.Router()
import mongoose from 'mongoose'
import {body} from 'express-validator'
import {chekValResult}  from '../middleware/checkValResult.js'
import session from 'express-session'
import bcrypt from 'bcrypt'
import MongoStore from 'connect-mongo'


signUpRouter.use(express.json())
signUpRouter.use(express.urlencoded({extended:true}))
signUpRouter.use(session(
       {
              secret: 'your_secret_key',
                 resave: false,
                 saveUninitialized: false,
                 store: MongoStore.create({ mongoUrl: 'mongodb://localhost/MyUsers' })
       }
))



// ==============================================================
export const dbURL = 'mongodb://localhost:27017/MyUsers'

export const mySchema = mongoose.Schema({
     _id:String,
     password:String,
     role:String,
     info:{
          fname:String,
          lname:String,   
          email:String,
     } 
})

export const users = mongoose.model('users',mySchema)
// ==============================================================



signUpRouter.get('/',(req,res) => {
     res.render('signUp')

})




const userValidationRules = [
     body('username')
     .notEmpty().withMessage('pleae enter The User Name')
     .isLength({min:3}).withMessage('please take username atleast three charecters'),

     body('password')
     .isLength({min:6}).withMessage('please choice a password that has atleast six charecres')
]



signUpRouter.post('/',userValidationRules ,chekValResult, async (req,res) => {

     const data = req.body
      console.log(data);

      const hashedPassword = await bcrypt.hash(data.password,10)

      const doc = {
          _id: data.username,
          password:hashedPassword,
          role:'user',
          info:{
               fname:data.firstName,
               lname:data.lastName,
               email:data.email,
          }
          
      }

      await mongoose.connect(dbURL);
      console.log('connected to db');
      
      
      try{
           await users.insertOne(doc)

          req.session.data = {
               username:doc._id,
               firstName:doc.info.fname,
               lastName:doc.info.lname,
               email:doc.info.email,
               role:doc.role
          }
          
          console.log('inserted');

          res.render('home1')
          

          // res.json({
          // message:'api working successfully',
          // inserted:insertedDoc
          // }) 
      }

      catch( err) {
           
           if(err.code === 11000){
                res.json({
                     message:'username is allready exist'
                    })
               }

               console.error(err);
      }
      
        
})

