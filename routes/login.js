import express from 'express'
export const loginRouter = express.Router()
import mongoose from 'mongoose'
import {body} from 'express-validator'
import bcrypt from 'bcrypt'
import session from 'express-session'
import {chekValResult}  from '../middleware/checkValResult.js'
import MongoStore from 'connect-mongo'


// importing mongoose url and schema
import {mySchema, users} from './signup.js'
// db uri
import dotenv from 'dotenv';
dotenv.config()
const dbURL = process.env.dbURL

loginRouter.use(express.json())
loginRouter.use(express.urlencoded({extended:true}))

loginRouter.use(session(
    {
         secret: 'your_secret_key',
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({ mongoUrl: 'mongodb://localhost/MyUsers' })
    }
))


loginRouter.get('/',(req,res) => {
     res.render('login')
})




const userValidationRules = [
     body('username')
     .notEmpty().withMessage('pleae enter The User Name')
     .isLength({min:3}).withMessage('please take username atleast three charecters'),

     body('password')
     .isLength({min:6}).withMessage('please choice a password that has atleast six charecres')
]


loginRouter.post('/',userValidationRules ,chekValResult,async (req,res) => {

     const data = req.body
      await mongoose.connect(dbURL);
      console.log('connected to db');

        
      try{
           
           const doc = await users.findOne({_id:data.username})
           console.log(doc);

           if(doc === null){
               return res.json({
                    message:'please login first',
               })
           }
           
           const passCurrect = await bcrypt.compare(data.password,doc.password)

           if(passCurrect){
       
              req.session.data = {
                     firstName: doc.info.fname , 
                     lastName:doc.info.lname ,
                     email: doc.info.lname,
                     username: doc._id,
                     role:doc.role
               }
               
     
              res.render('home1')
              
           }else{
               res.json({
                    message:'password or username is incurrect'
               })
           }
           
      }

      catch( err) {
           console.error(err);
      }
      
        
})

