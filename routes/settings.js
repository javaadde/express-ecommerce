import express, { urlencoded } from 'express';
export const settingsRoute = express.Router() 
import session from 'express-session';
import MongoStore from 'connect-mongo';

// importing mongoose url and schema
import {dbURL , mySchema, users} from './signup.js'
import mongoose from 'mongoose';


settingsRoute.use(express.json());
settingsRoute.use(express.urlencoded({extended:true}))
settingsRoute.use(session(
    {
         secret: 'your_secret_key',
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({ mongoUrl: 'mongodb://localhost/MyUsers' })
    }
))

settingsRoute.get('/',(req,res) =>{  
    
    console.log(req.session.data);
    

    res.render('setting',
        {
            firstName:req.session.data.firstName,
            lastName:req.session.data.lastName,
            email:req.session.data.email,
            username:req.session.data.username

        }
    )
})


settingsRoute.post('/',async (req,res)=>{
  
    const filter = req.session.data.username;
    console.log(filter);
    
    const update = req.body;

    await mongoose.connect(dbURL);

    const data = await users.updateOne({_id:filter},
        
        {
            'info.fname':update.firstName,
            'info.lname':update.lastName, 
            'info.email':update.email,
            
        },

        {upsert:true})

    console.log(data);
    
    res.json({
        message:'sved successlly',
        finded_user:data,
        saved_data:req.body
    })
})