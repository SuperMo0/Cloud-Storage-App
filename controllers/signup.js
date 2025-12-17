
import queries from "../db/queries.js";
import { check } from "./../lib/validator.js";
import bcrypt from 'bcrypt'


export function renderSignup(req, res) {
    let messages = req.session.messages || [];

    req.session.messages = [];

    res.render('signup', { messages });
}

export async function handleNewUser(req, res, next) {

    let validationMessages = check(req);

    if (validationMessages.length) {
        req.session.messages = validationMessages;
        return res.redirect('/signup');
    }

    let user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    try {
        user = await queries.insertUser(user);
        await queries.createRootFolder(user.id);
        req.login(user, (e) => {
            if (e) throw e;
            res.redirect('/home');
        });

    } catch (error) {
        next(error)
    }
}