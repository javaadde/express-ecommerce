import express from 'express'
export const loginRouter = express.Router()
import mongoose from 'mongoose'
import {body} from 'express-validator'
import {chekValResult}  from '../middleware/checkValResult.js'
// import bcrypt from 'bcrypt'

loginRouter.use(express.json())
loginRouter.use(express.urlencoded({extended:true}))

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
      console.log(data);

      await mongoose.connect(dbURL);
      console.log('connected to db');
      
      
      try{
         
      }

      catch( err) {
           
       
      }
      
        
})

