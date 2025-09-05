import express from 'express';
const app = express();


// DB ====== 
import session from 'express-session';
import MongoStore from 'connect-mongo';
const dbUrl = 'mongodb://localhost:27017/MyUsers';

import dotenv from 'dotenv'
dotenv.config();
const PORT = process.env.PORT || 8080

// path
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// template setting and view setting =================

app.set('view engine', 'ejs')
app.set('views', 'views')


// routers ====
import {loginRouter} from './routes/login.js'
import {signUpRouter} from './routes/signup.js'
import {settingsRoute} from './routes/settings.js';
import { productRouter } from './routes/products.js';
import { adminRouter } from './routes/admin.js';
import { cartRouter } from './routes/cart.js';
import { ordersRouter} from './routes/orders.js';

app.use('/orders', ordersRouter);
app.use('/cart', cartRouter)
app.use('/admin',adminRouter);
app.use('/products',productRouter);
app.use('/login',loginRouter);
app.use('/signup',signUpRouter);
app.use('/settings',settingsRoute);
// ============


// session data Storing ============
app.use(session(
    {
         secret: 'your_secret_key',
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({ mongoUrl: 'mongodb://localhost/MyUsers' }),
    }
))
// ==================================



// error handle


app.get('/',(req,res) => {
   
   if(req.session.data){

     res.render(
        'home1',
        {
            title:'home'
        }
    )

   } 

   else{
     res.render(
        'home',{
            title:'home'
        }
     )
   }

   
})

app.get('/logout',(req,res)=>{
    delete req.session.data
    res.render('home')
})

app.use((req,res) => {
    res.status(404)
    .render(
        '404',{
            message:'404'
        }
    )
})




app.listen(PORT,()=> {
    console.log(`app listenig on port:${PORT}`);
    
})