import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import loginRouter from './routes/login.js'
import signupRouter from './routes/signup.js'
import homeRouter from './routes/home.js'



import session from './lib/session.js';
import * as validator from './lib/validator.js'
import passport from './lib/passport.js';
import multer from 'multer';
const app = express();

let upload = multer();

app.set('view engine', 'ejs');


app.use(express.static('./public'));
app.use(express.static('./node_modules/@fortawesome/fontawesome-free'));
app.use(session);
app.use(passport.authenticate('session'));

app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/home', homeRouter)


// app.get('/folder/:id', controller.handleViewFolder)


// app.post('/upload', upload.single('file'), controller.handleUploadFile);



/*app.use((error, req, res, next) => {

    res.render('error', { error });
})*/

app.listen(3000);