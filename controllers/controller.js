
import prisma from "../db/queries.js";
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import queries from "../db/queries.js";
import { name } from "ejs";
import supbase from './../lib/supbase.js'



function renderSignup(req, res) {
    res.render('signup');
}

function renderLogin(req, res) {
    res.render('login');
}

async function renderHome(req, res) {
    if (!req.user) res.redirect('/login');
    const content = await queries.getUserFilesById(req.user.id, null);
    // console.log(content);
    res.render('home', { content: content, parent: null });
}

async function handleNewUser(req, res) {
    let data = req.body;
    let validationResults = validationResult(req);
    if (!validationResults.isEmpty()) { res.render('signup', { errors: validationResults.array }); return };
    let user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    try {
        await queries.insertUser(user);
        user = await queries.getUserByEmail(user.email);
        req.login(user, (e) => {
            if (e) throw e;
            res.redirect('/');
        });

    } catch (error) {
        res.render('signup', { errors: error });
    }
}


async function handleNewFolder(req, res) {
    let path = req.url.split('/');
    let parent = path[path.length - 1];
    let folder_name = req.body.folder_name;

    if (!parent.trim()) parent = null;


    console.log(folder_name);

    await queries.insertFile({
        name: folder_name,
        type: 'folder',
        parent_id: parent,
        user_id: req.user.id,
        owner: req.user
    })
    res.redirect(req.originalUrl);
}


async function handleViewFolder(req, res) {
    if (!req.user) { res.redirect('login'); return };
    let folder_id = req.params.id;
    let content = await queries.getUserFilesById(req.user.id, folder_id);
    let folder = await queries.getFileById(folder_id, req.user.id);
    let parent = folder.parent_id;
    res.render('home', { content, parent });
}


async function handleUploadFile(req, res) {

    let path = req.body.path.split('/');
    let parent = path[path.length - 1];

    if (!parent.trim()) parent = null;

    try {
        let url = await supbase.uploadSingleFile(req.file);
        let file = {};
        file.name = req.file.originalname;
        file.size = req.file.size;
        file.link = url;
        file.extension = req.file.mimetype;
        file.user_id = req.user.id
        file.parent_id = parent;
        file.type = 'file';
        await queries.insertFile(file)
        res.send('ok');
    }
    catch (e) {
        res.send('error uploading file');
        return;
    }
}


export default { renderHome, renderLogin, renderSignup, handleNewUser, handleNewFolder, handleViewFolder, handleUploadFile };