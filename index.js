import express from 'express';
import controller from './controllers/controller.js';
import dotenv from 'dotenv';
dotenv.config();
import session from './lib/session.js';
import validate from './lib/validate.js'
import passport from './lib/passport.js';
import multer from 'multer';
const app = express();
let upload = multer();

app.set('view engine', 'ejs');


app.use(express.static('./public'));
app.use(express.static('./node_modules/@fortawesome/fontawesome-free'));
app.use(session);
app.use(passport.authenticate('session'));



app.get('/signup', controller.renderSignup);
app.get('/login', controller.renderLogin);
app.get('/', controller.renderHome)
app.get('/folder/:id', controller.handleViewFolder)


app.post('/signup', express.urlencoded({ extended: false }), validate.validateNewUser, controller.handleNewUser);
app.post('/login', express.urlencoded({ extended: false }), passport.authenticate('local'), controller.renderHome);
app.post('/upload', upload.single('file'), controller.handleUploadFile);

app.post('/{*splat}', express.urlencoded({ extended: false }), controller.handleNewFolder);

app.listen(3000);