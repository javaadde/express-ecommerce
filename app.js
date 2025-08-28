import express from 'express';
const app = express();


// DB ====== 
import session from 'express-session';
import MongoStore from 'connect-mongo';
const dbUrl = 'mongodb://localhost:27017/MyUsers';

import dotenv from 'dotenv'
dotenv.config();
const PORT = process.env.PORT || 8080


// routers ====
import {loginRouter} from './routes/login.js'
import {signUpRouter} from './routes/signup.js'

app.use('/login',loginRouter);
app.use('/signup',signUpRouter)
// ============


// session data Storing ============
app.use(session(
    {
        secret:'my session data',
        store: MongoStore.create(
            {
                mongoUrl: dbUrl,
                collectionName: 'sessions',
                ttl:new Date( Date.now() + 1000 * 60 * 60 * 24)
            }
        )
    }
))
// ==================================


// template setting and view setting =================

app.set('view engine', 'ejs')
app.set('views', 'views')

// =================================================== 


// error handle


app.get('/',(req,res) => {
    res.render(
        'home2',
        {
            title:'home'
        }
    )
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