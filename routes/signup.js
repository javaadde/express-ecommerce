import express from 'express'
export const signUpRouter = express.Router()
import mongoose from 'mongoose'
import {body} from 'express-validator'
import {chekValResult}  from '../middleware/checkValResult.js'

signUpRouter.use(express.json())
signUpRouter.use(express.urlencoded({extended:true}))

const dbURL = 'mongodb://localhost:27017/MyUsers'

const mySchema = mongoose.Schema({
     _id:String,
     password:String,
     info:{
          name:String,
          age:Number,
          phone:Number,
          email:String,
     } 
})

const users = mongoose.model('users2',mySchema)

signUpRouter.get('/',(req,res) => {
     res.render('signUp')

})




const userValidationRules = [
     body('username')
     .notEmpty().withMessage('pleae enter The User Name')
     .isLength({min:3}).withMessage('please take username atleast three charecters'),

     // body('email')
     // .isEmail().withMessage('invalid email address'),

     body('password')
     .isLength({min:6}).withMessage('please choice a password that has atleast six charecres')
]



signUpRouter.post('/',userValidationRules ,chekValResult,async (req,res) => {

     const data = req.body
      console.log(data);

      const doc = {
          _id: data.username,
          password: data.password
      }

      await mongoose.connect(dbURL);
      console.log('connected to db');
      
      
      try{
          const message = await users.insertOne(doc)
          console.log('inserted');
          res.json({
          message:'api working successfully',
          inserted:message
          }) 
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

